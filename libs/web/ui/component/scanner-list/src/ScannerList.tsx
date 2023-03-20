import clsx from 'clsx'

import { scannerPages } from '@react-barcode-scanners/web/data-access/routes'
import { ScannerCard } from '@react-barcode-scanners/web/ui/component/scanner-card'

import styles from './ScannerList.module.scss'

export function ScannerList() {
  return (
    <ul className={clsx(styles.grid_libs)}>
      {scannerPages.map((scanner) => {
        return (
          <li key={scanner.path} className="w-full h-full">
            <ScannerCard {...scanner} />
          </li>
        )
      })}
    </ul>
  )
}
