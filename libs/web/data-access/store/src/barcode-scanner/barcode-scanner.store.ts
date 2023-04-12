import { BehaviorSubject } from 'rxjs'
import { create } from 'zustand'

import { BarcodeScannerBottomSheetState, BarcodeScannerState } from './barcode-scanner.state'

export const useBarcodeScannerStore = create<BarcodeScannerState>()((set) => ({
  onBarcodesDetected$: new BehaviorSubject<string[]>([]),
  onError$: new BehaviorSubject(new Error()),
  onCapture$: new BehaviorSubject<unknown>(null),
}))

export const useBottomSheetStore = create<BarcodeScannerBottomSheetState>()((set) => ({
  display(canvas, detectionCallback) {
    set((state) => ({
      visible: true,
      canvas,
      detectionCallback,
    }))
  },

  dispose() {
    set((state) => ({
      visible: false,
      canvas: undefined,
    }))
  },
}))
