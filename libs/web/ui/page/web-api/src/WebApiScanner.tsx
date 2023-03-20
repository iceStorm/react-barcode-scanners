import { useEffect } from 'react'

import { AppWebcam } from '@react-barcode-scanners/web/ui/component/webcam'

export function WebApiScanner() {
  useEffect(() => {
    initScanner()
  }, [])

  async function initScanner() {
    // create new detector
    const barcodeDetector = new BarcodeDetector({
      formats: ['code_39', 'codabar', 'ean_13'],
    })

    // check compatibility
    if (barcodeDetector) {
      console.log('Barcode Detector supported!')

      console.log(await BarcodeDetector.getSupportedFormats())

      barcodeDetector
        .detect(imageEl)
        .then((barcodes) => {
          barcodes.forEach((barcode) => console.log(barcode.rawValue))
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      console.log('Barcode Detector is not supported by this browser.')
    }
  }

  return <AppWebcam />
}
