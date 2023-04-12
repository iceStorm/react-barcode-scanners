export function getImageFromCanvas(canvas: HTMLCanvasElement | null) {
  if (canvas) {
    return createImageBitmap(canvas)
  }

  return undefined
}

export function getCanvasSections(canvas?: HTMLCanvasElement, includeOriginal = true) {
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

  if (includeOriginal) {
    sections.push(context.getImageData(0, 0, width, height))
  }

  return sections
}

export function imagedataToImage(imageData: ImageData) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No canvas context provided')
  }

  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx.putImageData(imageData, 0, 0)

  return canvas.toDataURL()
}
