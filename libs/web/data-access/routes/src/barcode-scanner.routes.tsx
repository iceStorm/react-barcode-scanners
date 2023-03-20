import { ZxingJsScanner } from '@react-barcode-scanners/web/ui/page/zxing-js'
import { RxingWasmScanner } from '@react-barcode-scanners/web/ui/page/rxing-wasm'
import { Html5QrCodeScanner } from '@react-barcode-scanners/web/ui/page/html5-qrcode'
import { ScanditScanner } from '@react-barcode-scanners/web/ui/page/scandit'
import { WebApiScanner } from '@react-barcode-scanners/web/ui/page/web-api'
import { BarcodeScannerLib } from '@react-barcode-scanners/shared/data-access/models'

export const scannerPages: BarcodeScannerLib[] = [
  {
    path: '/scanner/zxing-js',
    title: 'zxing-js',
    sourceUrl: 'https://github.com/zxing-js/library',
    liveDemoUrl: 'https://zxing-js.github.io/library',
    element: <ZxingJsScanner />,
  },
  {
    path: '/scanner/rxing-wasm',
    title: 'rxing-wasm',
    sourceUrl: 'https://github.com/rxing-core/rxing-wasm',
    liveDemoUrl: 'https://zxing-js.github.io/library',
    element: <RxingWasmScanner />,
  },
  {
    path: '/scanner/html5-qrcode',
    title: 'html5-qrcode',
    sourceUrl: 'https://github.com/mebjas/html5-qrcode',
    liveDemoUrl: 'https://scanapp.org',
    element: <Html5QrCodeScanner />,
  },
  {
    path: '/scanner/scandit',
    title: 'Scandit SDK',
    sourceUrl: 'https://www.scandit.com/products/web-sdk',
    liveDemoUrl: 'https://websdk.demos.scandit.com',
    element: <ScanditScanner />,
  },
  {
    path: '/scanner/web-api',
    title: 'Standard Web API',
    sourceUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API',
    liveDemoUrl: 'https://zxing-js.github.io/library',
    element: <WebApiScanner />,
  },
]
