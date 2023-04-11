import { createContext, useMemo } from 'react'

import { throttle } from 'lodash'
import { message, notification } from 'antd'

import { BarcodeScannerProps } from '@react-barcode-scanners/shared/data-access/models'
import { BehaviorSubject } from 'rxjs'

export const ContextBarcodeScanner = createContext<BarcodeScannerProps>({
  onBarcodeDetected: () => {
    //
  },
  onError(error) {
    //
  },
  onCapture$: new BehaviorSubject<unknown>(null),
})

export function ContextBarcodeScannerProvider(props: { children: JSX.Element }) {
  const throttleDuration = 1000
  const onCaptureObservable = new BehaviorSubject<unknown>(null)

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

  function onError(error: Error) {
    message.error(error.message)
  }

  return (
    <ContextBarcodeScanner.Provider
      value={{ onBarcodeDetected, onError, onCapture$: onCaptureObservable }}
    >
      {props.children}
    </ContextBarcodeScanner.Provider>
  )
}
