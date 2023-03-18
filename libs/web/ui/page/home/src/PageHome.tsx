import { Link } from 'react-router-dom'
import clsx from 'clsx'

interface ScannerLibrary {
  name: string
  url?: string
}

const demos: ScannerLibrary[] = [
  {
    url: 'scanner/zxing-js',
    name: 'zxing-js',
  },
  {
    url: 'scanner/html5-qrcode',
    name: 'html5-qrcode',
  },
  {
    url: 'scanner/rxing-wasm',
    name: 'rxing-wasm',
  },
]

export function PageHome() {
  return (
    <div className="container py-10">
      <ul className={clsx('flex gap-10')}>
        {demos.map(({ name, url }) => {
          return (
            <li>
              <div className={clsx('border rounded-lg')}>
                <div></div>
                <Link className={clsx('py-2 px-5 block hover:bg-gray-100')} to={url || name}>
                  {name}
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
