import { useEffect, useRef, useState } from 'react'

import WebCam from 'react-webcam'

import { CameraPicker } from '@react-barcode-scanners/web/ui/component/camera-picker'

export function RxingWasmScanner() {
  const [isScanning, setIsScanning] = useState(false)

  const webcamRef = useRef<WebCam>(null)
  const detectInterval = useRef<NodeJS.Timer>()

  useEffect(() => {
    //
  }, [])

  async function startScanning() {
    //
  }

  function pauseScanning() {
    //
  }

  return (
    <div>
      <CameraPicker
        onStartScanning={(cameraId) => startScanning()}
        onPauseScanning={() => pauseScanning()}
      />

      {isScanning && <WebCam ref={webcamRef} videoConstraints={{ facingMode: 'environment' }} />}
    </div>
  )
}
