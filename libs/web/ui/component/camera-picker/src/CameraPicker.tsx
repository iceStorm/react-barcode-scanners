import { useEffect, useState } from 'react'

import clsx from 'clsx'
import { notification } from 'antd'

interface CameraPickerProps {
  onStartScanning: (camera: MediaDeviceInfo) => void
  onPauseScanning: () => void
  onError?(error: Error): void

  isScanning?: boolean
}

export function CameraPicker(props: CameraPickerProps) {
  const { onStartScanning, onPauseScanning, onError, isScanning } = props

  const [isGettingCameras, setIsGettingCameras] = useState(true)

  const [selectedCamera, setSelectedCamera] = useState<MediaDeviceInfo>()
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    setIsGettingCameras(true)

    if (!navigator.mediaDevices?.enumerateDevices) {
      onError?.(new Error('enumerateDevices() not supported.'))
    } else {
      // List cameras and microphones.
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter((d) => d.kind === 'videoinput')

          if (videoDevices.length < 1) {
            return notification.warning({
              message: 'Warning',
              description: 'No camera detected',
            })
          }

          setCameraList(videoDevices)

          console.log('Picked first camera:', videoDevices[0])
          notification.info({
            message: 'Info',
            description: `Picked camera "${videoDevices[0].label || videoDevices[0].deviceId}"`,
          })

          setSelectedCamera(videoDevices[0])
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`)
        })
        .finally(() => {
          setIsGettingCameras(false)
        })
    }
  }, [])

  function onDeviceIdChanged(cameraId: string) {
    setSelectedCamera(cameraList.find((cam) => cam.deviceId === cameraId))
  }

  return (
    <div className={clsx('p-3 bg-stone-300 border-b flex flex-col gap-3', 'sticky top-0 z-10')}>
      {!isGettingCameras && !isScanning && (
        <div className="text-center">
          <label htmlFor="sourceSelect">Select Camera:</label>
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
        {(isGettingCameras || !isScanning) && (
          <button
            className="button border"
            onClick={() => selectedCamera && onStartScanning(selectedCamera)}
            disabled={isGettingCameras || !selectedCamera}
          >
            {isGettingCameras ? 'Loading camera...' : 'Start Camera'}
          </button>
        )}

        {!isGettingCameras && isScanning && (
          <button className="button border" onClick={() => onPauseScanning()}>
            Pause Camera
          </button>
        )}
      </div>
    </div>
  )
}
