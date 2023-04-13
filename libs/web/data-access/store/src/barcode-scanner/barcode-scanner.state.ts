import { BehaviorSubject } from 'rxjs'

export interface BarcodeScannerState {
  onBarcodesDetected$: BehaviorSubject<string[]>
  onError$: BehaviorSubject<Error>
  onCapture$: BehaviorSubject<unknown>
}

export interface BarcodeScannerBottomSheetState {
  use?: boolean
  visible?: boolean
  canvas?: HTMLCanvasElement
  detectionCallback?: (imageData: ImageData) => any

  active(): void
  dispose(): void

  hide(): void
  display(
    canvas: BarcodeScannerBottomSheetState['canvas'],
    detectionCallback: BarcodeScannerBottomSheetState['detectionCallback']
  ): void
}
