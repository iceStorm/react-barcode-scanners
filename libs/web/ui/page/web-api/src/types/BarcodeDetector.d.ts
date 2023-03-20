import { BarcodeFormat } from './BarcodeFormat'
import { BarcodeResult } from './BarcodeResult'

interface BarcodeDetectorOptions {
  formats?: BarcodeFormat[]
}

declare global {
  declare class BarcodeDetector {
    constructor(options: BarcodeDetectorOptions)

    static getSupportedFormats(): Promise<BarcodeFormat>

    detect(image: ImageBitmap): Promise<BarcodeResult[]>
  }
}
