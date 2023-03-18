import { useEffect, useRef, useState } from 'react'

import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'

export function ZxingJsScanner() {
  const codeReader = useRef<BrowserMultiFormatReader>()

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [result, setResult] = useState<string>()

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
      // codeReader.current?.stopContinuousDecode()
    }
  }, [])

  function onDeviceIdChanged(id: string) {
    setSelectedDeviceId(id)
  }

  function resetReader() {
    codeReader.current?.reset()
    setResult(undefined)
  }

  function startScanning() {
    if (!codeReader.current) {
      return
    }

    codeReader.current.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
      if (result) {
        console.log(result)
        setResult(result.getText())
      }

      if (err && !(err instanceof NotFoundException)) {
        console.error(err)
        setResult(err.message)
      }
    })

    console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
  }

  return (
    <div>
      <div>
        <video id="video" className="w-full h-full"></video>
      </div>

      <div className="p-3">
        <div id="sourceSelectPanel" className="text-center">
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
          <button className="button border" id="startButton" onClick={() => startScanning()}>
            Start Scanning
          </button>

          <button className="button border" id="resetButton" onClick={() => resetReader()}>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
