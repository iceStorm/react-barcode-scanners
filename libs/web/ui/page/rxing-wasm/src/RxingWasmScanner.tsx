import { useCallback, useEffect, useRef, useState } from 'react'

import { notification } from 'antd'
import WebCam from 'react-webcam'
import { filter } from 'rxjs'

import {
  convert_js_image_to_luma,
  DecodeHintDictionary,
  DecodeHintTypes,
  decode_barcode_with_hints,
} from 'rxing-wasm'

import { CameraPicker } from '@react-barcode-scanners/web/ui/component/camera-picker'
import {
  useBarcodeScannerStore,
  useBottomSheetStore,
} from '@react-barcode-scanners/web/data-access/store'

export function RxingWasmScanner() {
  const { onBarcodesDetected$, onCapture$, onError$ } = useBarcodeScannerStore()
  const { display, active: activeBottomSheet, dispose: disposeBottomSheet } = useBottomSheetStore()

  const detectionDelay = 50
  const [isScanning, setIsScanning] = useState(false)

  const webcamRef = useRef<WebCam>(null)
  const detectInterval = useRef<NodeJS.Timer>()

  useEffect(() => {
    activeBottomSheet()

    onCapture$.pipe(filter((value) => Boolean(value))).subscribe(() => {
      captureSingleImageFrame()
    })

    return () => {
      setIsScanning(false)
      disposeBottomSheet()
    }
  }, [])

  const extractBarcodeFromImage = useCallback((imageData: ImageData) => {
    const data = imageData.data
    const luma8Data = convert_js_image_to_luma(new Uint8Array(data))

    const hints = new DecodeHintDictionary()
    hints.set_hint(DecodeHintTypes.TryHarder, 'true')

    const parsedBarcode = decode_barcode_with_hints(
      luma8Data,
      imageData.width,
      imageData.height,
      hints
    )

    return parsedBarcode.text()
  }, [])

  // async function startAutoScanning() {
  //   console.log('scanning...')
  //   setIsScanning(true)

  //   if (detectInterval.current) {
  //     clearInterval(detectInterval.current)
  //   }

  //   detectInterval.current = setInterval(() => {
  //     if (webcamRef.current) {
  //       try {
  //         const frameCanvas = webcamRef.current.getCanvas()

  //         if (frameCanvas) {
  //           const barcodeResults = decodeBarcode(frameCanvas)
  //           console.log(
  //             'barcodeResults:',
  //             barcodeResults?.map((res) => res.text())
  //           )

  //           onBarcodeDetected(barcodeResults?.map((res) => res.text()))
  //         }
  //       } catch (error: any) {
  //         if (error !== 'not found') {
  //           console.error('Error when detecting barcodes:', error)
  //           onError(error.message ? error : new Error(error))
  //         }
  //       }
  //     }
  //   }, detectionDelay)
  // }

  function pauseScanning() {
    setIsScanning(false)
  }

  async function captureSingleImageFrame() {
    if (!webcamRef.current) {
      return notification.warning({
        message: 'Warning',
        description: 'WebCam not yet started',
      })
    }

    try {
      const canvas = webcamRef.current.getCanvas()

      if (canvas) {
        const context = canvas.getContext('2d')
        if (!context) {
          throw new Error('No canvas context')
        }

        display(canvas, extractBarcodeFromImage)
      }
    } catch (error: any) {
      if (error !== 'not found') {
        console.error('Error when detecting barcodes:', error)
        onError$.next(error.message ? error : new Error(error))
      }
    }
  }

  return (
    <div>
      <CameraPicker
        onStartScanning={(cameraId) => setIsScanning(true)}
        onPauseScanning={() => pauseScanning()}
        isScanning={isScanning}
      />

      {isScanning && (
        <WebCam
          ref={webcamRef}
          forceScreenshotSourceSize={true}
          videoConstraints={{
            facingMode: 'environment',
            width: { ideal: 4096 },
            height: { ideal: 2160 },
          }}
          className="w-full max-h-full"
        />
      )}
    </div>
  )
}
