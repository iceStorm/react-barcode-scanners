import { useEffect, useMemo } from 'react'

import { throttle } from 'lodash'
import { message, notification } from 'antd'

import { useBarcodeScannerStore } from '@react-barcode-scanners/web/data-access/store'
import { filter } from 'rxjs'

export function ContextBarcodeScannerProvider(props: { children: JSX.Element }) {
  const throttleDuration = 1000

  const { onBarcodesDetected$, onError$ } = useBarcodeScannerStore()

  useEffect(() => {
    const barcodeDetectSubscription = onBarcodesDetected$
      .pipe(filter((value) => Boolean(value.length)))
      .subscribe((barcodes) => {
        onBarcodeDetected(barcodes)
      })

    const errorSubscription = onError$
      .pipe(filter((value) => Boolean(value.message)))
      .subscribe((error) => {
        onError(error)
      })

    return () => {
      barcodeDetectSubscription.unsubscribe()
      errorSubscription.unsubscribe()
    }
  }, [])

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

  return <div>{props.children}</div>
}
