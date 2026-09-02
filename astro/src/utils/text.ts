export function breakZhTitle(title: string): string {
  const escaped = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/(，|–)/g, '$1<br />');
}
