import { BarcodeFormat } from './BarcodeFormat'

export interface BarcodeResult {
  format: BarcodeFormat
  rawValue: string
}
