export function getImageFromCanvas(canvas: HTMLCanvasElement | null) {
  if (canvas) {
    return createImageBitmap(canvas)
  }

  return undefined
}
