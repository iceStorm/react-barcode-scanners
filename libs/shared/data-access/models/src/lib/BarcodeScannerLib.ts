import { RouteObject } from 'react-router-dom'

export type BarcodeScannerLib = RouteObject & {
  title: string
  sourceUrl: string
  liveDemoUrl: string
  devStatus: 'Done' | 'Developing'
}
