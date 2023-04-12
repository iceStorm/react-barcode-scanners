import { BehaviorSubject } from 'rxjs'

export interface BarcodeScannerState {
  onBarcodesDetected$: BehaviorSubject<string[]>
  onError$: BehaviorSubject<Error>
  onCapture$: BehaviorSubject<unknown>
}

export interface BarcodeScannerBottomSheetState {
  visible?: boolean
  canvas?: HTMLCanvasElement
  detectionCallback?: (imageData: ImageData) => any

  dispose(): void

  display(
    canvas: BarcodeScannerBottomSheetState['canvas'],
    detectionCallback: BarcodeScannerBottomSheetState['detectionCallback']
  ): void
}
