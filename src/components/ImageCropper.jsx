import React, { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../lib/cropImage'
import { X, Check } from 'lucide-react'

export default function ImageCropper({ imageSrc, onCropCompleteAction, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        0
      )
      onCropCompleteAction(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white border-4 border-brew-text rounded-3xl p-6 shadow-[8px_8px_0px_0px_currentColor] w-full max-w-lg flex flex-col gap-6 animate-fade-up">
        <div className="flex justify-between items-center">
          <h3 className="font-inter font-black text-xl uppercase tracking-tight text-brew-text">
            Adjust Avatar
          </h3>
          <button onClick={onCancel} className="text-brew-text hover:bg-black/5 p-1 rounded-lg transition-colors">
            <X strokeWidth={3} />
          </button>
        </div>

        <div className="relative w-full h-[300px] sm:h-[400px] bg-brew-text/5 rounded-2xl overflow-hidden border-2 border-brew-text">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div>
          <label className="block font-inter font-black text-[10px] uppercase tracking-widest text-brew-text mb-2">
            Zoom
          </label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(e.target.value)}
            className="w-full accent-brew-text cursor-pointer"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-[#fffdf0] text-brew-text border-2 border-brew-text rounded-xl font-inter font-black text-xs uppercase tracking-widest hover:bg-yellow-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-brew-yellow text-brew-text border-2 border-brew-text rounded-xl font-inter font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
          >
            <Check size={16} strokeWidth={3} />
            Save Crop
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
