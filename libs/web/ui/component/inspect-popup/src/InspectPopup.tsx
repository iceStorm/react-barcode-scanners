import { useEffect, useState } from 'react'
import clsx from 'clsx'

import { IoCloseOutline } from 'react-icons/io5'

import { getCanvasSections } from '@react-barcode-scanners/shared/util/canvas'

interface InspectPopupProps {
  canvas?: HTMLCanvasElement | null
  detectionCallback: (imageData: ImageData) => any
  onClose: () => void
}

interface SectionItem {
  image: ImageData
  barcode: string
}

export function InspectPopup(props: InspectPopupProps) {
  const { canvas, detectionCallback, onClose } = props
  const [sections, setSections] = useState<SectionItem[]>([])

  useEffect(() => {
    if (canvas) {
      // const splittedSections = getCanvasSections(canvas)
      // const detectedSections: SectionItem[] = splittedSections.map((section) => {
      //   return detectionCallback(section)
      // })
      // setSections(detectedSections)
    }

    return () => {
      // onClose()
    }
  }, [canvas, detectionCallback, onClose])

  return (
    <div className={clsx('rounded-t-2xl border-t', 'bg-white')}>
      <header className={clsx('p-3', 'border-b')}>
        <div className="flex justify-end">
          <button
            className="rounded-full p-1 bg-gray-50 active:bg-gray-200 border"
            onClick={() => onClose()}
          >
            <IoCloseOutline size={20} />
          </button>
        </div>
      </header>

      <main className="p-3" style={{ minHeight: 200 }}>
        {!sections.length && <p>No Image data.</p>}

        {sections.map((section, index) => {
          return (
            <div key={index}>
              <canvas></canvas>
              <p>{section.barcode}</p>
            </div>
          )
        })}
      </main>
    </div>
  )
}
