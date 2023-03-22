export interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void
  onError: (error: Error) => void
}
