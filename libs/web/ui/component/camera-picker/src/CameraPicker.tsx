import { useEffect, useState } from 'react'

import clsx from 'clsx'
import { BrowserMultiFormatReader } from '@zxing/library'

interface CameraPickerProps {
  onStartScanning: (cameraId: MediaDeviceInfo) => void
  onPauseScanning: () => void
}

export function CameraPicker(props: CameraPickerProps) {
  const { onStartScanning, onPauseScanning } = props

  const [isGettingCameras, setIsGettingCameras] = useState(false)

  const [selectedCamera, setSelectedCamera] = useState<MediaDeviceInfo>()
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    setIsGettingCameras(true)

    new BrowserMultiFormatReader()
      .listVideoInputDevices()
      .then((cameras) => {
        setCameraList(cameras)
      })
      .finally(() => {
        setIsGettingCameras(false)
      })
  }, [])

  function onDeviceIdChanged(cameraId: string) {
    setSelectedCamera(cameraList.find((cam) => cam.deviceId === cameraId))
  }

  return (
    <div className={clsx('p-3 bg-stone-300 border-b flex flex-col gap-3', 'sticky top-0 z-10')}>
      {!isGettingCameras && (
        <div className="text-center">
          <label htmlFor="sourceSelect">Change video source:</label>
          <select
            id="sourceSelect"
            style={{ maxWidth: '400px' }}
            onChange={(id) => onDeviceIdChanged(id.target.value)}
            value={selectedCamera?.deviceId}
          >
            {cameraList.map((device) => {
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
        {!isGettingCameras && (
          <button
            className="button border"
            onClick={() => selectedCamera && onStartScanning(selectedCamera)}
            disabled={isGettingCameras || cameraList.length < 1 || !selectedCamera}
          >
            {isGettingCameras ? 'Loading camera...' : 'Start Scanning'}
          </button>
        )}

        {isGettingCameras && (
          <button className="button border" onClick={() => onPauseScanning()}>
            Pause Scanning
          </button>
        )}
      </div>
    </div>
  )
}
