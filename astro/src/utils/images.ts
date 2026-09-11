export function responsiveSrcset(path: string, ext: string, fullWidth: number, tierWidths: number[] = [960, 1920, 2880]): string {
  const base = path.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const tiers = tierWidths.filter((w) => w < fullWidth);
  const parts = tiers.map((w) => `${base}-${w}w.${ext} ${w}w`);
  parts.push(`${base}.${ext} ${fullWidth}w`);
  return parts.join(', ');
}

export function avifPath(path: string): string {
  return path.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
}
