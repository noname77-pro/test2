export function fmt(value: number, digits = 2): string {
  const v = Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value
  return v.toFixed(digits)
}
