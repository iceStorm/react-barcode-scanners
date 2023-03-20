import { useContext, useEffect, useRef } from 'react'

import WebCam from 'react-webcam'

import { ContextBarcodeScanner } from '@react-barcode-scanners/web/data-access/context/barcode-scanner'
import { getImageFromCanvas } from '@react-barcode-scanners/shared/util/canvas'

export function WebApiScanner() {
  const imageCaptureInterval = 2000

  const { onBarcodeDetected, onError } = useContext(ContextBarcodeScanner)

  const webcamRef = useRef<WebCam>(null)
  const detectInterval = useRef<number>(null)

  useEffect(() => {
    initScanner()

    return () => {
      if (detectInterval.current) {
        clearInterval(detectInterval.current)
      }
    }
  }, [])

  async function initScanner() {
    // create new detector
    const barcodeDetector = new BarcodeDetector({
      formats: ['code_39', 'codabar', 'ean_13', 'code_128'],
    })

    // check compatibility
    if (!barcodeDetector) {
      return onError(new Error('Barcode Detector is not supported by this browser.'))
    }

    console.log('Barcode Detector supported!')
    console.log(await BarcodeDetector.getSupportedFormats())

    setInterval(async () => {
      if (webcamRef.current) {
        const image = await getImageFromCanvas(webcamRef.current.getCanvas())

        if (image) {
          barcodeDetector
            .detect(image)
            .then((barcodes) => {
              console.log(barcodes)

              barcodes.forEach((barcode) => {
                onBarcodeDetected(barcode.rawValue)
              })
            })
            .catch((error) => {
              console.error(error)
              onError(error)
            })
        }
      }
    }, imageCaptureInterval)
  }

  return <WebCam ref={webcamRef} />
}
