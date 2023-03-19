import { useContext, useEffect, useRef, useState } from 'react'

import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import { ContextBarcodeScanner } from '@react-barcode-scanners/web/data-access/context/barcode-scanner'

export function ZxingJsScanner() {
  const { onBarcodeDetected, onError } = useContext(ContextBarcodeScanner)

  const codeReader = useRef<BrowserMultiFormatReader>()

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
  }

  function startScanning() {
    if (!codeReader.current) {
      return
    }

    codeReader.current.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
      if (result) {
        console.log(result)
        onBarcodeDetected(result.getText())
      }

      if (err && !(err instanceof NotFoundException)) {
        console.error(err)
        onError(err)
      }
    })

    console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
  }

  return (
    <div>
      <div className="p-3 bg-stone-300">
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

        <div className="flex justify-center gap-5 mt-3">
          <button className="button border" onClick={() => startScanning()}>
            Start Scanning
          </button>

          <button className="button border" onClick={() => resetReader()}>
            Reset
          </button>
        </div>
      </div>

      <div>
        <video id="video" className="w-full"></video>
      </div>
    </div>
  )
}
