export default function setElementTransform(element: HTMLElement, { x = 0, y = 0, scale = 0 }): void {
  let transform = ''

  if (x || y) {
    transform = `translate(${x}px, ${y}px)`
  }

  if (scale) {
    transform += ` scale(${scale})`
  }

  if (!transform) return

  element.style.transform = transform
}
