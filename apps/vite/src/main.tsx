import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import { appRouter } from '@react-barcode-scanners/web/shell/router'
import { ContextBarcodeScannerProvider } from '@react-barcode-scanners/web/data-access/context/barcode-scanner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      retry: false,
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <ContextBarcodeScannerProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={appRouter}></RouterProvider>
      </QueryClientProvider>
    </ContextBarcodeScannerProvider>
  </StrictMode>
)
