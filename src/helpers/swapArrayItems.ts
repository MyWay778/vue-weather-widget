export default function swapArrayItems<T>(array: T[], firstIndex: number, secondIndex: number): T[] {
  const arrayCopy = [...array]

  if (!arrayCopy[firstIndex] || !arrayCopy[secondIndex]) return arrayCopy

  const firstItem = arrayCopy[firstIndex]
  arrayCopy[firstIndex] = arrayCopy[secondIndex]
  arrayCopy[secondIndex] = firstItem

  return arrayCopy
}
