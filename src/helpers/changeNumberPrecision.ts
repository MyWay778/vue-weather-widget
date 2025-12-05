export default function changeNumberPrecision(number: number, precision = 1): number {
  return Number(number.toFixed(precision))
}
