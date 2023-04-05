import { createContext, useMemo } from 'react'

import { throttle } from 'lodash'
import { message, notification } from 'antd'

import { BarcodeScannerProps } from '@react-barcode-scanners/shared/data-access/models'

export const ContextBarcodeScanner = createContext<BarcodeScannerProps>({
  onBarcodeDetected: (barcode) => {
    //
  },
  onError(error) {
    //
  },
})

export function ContextBarcodeScannerProvider(props: { children: JSX.Element }) {
  const throttleDuration = 1000

  const onBarcodeDetected = useMemo(() => {
    return throttle((barcodes: string[] | string) => {
      notification.info({
        message: (
          <div>
            {Array.from(barcodes).map((barcode) => (
              <p>{barcode}</p>
            ))}
          </div>
        ),
      })
    }, throttleDuration)
  }, [])

  function afterBarcodeDetected(barcode: string) {
    //
  }

  function onError(error: Error) {
    message.error(error.message)
  }

  return (
    <ContextBarcodeScanner.Provider value={{ onBarcodeDetected, onError }}>
      {props.children}
    </ContextBarcodeScanner.Provider>
  )
}
