export function getImageFromCanvas(canvas: HTMLCanvasElement | null) {
  if (canvas) {
    return createImageBitmap(canvas)
  }

  return undefined
}

export function getCanvasSections(canvas?: HTMLCanvasElement) {
  const context = canvas?.getContext('2d')
  if (!canvas || !context) {
    throw new Error('No canvas context')
  }

  const sections = new Array<ImageData>()
  const height = canvas.height
  const width = canvas.width

  // splitted sections from the image
  const splittableSections = height > width ? 4 : 2
  const singleSectionHeight = height / splittableSections

  for (
    let sectionIndex = 0, yCoordinate = 0;
    sectionIndex < splittableSections;
    sectionIndex++, yCoordinate += singleSectionHeight
  ) {
    sections.push(context.getImageData(0, yCoordinate, width, singleSectionHeight))
  }

  return sections
}
