import { useRef, useState } from 'react'

import WebCam from 'react-webcam'

import { getImageFromCanvas } from '@react-barcode-scanners/shared/util/canvas'
import { useBarcodeScannerStore } from '@react-barcode-scanners/web/data-access/store'
import { CameraPicker } from '@react-barcode-scanners/web/ui/component/camera-picker'

export function WebApiScanner() {
  const imageCaptureInterval = 2000

  const { onBarcodesDetected$, onError$ } = useBarcodeScannerStore()

  const [isScanning, setIsScanning] = useState(false)
  const webcamRef = useRef<WebCam>(null)
  const detectInterval = useRef<NodeJS.Timer>()
  const detectorRef = useRef<BarcodeDetector>()

  async function initScanner() {
    // create new detector
    detectorRef.current = new BarcodeDetector({
      formats: ['code_39', 'codabar', 'ean_13', 'code_128'],
    })

    // check compatibility
    if (!detectorRef.current) {
      return onError$.next(new Error('Barcode Detector is not supported by this browser.'))
    }

    console.log('Barcode Detector supported!')
    console.log(await BarcodeDetector.getSupportedFormats())
  }

  async function startScanning() {
    setIsScanning(true)

    if (detectInterval.current) {
      clearInterval(detectInterval.current)
    }

    await initScanner()

    detectInterval.current = setInterval(async () => {
      if (webcamRef.current) {
        const image = await getImageFromCanvas(webcamRef.current.getCanvas())

        if (image && detectorRef.current) {
          detectorRef.current
            .detect(image)
            .then((barcodes) => {
              console.log(barcodes)

              barcodes.forEach((barcode) => {
                onBarcodesDetected$.next([barcode.rawValue])
              })
            })
            .catch((error) => {
              console.error(error)
              onError$.next(error)
            })
        }
      }
    }, imageCaptureInterval)
  }

  return (
    <div className="flex flex-col">
      <CameraPicker
        onStartScanning={(cameraId) => startScanning()}
        onPauseScanning={() => {
          setIsScanning(false)
        }}
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
