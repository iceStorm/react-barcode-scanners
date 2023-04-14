import { useCallback, useEffect, useRef, useState } from 'react'

import WebCam from 'react-webcam'
import {
  BarcodeScannerConfig,
  BarcodeScannerWorkerManager,
  generateBarcodeScannerDefaultConfig,
  generateDefaultBarcodeScannerParams,
} from '@dannadori/barcode-scanner-worker-js'

import { CameraPicker } from '@react-barcode-scanners/web/ui/component/camera-picker'
import { useBarcodeScannerStore } from '@react-barcode-scanners/web/data-access/store'

export function DannadoriWasmScanner() {
  const { onError$, onBarcodesDetected$ } = useBarcodeScannerStore()

  const [isScanning, setIsScanning] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState<MediaDeviceInfo>()

  const canvasOutput = useRef<HTMLCanvasElement>(null)
  const webcamRef = useRef<WebCam>(null)
  const detectIntervalRef = useRef<NodeJS.Timer>()
  const detectInterval = 50

  // dannadori
  const managerRef = useRef<BarcodeScannerWorkerManager>()

  const loadModel = useCallback(async () => {
    console.log('managerRef.current:', managerRef.current)

    const m = managerRef.current ?? new BarcodeScannerWorkerManager()
    await m.init(generateBarcodeScannerDefaultConfig())
    managerRef.current = m
  }, [])

  useEffect(() => {
    try {
      loadModel()
    } catch (error) {
      console.error(error)
    }

    return () => {
      // if (detectIntervalRef.current) {
      //   clearInterval(detectIntervalRef.current)
      // }
    }
  }, [loadModel])

  useEffect(() => {
    if (!isScanning) {
      clearInterval(detectIntervalRef.current)
    }
  }, [isScanning])

  async function startAutoScanning(camera: MediaDeviceInfo) {
    setSelectedCamera(camera)
    setIsScanning(true)

    if (detectIntervalRef.current) {
      clearInterval(detectIntervalRef.current)
    }

    detectIntervalRef.current = setInterval(async () => {
      if (!webcamRef.current) {
        throw new Error('No webcamRef')
      }

      if (!managerRef.current) {
        throw new Error('No managerRef')
      }

      const canvas = webcamRef.current.getCanvas()
      if (!canvas) {
        throw new Error('Cannot get canvas from webcamRef')
      }

      if (!canvas.height || !canvas.width) {
        throw new Error('Canvas size is 0')
      }

      const detectedResults = await managerRef.current?.predict(
        // {
        //   type: 'original',
        //   scale: 2,
        //   processWidth: 900,
        //   processHeight: 900,
        // },
        generateDefaultBarcodeScannerParams(),
        canvas
      )

      console.log(
        'detectedResults:',
        detectedResults.map((res) => res.barcode_data)
      )

      for (let index = 0; index < detectedResults.length; index++) {
        const element = detectedResults[index]

        if (!element.barcode_data) {
          detectedResults.splice(index, 1)
        }
      }

      // removing empty results
      while (detectedResults.some((res) => !res.barcode_data)) {
        const indexToRemove = detectedResults.findIndex((res) => !res.barcode_data)
        detectedResults.splice(indexToRemove, 1)
      }

      if (detectedResults.length) {
        onBarcodesDetected$.next(detectedResults.map((res) => res.barcode_data))
      }
    }, detectInterval)
  }

  return (
    <div>
      <CameraPicker
        onStartScanning={(camera) => {
          startAutoScanning(camera)
        }}
        onPauseScanning={() => setIsScanning(false)}
        onError={(error) => {
          onError$.next(error)
        }}
        isScanning={isScanning}
      />

      {isScanning && (
        <WebCam
          ref={webcamRef}
          forceScreenshotSourceSize={true}
          videoConstraints={{
            facingMode: 'environment',
            deviceId: selectedCamera?.deviceId,
            width: { ideal: 4096 },
            height: { ideal: 2160 },
          }}
          className="w-full max-h-full"
        />
      )}
    </div>
  )
}
