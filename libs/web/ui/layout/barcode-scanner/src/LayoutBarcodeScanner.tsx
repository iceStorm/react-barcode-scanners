import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import clsx from 'clsx'

import styles from './LayoutBarcodeScanner.module.scss'

export function LayoutBarcodeScanner() {
  const [scannedParcels, setScannedParcels] = useState(0)

  return (
    <div className={clsx('fixed left-0 right-0 top-0 bottom-0', 'flex flex-col h-screen')}>
      <header className={clsx('bg-black text-white p-5')}>
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-3">{scannedParcels}</h1>
          <p>parcels scanned successfully</p>
        </div>
      </header>

      <main className={clsx('flex-1', 'overflow-auto')}>
        <Outlet />
      </main>

      <footer className={clsx('bg-black p-5')}>
        <div className="flex justify-center gap-5">
          <button className={clsx(styles.button)}>Enter ID Manually</button>
          <button className={clsx(styles.button)}>Done Scanning</button>
        </div>
      </footer>
    </div>
  )
}
