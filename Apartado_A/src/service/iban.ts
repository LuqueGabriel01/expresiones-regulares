import type { IbanResult, IbanStructure } from '../types/iban.types'
import { BANK_CODES } from '../constants/iban.constants'
import { isValidIBAN } from 'ibantools';

export function normalizeIban(rawIban: string): string {
    return rawIban
        .trim()
        .toUpperCase()
        .replace(/[\s-]/g, '');
}

export function isValidIbanFormat(iban: string): boolean {
    const IBAN_REGEX = /^ES\d{22}$/;
    return IBAN_REGEX.test(iban);
}

export function isValidIbanChecksum(iban: string): boolean {
    return isValidIBAN(iban);
}

export function parseIbanStructure(iban: string): IbanStructure {
    return {
        countryCode: iban.slice(0, 2),
        ibanCheckDigits: iban.slice(2, 4),
        bankCode: iban.slice(4, 8),
        branchCode: iban.slice(8, 12),
        accountCheckDigits: iban.slice(12, 14),
        accountNumber: iban.slice(14, 24)
    }
}

export function getBankName(bankCode: string): string | undefined {
    return BANK_CODES[bankCode];
}

export function getIbanInfo(rawIban: string): IbanResult {
    const iban = normalizeIban(rawIban);
    const errors: string[] = [];

    const isFormatValid = isValidIbanFormat(iban);

    if (!isFormatValid) {
        errors.push('IBAN format is invalid.');

        return {
            originalIban: rawIban,
            normalizedIban: iban,
            isFormatValid: false,
            isIbanValid: false,
            errors,
        };
    }

    const isIbanValid = isValidIbanChecksum(iban);

    if (!isIbanValid) {
        errors.push('IBAN checksum is invalid (failed mod-97 verification).');

        return {
            originalIban: rawIban,
            normalizedIban: iban,
            isFormatValid: true,
            isIbanValid: false,
            errors,
        };
    }

    const structure = parseIbanStructure(iban);
    const bankName = getBankName(structure.bankCode);

    if (!bankName) {
        errors.push(`Bank code "${structure.bankCode}" not found in the known bank list.`);
    }

    return {
        originalIban: rawIban,
        normalizedIban: iban,
        isFormatValid: true,
        isIbanValid: true,
        structure,
        bankName,
        errors,
    };
}