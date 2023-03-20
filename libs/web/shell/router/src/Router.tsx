import { createBrowserRouter } from 'react-router-dom'

import { LayoutBarcodeScanner } from '@react-barcode-scanners/web/ui/layout/barcode-scanner'
import { PageHome } from '@react-barcode-scanners/web/ui/page/home'

import { ZxingJsScanner } from '@react-barcode-scanners/web/ui/page/zxing-js'
import { RxingWasmScanner } from '@react-barcode-scanners/web/ui/page/rxing-wasm'
import { Html5QrCodeScanner } from '@react-barcode-scanners/web/ui/page/html5-qrcode'
import { ScanditScanner } from '@react-barcode-scanners/web/ui/page/scandit'

export const appRouter = createBrowserRouter([
  {
    path: '',
    element: <PageHome />,
  },
  {
    path: 'scanner',
    element: <LayoutBarcodeScanner />,
    children: [
      {
        path: 'zxing-js',
        element: <ZxingJsScanner />,
      },
      {
        path: 'rxing-wasm',
        element: <RxingWasmScanner />,
      },
      {
        path: 'html5-qrcode',
        element: <Html5QrCodeScanner />,
      },
      {
        path: 'scandit',
        element: <ScanditScanner />,
      },
    ],
  },
])
