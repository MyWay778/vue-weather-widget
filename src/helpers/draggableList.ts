import { setElementTransform, swapArrayItems } from '@/helpers'

export function draggableList(
  list: HTMLElement,
  items: HTMLElement[],
  onChange: (oldItemIndex: number, newItemIndex: number) => void,
  options: { scale: number } = { scale: 1.03 }
) {
  if (!list || !items.length) {
    console.warn('draggableList: list elements or items elements are undefined!')
    return
  }

  const { scale } = options

  let initialX = 0
  let initialY = 0

  let activeEl: HTMLElement | null = null
  let activeIndex = -1

  let listRect: DOMRect
  update()

  function update() {
    listRect = list.getBoundingClientRect()
  }

  const onDragStart = (event: MouseEvent, index: number) => {
    initialX = event.x
    initialY = event.y

    activeEl = items[index] ?? null
    activeIndex = index

    if (!activeEl) return

    // make active element visually active
    setElementTransform(activeEl, { scale })
    window.addEventListener('mousemove', onDrag)
  }

  const onDrag = (event: MouseEvent) => {
    if (!activeEl) return

    const x = event.x - initialX
    const y = event.y - initialY

    // moving active element
    setElementTransform(activeEl, { x, y, scale })

    // get position of activeEl(draggable)
    const activeRect = activeEl.getBoundingClientRect()

    // loop through elements to find intersection with activeEl(draggable)
    items.forEach((target, targetIndex) => {
      // current dragged element
      if (target === activeEl) return

      // get target(target for drop) position
      const targetRect = target.getBoundingClientRect()

      // if active (draggable) element is in position (above or below target) - swap elements
      if (activeBelowTarget() || activeAboveTarget()) {
        swapActiveAndTarget()
      }

      function activeBelowTarget(): boolean {
        return (
          activeIndex < targetIndex && // active el was before target in items array
          targetRect.top < activeRect.top &&
          targetRect.bottom < activeRect.bottom
        )
      }

      function activeAboveTarget(): boolean {
        return (
          activeIndex > targetIndex && // active el was after target in items array
          targetRect.top > activeRect.top &&
          targetRect.bottom > activeRect.bottom
        )
      }

      function swapActiveAndTarget(): void {
        items = swapArrayItems(items, activeIndex, targetIndex)

        // notify onChange listener, activeIndex === oldIndex, targetIndex === newIndex
        onChange(activeIndex, targetIndex)

        // update index of active element
        activeIndex = targetIndex

        // by changing the order of the elements, we need to update the position of the active element
        updateActivePos()
      }

      function updateActivePos(): void {
        if (!activeEl) return

        // we are using scaling in the transform that resizes the element, so we need to resolve this difference
        const scaleXDiff = getScaleDiff(activeRect.width)
        // after changing the order of the elements, the active element is set to the place of the target element,
        // but the active element can be shifted from the target, and we need to get this shift offset
        const actualX = activeRect.x - targetRect.x + scaleXDiff
        // initialX - the current mouse position without the x offset of the active element
        initialX = event.x - actualX

        const scaleYDiff = getScaleDiff(activeRect.height)
        const actualY = activeRect.y - targetRect.y + scaleYDiff
        initialY = event.y - actualY

        // update active element position
        setElementTransform(activeEl, { x: actualX, y: actualY, scale })
      }

      function getScaleDiff(size: number): number {
        const RECTANGLE_PARALLEL_SIDES = 2
        return (size - size / scale) / RECTANGLE_PARALLEL_SIDES
      }
    })

    // if the active (draggable) element is outside the list, stop dragging
    if (activeIsOutOfBounds()) {
      onDragEnd()
    }

    function activeIsOutOfBounds(): boolean {
      if (!listRect) return false

      return (
        listRect.left > activeRect.right ||
        listRect.top > activeRect.bottom ||
        listRect.right < activeRect.left ||
        listRect.bottom < activeRect.top
      )
    }
  }

  const onDragEnd = () => {
    if (!activeEl) return

    activeEl.style.transform = ''
    initialX = 0
    initialY = 0
    activeEl = null
    activeIndex = -1

    window.removeEventListener('mousemove', onDrag)
  }

  return { onDragStart, onDragEnd, update }
}
