export default function setStyles(element: HTMLElement, style: Partial<CSSStyleDeclaration>): void {
  for (const property in style) {
    const value = style[property]
    if (value !== undefined) {
      element.style[property] = value
    }
  }
}
