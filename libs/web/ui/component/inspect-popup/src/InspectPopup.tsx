import { useEffect, useState } from 'react'
import clsx from 'clsx'

import { IoCloseOutline } from 'react-icons/io5'

import { getCanvasSections, imagedataToImage } from '@react-barcode-scanners/shared/util/canvas'
import { useBottomSheetStore } from '@react-barcode-scanners/web/data-access/store'

interface InspectPopupProps {
  onClose: () => void
}

interface SectionItem {
  image: {
    data: ImageData
    base64: string
  }
  barcode: string
}

export function InspectPopup(props: InspectPopupProps) {
  const { onClose } = props
  const [sections, setSections] = useState<SectionItem[]>([])

  const { canvas, detectionCallback } = useBottomSheetStore()

  useEffect(() => {
    if (canvas) {
      try {
        const splittedSections = getCanvasSections(canvas)

        const detectedSections: SectionItem[] = splittedSections.map((section) => {
          let detectedBarcode
          try {
            detectedBarcode = detectionCallback?.(section)
          } catch (error) {
            console.error(error)
          }

          return {
            image: {
              data: section,
              base64: imagedataToImage(section),
            },
            barcode: detectedBarcode,
          }
        })

        setSections(detectedSections)
      } catch (error) {
        console.error(error)
      }
    }

    return () => {
      // onClose()
    }
  }, [])

  return (
    <div className={clsx('rounded-t-2xl border-t', 'bg-white')}>
      <header className={clsx('p-3', 'border-b')}>
        <div className="flex justify-between items-center">
          <p>Splitting Image</p>

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

        <div className="flex flex-col gap-10 p-5">
          {sections.map((section, index) => {
            return (
              <div key={index} className="border rounded-md overflow-hidden">
                <img src={section.image.base64} alt="canvas_section" className="w-full" />

                <div className="p-3">
                  <p>
                    <span className="font-bold">Detected barcode: </span>
                    <span>{section.barcode || '?'}</span>
                  </p>

                  <p>
                    <span className="font-bold">Size: </span>
                    <span>
                      {section.image.data.width} &times; {section.image.data.height}
                    </span>
                  </p>

                  {index === sections.length - 1 && (
                    <p className="mt-5 font-bold text-blue-500">Original Image</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
