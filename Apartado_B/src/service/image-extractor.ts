const IMG_SRC_REGEX = /<img\b[^>]*\bsrc\s*=\s*"([^"]*)"[^>]*>/gi

export function extractImageLinks(html: string): string[] {
  return [...html.matchAll(IMG_SRC_REGEX)].map((match) => match[1])
}
