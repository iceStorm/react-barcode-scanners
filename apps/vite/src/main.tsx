import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { appRouter } from '@react-barcode-scanners/web/shell/router'
import { ContextBarcodeScannerProvider } from '@react-barcode-scanners/web/data-access/context/barcode-scanner'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <ContextBarcodeScannerProvider>
      <RouterProvider router={appRouter}></RouterProvider>
    </ContextBarcodeScannerProvider>
  </StrictMode>
)
