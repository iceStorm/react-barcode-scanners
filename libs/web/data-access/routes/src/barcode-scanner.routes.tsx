import { BarcodeScannerLib } from '@react-barcode-scanners/shared/data-access/models'
import { ZBarWasmScanner } from '@react-barcode-scanners/web/ui/page/zbar-wasm'
import { lazy } from 'react'

const ZxingJsScanner = lazy(() => import('@react-barcode-scanners/web/ui/page/zxing-js'))
const RxingWasmScanner = lazy(() => import('@react-barcode-scanners/web/ui/page/rxing-wasm'))
const Html5QrCodeScanner = lazy(() => import('@react-barcode-scanners/web/ui/page/html5-qrcode'))
const ScanditScanner = lazy(() => import('@react-barcode-scanners/web/ui/page/scandit'))
const WebApiScanner = lazy(() => import('@react-barcode-scanners/web/ui/page/web-api'))

export const scannerPages: BarcodeScannerLib[] = [
  {
    path: '/scanner/html5-qrcode',
    title: 'html5-qrcode',
    sourceUrl: 'https://github.com/mebjas/html5-qrcode',
    liveDemoUrl: 'https://scanapp.org',
    element: <Html5QrCodeScanner />,
    devStatus: 'Done',
  },
  {
    path: '/scanner/web-api',
    title: 'Web API Standard',
    sourceUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API',
    liveDemoUrl:
      'https://gist.githack.com/bellbind/e8a14f982122cc074ce85a0f19ea65e5/raw/index.html',
    element: <WebApiScanner />,
    devStatus: 'Done',
  },
  {
    path: '/scanner/scandit',
    title: 'Scandit SDK',
    sourceUrl: 'https://www.scandit.com/developers',
    liveDemoUrl: 'https://websdk.demos.scandit.com',
    element: <ScanditScanner />,
    devStatus: 'Done',
  },
  {
    path: '/scanner/zxing-js',
    title: 'zxing-js',
    sourceUrl: 'https://github.com/zxing-js/library',
    liveDemoUrl: 'https://zxing-js.github.io/library/examples/multi-camera/',
    element: <ZxingJsScanner />,
    devStatus: 'Done',
  },
  {
    path: '/scanner/rxing-wasm',
    title: 'rxing-wasm',
    sourceUrl: 'https://github.com/rxing-core/rxing-wasm',
    liveDemoUrl: 'https://rxing-wasm.vercel.app',
    element: <RxingWasmScanner />,
    devStatus: 'Done',
  },
  {
    path: '/scanner/zbar-wasm',
    title: 'zbar-wasm',
    sourceUrl: 'https://github.com/undecaf/zbar-wasm',
    liveDemoUrl: 'https://codepen.io/undecaf/pen/ZEXmqdB',
    element: <ZBarWasmScanner />,
    devStatus: 'Done',
  },
  {
    path: '#',
    title: 'zxing-wasm',
    sourceUrl:
      'https://dannadori.medium.com/how-to-speed-up-the-barcode-scanner-with-wasm-efeaea47f9d4',
    liveDemoUrl: 'https://miro.medium.com/v2/resize:fit:640/1*gAfK0Y3HXsnoAOPLT_hX1g.gif',
    // element: <ZBarWasmScanner />,
    devStatus: 'Developing',
  },
]
