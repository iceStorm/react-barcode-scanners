import { BehaviorSubject } from 'rxjs'

export interface BarcodeScannerProps {
  onBarcodeDetected: (barcodes: string[] | string) => void
  onError: (error: Error) => void
  onCapture$: BehaviorSubject<unknown>
}
