import { Suspense, useState } from 'react'

import { Link, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

import { InspectPopup } from '@react-barcode-scanners/web/ui/component/inspect-popup'
import {
  useBarcodeScannerStore,
  useBottomSheetStore,
} from '@react-barcode-scanners/web/data-access/store'

import styles from './LayoutBarcodeScanner.module.scss'

export function LayoutBarcodeScanner() {
  const [scannedParcels, setScannedParcels] = useState(0)

  const { onCapture$ } = useBarcodeScannerStore()
  const { use: useBottomSheet, visible: bottomSheetVisible, hide: dispose } = useBottomSheetStore()

  return (
    <div
      className={clsx(
        'fixed left-0 right-0 top-0 bottom-0',
        'flex flex-col h-screen overflow-auto'
      )}
    >
      <header className={clsx('bg-black text-white p-5')}>
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-3">{scannedParcels}</h1>
          <p>parcels scanned successfully</p>
        </div>
      </header>

      <main className={clsx('flex-1', 'overflow-auto')}>
        <Suspense>
          <Outlet />
        </Suspense>
      </main>

      <footer className={clsx('bg-black p-5')}>
        <div className="flex justify-center gap-5">
          <Link to={'/'} className={clsx(styles.button)}>
            Home
          </Link>
          {/* <button className={clsx(styles.button)}>Done Scanning</button> */}

          {useBottomSheet && (
            <button className={clsx(styles.button)} onClick={() => onCapture$.next('pseudo')}>
              Capture
            </button>
          )}
        </div>
      </footer>

      <AnimatePresence>
        {bottomSheetVisible && (
          <div className="fixed top-0 right-0 bottom-0 left-0 z-50">
            <motion.div
              className={clsx('w-full h-full z-40', 'bg-black bg-opacity-50')}
              onClick={() => dispose()}
              transition={{ duration: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="absolute bottom-0 left-0 right-0 z-50 max-h-full overflow-auto"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              initial={{ bottom: '-100%' }}
              animate={{ bottom: 0 }}
              exit={{ bottom: '-100%' }}
            >
              <InspectPopup
                onClose={() => {
                  dispose()
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
