import { createContext, useMemo } from 'react'

import { throttle } from 'lodash'
import { message } from 'antd'

import { BarcodeScannerProps } from '@react-barcode-scanners/shared/data-access/models'

export const ContextBarcodeScanner = createContext<BarcodeScannerProps>({
  onBarcodeDetected: () => {
    //
  },
  onError(error) {
    //
  },
})

export function ContextBarcodeScannerProvider(props: { children: JSX.Element }) {
  const throttleDuration = 1000

  const onBarcodeDetected = useMemo(() => {
    return throttle((barcode: string) => {
      message.info(barcode)
    }, throttleDuration)
  }, [])

  function onError(error: Error) {
    message.error(error.message)
  }

  return (
    <ContextBarcodeScanner.Provider value={{ onBarcodeDetected, onError }}>
      {props.children}
    </ContextBarcodeScanner.Provider>
  )
}
