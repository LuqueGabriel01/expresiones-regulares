
export interface IbanStructure {
  countryCode: string;     
  ibanCheckDigits: string;   
  bankCode: string;          
  branchCode: string;         
  accountCheckDigits: string; 
  accountNumber: string;     
}

export interface IbanResult {
  originalIban: string;
  normalizedIban: string;
  isFormatValid: boolean;
  isIbanValid: boolean;
  structure?: IbanStructure;
  bankName?: string;
  errors: string[];
}