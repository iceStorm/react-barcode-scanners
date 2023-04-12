import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'
import WebCam from 'react-webcam'
import { BrowserMultiFormatReader } from '@zxing/library'

import { getImageFromCanvas } from '@react-barcode-scanners/shared/util/canvas'
import { useBarcodeScannerStore } from '@react-barcode-scanners/web/data-access/store'

export function WebApiScanner() {
  const imageCaptureInterval = 2000

  const { onBarcodesDetected$, onError$ } = useBarcodeScannerStore()

  const [isScanning, setIsScanning] = useState(false)
  const [isGettingCameras, setIsGettingCameras] = useState(false)

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [deviceIdsList, setDeviceIdsList] = useState<MediaDeviceInfo[]>([])

  const webcamRef = useRef<WebCam>(null)
  const detectInterval = useRef<NodeJS.Timer>()
  const detectorRef = useRef<BarcodeDetector>()

  useEffect(() => {
    setIsGettingCameras(true)

    getCameraDevices()
      .then((devices) => {
        setDeviceIdsList(devices)

        console.log(devices)

        if (devices.length >= 1) {
          setSelectedDeviceId(devices[0].deviceId)
          console.log('seleted first camera:', devices[0].deviceId)
        }
      })
      .catch((error) => {
        onError$.next(error)
      })
      .finally(() => {
        setTimeout(() => {
          setIsGettingCameras(false)
        }, 2000)
      })

    return () => {
      if (detectInterval.current) {
        clearInterval(detectInterval.current)
      }
    }
  }, [])

  async function getCameraDevices() {
    return new BrowserMultiFormatReader().listVideoInputDevices()
  }

  async function initScanner() {
    // create new detector
    detectorRef.current = new BarcodeDetector({
      formats: ['code_39', 'codabar', 'ean_13', 'code_128'],
    })

    // check compatibility
    if (!detectorRef.current) {
      return onError$.next(new Error('Barcode Detector is not supported by this browser.'))
    }

    console.log('Barcode Detector supported!')
    console.log(await BarcodeDetector.getSupportedFormats())
  }

  function onDeviceIdChanged(id: string) {
    setSelectedDeviceId(id)
  }

  function resetReader() {
    setIsScanning(false)
  }

  async function startScanning() {
    console.log(selectedDeviceId)

    setIsScanning(true)

    if (detectInterval.current) {
      clearInterval(detectInterval.current)
    }

    await initScanner()

    detectInterval.current = setInterval(async () => {
      if (webcamRef.current) {
        const image = await getImageFromCanvas(webcamRef.current.getCanvas())

        if (image && detectorRef.current) {
          detectorRef.current
            .detect(image)
            .then((barcodes) => {
              console.log(barcodes)

              barcodes.forEach((barcode) => {
                onBarcodesDetected$.next([barcode.rawValue])
              })
            })
            .catch((error) => {
              console.error(error)
              onError$.next(error)
            })
        }
      }
    }, imageCaptureInterval)
  }

  return (
    <div className="flex flex-col">
      <div className={clsx('p-3 bg-stone-300 border-b flex flex-col gap-3', 'sticky top-0 z-10')}>
        {!isScanning && !isGettingCameras && (
          <div className="text-center">
            <label htmlFor="sourceSelect">Change video source:</label>
            <select
              id="sourceSelect"
              style={{ maxWidth: '400px' }}
              onChange={(id) => onDeviceIdChanged(id.target.value)}
              value={selectedDeviceId}
            >
              {deviceIdsList.map((device) => {
                return (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                )
              })}
            </select>
          </div>
        )}

        <div className="flex justify-center gap-5">
          {!isScanning && (
            <button
              className="button border"
              onClick={() => startScanning()}
              disabled={isGettingCameras || deviceIdsList.length < 1}
            >
              {isGettingCameras ? 'Loading camera...' : 'Start Scanning'}
            </button>
          )}

          {isScanning && (
            <button className="button border" onClick={() => resetReader()}>
              Pause Scanning
            </button>
          )}
        </div>
      </div>

      {!isGettingCameras && isScanning && (
        <WebCam ref={webcamRef} videoConstraints={{ facingMode: 'environment' }} />
      )}
    </div>
  )
}
