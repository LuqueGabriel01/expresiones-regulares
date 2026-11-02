import './style.css'
import { extractImageLinks } from './service/image-extractor'

const textarea = document.querySelector<HTMLTextAreaElement>('#html-input')!
const button = document.querySelector<HTMLButtonElement>('#extract-btn')!
const result = document.querySelector<HTMLDivElement>('#result')!

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderEmpty() {
  result.innerHTML = `
    <div class="result result--error">
      <p>No se han encontrado imágenes en el HTML introducido.</p>
    </div>
  `
}

function renderLinks(links: string[]) {
  result.innerHTML = `
    <div class="result result--success">
      <p><strong>${links.length}</strong> imagen${links.length === 1 ? '' : 'es'} encontrada${links.length === 1 ? '' : 's'}:</p>
      <ul class="link-list">
        ${links
          .map((link) => {
            const safeLink = escapeHtml(link)
            return `<li><a href="${safeLink}" target="_blank" rel="noopener">${safeLink}</a></li>`
          })
          .join('')}
      </ul>
      <div class="image-grid">
        ${links.map((link) => `<img src="${escapeHtml(link)}" alt="" loading="lazy" />`).join('')}
      </div>
    </div>
  `
}

function handleExtract() {
  const links = extractImageLinks(textarea.value)

  if (links.length === 0) {
    renderEmpty()
    return
  }

  renderLinks(links)
}

button.addEventListener('click', handleExtract)
