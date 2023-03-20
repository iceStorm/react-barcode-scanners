import { ScannerList } from '@react-barcode-scanners/web/ui/component/scanner-list'

export function PageHome() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container py-10">
        <ScannerList />
      </div>
    </div>
  )
}
