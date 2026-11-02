import './style.css'
import { getIbanInfo } from './service/iban'
import type { IbanResult } from './types/iban.types'

const input = document.querySelector<HTMLInputElement>('#iban-input')!
const button = document.querySelector<HTMLButtonElement>('#search-btn')!
const result = document.querySelector<HTMLDivElement>('#result')!

function renderErrors(info: IbanResult) {
  result.innerHTML = `
    <div class="result result--error">
      <p><strong>IBAN:</strong> ${info.originalIban}</p>
      <ul>
        ${info.errors.map((error) => `<li>${error}</li>`).join('')}
      </ul>
    </div>
  `
}

function renderSuccess(info: IbanResult) {
  const structure = info.structure!

  result.innerHTML = `
    <div class="result result--success">
      <p><strong>IBAN:</strong> ${info.normalizedIban}</p>
      <table>
        <tbody>
          <tr><td>Banco</td><td>${info.bankName ?? 'Desconocido'}</td></tr>
          <tr><td>Código de banco</td><td>${structure.bankCode}</td></tr>
          <tr><td>Oficina</td><td>${structure.branchCode}</td></tr>
          <tr><td>Dígito de control (IBAN)</td><td>${structure.ibanCheckDigits}</td></tr>
          <tr><td>Dígito de control (cuenta)</td><td>${structure.accountCheckDigits}</td></tr>
          <tr><td>Cuenta</td><td>${structure.accountNumber}</td></tr>
        </tbody>
      </table>
      ${info.errors.length
        ? `<ul class="warnings">${info.errors.map((error) => `<li>${error}</li>`).join('')}</ul>`
        : ''
      }
    </div>
  `
}

function handleSearch() {
  const rawIban = input.value

  if (!rawIban.trim()) {
    result.innerHTML = `<div class="result result--error"><p>Introduce un IBAN.</p></div>`
    return
  }

  const info = getIbanInfo(rawIban)

  if (!info.isFormatValid || !info.isIbanValid) {
    renderErrors(info)
    return
  }

  renderSuccess(info)
}

button.addEventListener('click', handleSearch)
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
})
