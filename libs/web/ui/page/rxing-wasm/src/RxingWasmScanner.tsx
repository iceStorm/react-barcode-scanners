import { useContext, useEffect, useRef, useState } from 'react'

import WebCam from 'react-webcam'
import {
  convert_js_image_to_luma,
  DecodeHintDictionary,
  DecodeHintTypes,
  decode_barcode_with_hints,
} from 'rxing-wasm'

import { CameraPicker } from '@react-barcode-scanners/web/ui/component/camera-picker'
import { ContextBarcodeScanner } from '@react-barcode-scanners/web/data-access/context/barcode-scanner'

export function RxingWasmScanner() {
  const { onBarcodeDetected, onError } = useContext(ContextBarcodeScanner)

  const detectionDelay = 50
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
      throw new Error('No canvas context')
    }

    const getCanvasSections = () => {
      const sections = new Array<ImageData>()

      const height = canvas.height
      const width = canvas.width

      // splitted sections from the image
      const splittableSections = height > width ? 4 : 2
      const singleSectionHeight = height / splittableSections

      for (
        let sectionIndex = 0, yCoordinate = 0;
        sectionIndex < splittableSections;
        sectionIndex++, yCoordinate += singleSectionHeight
      ) {
        sections.push(context.getImageData(0, yCoordinate, width, singleSectionHeight))
      }

      return sections
    }

    const extractBarcodeFromImage = (imageData: ImageData) => {
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

      return parsedBarcode
    }

    // detected multiple barcodes from an image frame
    const frameResults = getCanvasSections().map(extractBarcodeFromImage)
    return frameResults
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
            const barcodeResults = decodeBarcode(frameCanvas)
            console.log(
              'barcodeResults:',
              barcodeResults?.map((res) => res.text())
            )

            onBarcodeDetected(barcodeResults?.map((res) => res.text()))
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
