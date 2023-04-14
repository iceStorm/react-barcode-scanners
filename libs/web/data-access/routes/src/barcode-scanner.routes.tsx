import { BarcodeScannerLib } from '@react-barcode-scanners/shared/data-access/models'
import { DannadoriWasmScanner } from '@react-barcode-scanners/web/ui/page/dannadori-wasm'
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
    path: '/scanner/dannadori-wasm',
    title: 'dannadori-wasm',
    sourceUrl:
      'https://dannadori.medium.com/high-speed-and-high-accuracy-barcode-scanner-developed-with-reference-to-the-ai-model-of-google-a3b6631ab9df',
    liveDemoUrl: 'https://flect-lab-web.s3-us-west-2.amazonaws.com/P01_wokers/t12_barcode-scanner/index.html',
    element: <DannadoriWasmScanner />,
    devStatus: 'Done',
  },
]
