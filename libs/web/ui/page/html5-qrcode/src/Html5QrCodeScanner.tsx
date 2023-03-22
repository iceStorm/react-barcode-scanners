import { useContext, useEffect, useRef } from 'react'

import { Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode'
import { Html5QrcodeError, Html5QrcodeResult, Html5QrcodeScanType } from 'html5-qrcode/esm/core'

import { ContextBarcodeScanner } from '@react-barcode-scanners/web/data-access/context/barcode-scanner'

export function Html5QrCodeScanner() {
  const { onBarcodeDetected, onError } = useContext(ContextBarcodeScanner)
  const scannerRef = useRef<Html5QrcodeScanner>()

  function onScanSuccess(decodedText: string, decodedResult: Html5QrcodeResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult)

    onBarcodeDetected(decodedText)
  }

  function onScanFailure(errorMessage: string, error: Html5QrcodeError) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    // console.warn(`Code scan error = ${error}`)
    // onError(new Error(errorMessage))
  }

  useEffect(() => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner(
          'reader',
          {
            fps: 10,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            useBarCodeDetectorIfSupported: true,
          },
          false
        )
      }

      scannerRef.current.render(onScanSuccess, onScanFailure)
    } catch (error) {
      console.error('Error when initializing Html5QrcodeScanner:', error)
    }

    return () => {
      console.warn(scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING)

      if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current?.clear()
      }
    }
  }, [])

  return (
    <div>
      <div id="reader" style={{ width: '100%' }}></div>
    </div>
  )
}
