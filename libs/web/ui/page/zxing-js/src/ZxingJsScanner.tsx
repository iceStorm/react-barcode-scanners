import { useContext, useEffect, useRef, useState } from 'react'

import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import { ContextBarcodeScanner } from '@react-barcode-scanners/web/data-access/context/barcode-scanner'
import clsx from 'clsx'

export function ZxingJsScanner() {
  const { onBarcodeDetected, onError } = useContext(ContextBarcodeScanner)

  const codeReader = useRef<BrowserMultiFormatReader>()
  const [isScanning, setIsScanning] = useState(false)
  const [isStartingScanning, setIsStartingScanning] = useState(false)

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [deviceIdsList, setDeviceIdsList] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader()
    console.log('ZXing code reader initialized')

    codeReader.current
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        setSelectedDeviceId(videoInputDevices[0].deviceId)

        if (videoInputDevices.length >= 1) {
          setDeviceIdsList(videoInputDevices)
        }
      })
      .catch((err) => {
        console.error(err)
      })

    return () => {
      resetReader()
    }
  }, [])

  function onDeviceIdChanged(id: string) {
    setSelectedDeviceId(id)
  }

  function resetReader() {
    codeReader.current?.reset()
    setIsScanning(false)
  }

  function startScanning() {
    if (!codeReader.current) {
      return
    }

    setIsStartingScanning(true)

    codeReader.current
      .decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
        if (result) {
          console.log(result)
          onBarcodeDetected(result.getText())
        }

        if (err && !(err instanceof NotFoundException)) {
          console.error(err)
          onError(err)
        }
      })
      .then(() => {
        setIsScanning(true)
      })
      .catch((error) => {
        onError(error)
        setIsScanning(false)
      })
      .finally(() => {
        setIsStartingScanning(false)
      })

    console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
  }

  return (
    <div className="relative">
      <div className={clsx('p-3 bg-stone-300 border-b flex flex-col gap-3', 'sticky top-0')}>
        {!isScanning && !isStartingScanning && (
          <div className="text-center">
            <label htmlFor="sourceSelect">Change video source:</label>
            <select
              id="sourceSelect"
              style={{ maxWidth: '400px' }}
              onChange={(id) => onDeviceIdChanged(id.target.value)}
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
              disabled={isStartingScanning}
            >
              {isStartingScanning ? 'Loading camera...' : 'Start Scanning'}
            </button>
          )}

          {isScanning && (
            <button className="button border" onClick={() => resetReader()}>
              Pause Scanning
            </button>
          )}
        </div>
      </div>

      <div>
        <video id="video" className="w-full"></video>
      </div>
    </div>
  )
}
