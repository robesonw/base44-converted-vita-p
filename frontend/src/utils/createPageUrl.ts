export function createPageUrl(n: string): string {
  return '/' + n.toLowerCase().replace(/\s+/g, '-');
}