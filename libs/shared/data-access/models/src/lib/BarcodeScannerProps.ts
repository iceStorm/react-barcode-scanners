export interface BarcodeScannerProps {
  onBarcodeDetected: (barcodes: string[] | string) => void
  onError: (error: Error) => void
}
