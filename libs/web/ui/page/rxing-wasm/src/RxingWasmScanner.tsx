import { useContext, useEffect, useRef, useState } from 'react'

import WebCam from 'react-webcam'
import { convert_js_image_to_luma, decode_barcode } from 'rxing-wasm'

import { CameraPicker } from '@react-barcode-scanners/web/ui/component/camera-picker'

import { ContextBarcodeScanner } from '@react-barcode-scanners/web/data-access/context/barcode-scanner'

export function RxingWasmScanner() {
  const { onBarcodeDetected, onError } = useContext(ContextBarcodeScanner)

  const detectionDelay = 1000
  const [isScanning, setIsScanning] = useState(false)

  const webcamRef = useRef<WebCam>(null)
  const detectInterval = useRef<NodeJS.Timer>()

  useEffect(() => {
    //

    return () => {
      setIsScanning(false)
    }
  }, [])

  function decodeBarcode(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d')

    if (!context) {
      return undefined
    }

    const height = canvas.height
    const width = canvas.width
    const imageData = context.getImageData(0, 0, width, height)

    const data = imageData.data
    const luma8Data = convert_js_image_to_luma(data)
    const parsedBarcode = decode_barcode(luma8Data, width, height)

    return parsedBarcode
  }

  async function startScanning() {
    console.log('scanning...')
    setIsScanning(true)

    if (detectInterval.current) {
      clearInterval(detectInterval.current)
    }

    detectInterval.current = setInterval(() => {
      if (webcamRef.current) {
        try {
          const frameCanvas = webcamRef.current.getCanvas()

          if (frameCanvas) {
            const barcodeResuls = decodeBarcode(frameCanvas)

            if (barcodeResuls?.text()) {
              onBarcodeDetected(barcodeResuls.text())
            }
          }
        } catch (error: any) {
          if (error !== 'not found') {
            console.error('Error when detecting barcodes:', error)
            onError(error.message ? error : new Error(error))
          }
        }
      }
    }, detectionDelay)
  }

  function pauseScanning() {
    setIsScanning(false)
  }

  return (
    <div>
      <CameraPicker
        onStartScanning={(cameraId) => startScanning()}
        onPauseScanning={() => pauseScanning()}
        isScanning={isScanning}
      />

      {isScanning && <WebCam ref={webcamRef} videoConstraints={{ facingMode: 'environment' }} />}
    </div>
  )
}
