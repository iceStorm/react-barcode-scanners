import { useState } from 'react'
import { Outlet } from 'react-router-dom'

export function LayoutBarcodeScanner() {
  const [scannedParcels, setScannedParcels] = useState(0)

  return (
    <div>
      <header>
        <h1>{scannedParcels}</h1>
        <p>parcels scanned successfully</p>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <button>Enter ID Manually</button>

        <button>Done Scanning</button>
      </footer>
    </div>
  )
}
