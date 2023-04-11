import { createBrowserRouter } from 'react-router-dom'

import { LayoutBarcodeScanner } from '@react-barcode-scanners/web/ui/layout/barcode-scanner'
import { PageHome } from '@react-barcode-scanners/web/ui/page/home'
import { scannerPages } from '@react-barcode-scanners/web/data-access/routes'
import { ScannerList } from '@react-barcode-scanners/web/ui/component/scanner-list'
import { Suspense } from 'react'

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
        path: '',
        index: true,
        element: (
          <div className="p-10 max-w-lg mx-auto flex flex-col gap-5 justify-center">
            <p className="font-semibold">No scanner selected. Please pick one to countinue.</p>
            <ScannerList />
          </div>
        ),
      },
      ...scannerPages.map((page) => {
        return {
          path: page.path,
          element: <Suspense>{page.element}</Suspense>,
        }
      }),
    ],
  },
])
