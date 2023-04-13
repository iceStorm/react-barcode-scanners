/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect } from 'react'

import * as ScanditSDK from 'scandit-sdk'

import { useBarcodeScannerStore } from '@react-barcode-scanners/web/data-access/store'

export function ScanditScanner() {
  const { onBarcodesDetected$, onError$ } = useBarcodeScannerStore()

  useEffect(() => {
    initScandit()

    return () => {
      // ScanditSDK.resetConfigure()
    }
  }, [])

  async function initScandit() {
    try {
      await ScanditSDK.configure(import.meta.env.VITE_APP_SCANDIT_LICENSE_KEY, {
        engineLocation: 'https://cdn.jsdelivr.net/npm/scandit-sdk@6.x/build/',
      })

      const barcodePicker = await ScanditSDK.BarcodePicker.create(
        document.getElementById('scandit-barcode-picker')!,
        {
          // enable some common symbologies
          scanSettings: new ScanditSDK.ScanSettings({
            enabledSymbologies: [ScanditSDK.Barcode.Symbology.CODE128],
            blurryRecognition: true,
            gpuAcceleration: true,
            maxNumberOfCodesPerFrame: 10,
          }),
          guiStyle: ScanditSDK.BarcodePicker.GuiStyle.VIEWFINDER,
          hideLogo: true,
          enableCameraSwitcher: true,
          cameraType: ScanditSDK.Camera.Type.BACK,
          enablePinchToZoom: true,
        }
      )

      // turn off video mirroring
      barcodePicker.setMirrorImageEnabled(false)

      barcodePicker.on('scan', (scanResult) => {
        console.log(
          'detected:',
          scanResult.barcodes.map((barcode) => barcode.data)
        )

        onBarcodesDetected$.next(scanResult.barcodes.map((barcode) => barcode.data))
      })
    } catch (error: any) {
      console.error(error)
      onError$.next(error)
    }
  }

  return <div id="scandit-barcode-picker"></div>
}
