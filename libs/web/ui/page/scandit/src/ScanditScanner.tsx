import { useContext, useEffect, useRef, useState } from 'react'
import { Progress } from 'antd'
import WebCam from 'react-webcam'

import {
  configure,
  loadingStatus,
  DataCaptureContext,
  Camera,
  FrameSourceState,
  DataCaptureView,
  CameraPosition,
} from 'scandit-web-datacapture-core'

import {
  barcodeCaptureLoader,
  Symbology,
  BarcodeCapture,
  BarcodeCaptureSettings,
  BarcodeCaptureOverlay,
} from 'scandit-web-datacapture-barcode'

import { ContextBarcodeScanner } from '@react-barcode-scanners/web/data-access/context/barcode-scanner'

export function ScanditScanner() {
  const { onBarcodeDetected, onError } = useContext(ContextBarcodeScanner)

  const [initScanditProgress, setInitScanditProgress] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barcodeCaptureRef = useRef<BarcodeCapture>()
  const contextRef = useRef<DataCaptureContext>()

  useEffect(() => {
    async function initScanditSdk() {
      await configure({
        licenseKey: import.meta.env.VITE_APP_SCANDIT_LICENSE_KEY,
        libraryLocation:
          'https://unpkg.com/browse/scandit-web-datacapture-barcode@6.x/build/engine/',
        moduleLoaders: [barcodeCaptureLoader()],
      })

      contextRef.current = await DataCaptureContext.create()

      const settings = new BarcodeCaptureSettings()
      settings.enableSymbologies([
        Symbology.Code128,
        Symbology.Code39,
        Symbology.QR,
        Symbology.EAN8,
        Symbology.UPCE,
        Symbology.EAN13UPCA,
      ])

      barcodeCaptureRef.current = await BarcodeCapture.forContext(contextRef.current, settings)
      barcodeCaptureRef.current.addListener({
        didScan(barcodeCapture, session, frameData) {
          const recognizedBarcodes = session.newlyRecognizedBarcodes

          // recognizedBarcodes.forEach((barcode) => {
          //   onBarcodeDetected(barcode.data || '')
          // })
          onBarcodeDetected(recognizedBarcodes.join('\n'))
        },
      })

      const view = await DataCaptureView.forContext(contextRef.current)
      view.connectToElement(canvasRef.current!)
      const overlay = await BarcodeCaptureOverlay.withBarcodeCaptureForView(
        barcodeCaptureRef.current,
        view
      )

      const cameraSettings = BarcodeCapture.recommendedCameraSettings
      const camera = Camera.atPosition(CameraPosition.WorldFacing)
      if (camera) {
        await camera.applySettings(cameraSettings)
        await contextRef.current.setFrameSource(camera)
        await camera.switchToDesiredState(FrameSourceState.On)
      }
    }

    if (!canvasRef.current) {
      // console.log('canvasRef.current:', canvasRef.current, canvasRef.current.getContext('2d'))

      initScanditSdk()
        .then(() => {
          onBarcodeDetected('Scandit SDK initialized')
        })
        .catch((error) => {
          onError(error)
        })
    }

    return () => {
      // barcodeCaptureRef.current?.setEnabled(false)
    }
  }, [])

  useEffect(() => {
    loadingStatus.subscribe((info) => {
      setInitScanditProgress(info.percentage || 0)
    })
  }, [])

  useEffect(() => {
    if (initScanditProgress === 100) {
      setTimeout(() => {
        setInitScanditProgress(-1)
      }, 1000)
    }
  }, [initScanditProgress])

  return (
    <>
      {initScanditProgress !== -1 && (
        <div className="container py-5 max-w-md mx-auto">
          {<Progress type="line" percent={initScanditProgress} />}
          <span>Initializing Scandit SDK...</span>
        </div>
      )}

      <div>
        <canvas ref={canvasRef} width={300} height={400} />

        {/* {initScanditProgress === -1 && <WebCam className="h-full" />} */}
        {/* <WebCam autoPlay width={300} height={400} /> */}
      </div>
    </>
  )
}
