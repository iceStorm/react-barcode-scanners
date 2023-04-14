import { useEffect, useRef, useState } from 'react'

import WebCam from 'react-webcam'
import { scanImageData } from '@undecaf/zbar-wasm'

import { CameraPicker } from '@react-barcode-scanners/web/ui/component/camera-picker'
import { useBarcodeScannerStore } from '@react-barcode-scanners/web/data-access/store'

export function ZBarWasmScanner() {
  const { onBarcodesDetected$, onError$ } = useBarcodeScannerStore()

  const detectionDelay = 50
  const [isScanning, setIsScanning] = useState(false)

  const webcamRef = useRef<WebCam>(null)
  const detectInterval = useRef<NodeJS.Timer>()

  useEffect(() => {
    //
  }, [])

  async function startAutoScanning() {
    setIsScanning(true)

    if (detectInterval.current) {
      clearInterval(detectInterval.current)
    }

    detectInterval.current = setInterval(() => {
      if (!webcamRef.current) {
        return
      }

      const canvas = webcamRef.current?.getCanvas()
      if (canvas) {
        const canvasContext = canvas.getContext('2d')

        if (canvasContext) {
          const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height)

          scanImageData(imageData)
            .then((results) => {
              const barcodes = results.map((res) => {
                return res.decode()
              })

              console.log('barcodes:', barcodes)
              onBarcodesDetected$.next(barcodes)
            })
            .catch((err) => {
              onError$.next(err)
            })
        }
      }
    }, detectionDelay)
  }

  function pauseScanning() {
    //
  }

  return (
    <div>
      <CameraPicker
        onStartScanning={(cameraId) => startAutoScanning()}
        onPauseScanning={() => pauseScanning()}
        isScanning={isScanning}
      />

      {isScanning && (
        <WebCam
          ref={webcamRef}
          forceScreenshotSourceSize={true}
          videoConstraints={{
            facingMode: 'environment',
            width: { ideal: 4096 },
            height: { ideal: 2160 },
          }}
          className="w-full max-h-full"
        />
      )}
    </div>
  )
}
