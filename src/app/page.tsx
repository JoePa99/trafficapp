'use client'

import { useState } from 'react'
import FileDropZone from '@/components/FileDropZone'
import MappingTable from '@/components/MappingTable'
import ProgressBar from '@/components/ProgressBar'
import { mergeSpecAndStationData } from '@/utils/mergeData'
import { TrafficRow } from '@/types/traffic'

export default function Home() {
  const [specFile, setSpecFile] = useState<File | null>(null)
  const [stationFile, setStationFile] = useState<File | null>(null)
  const [normalizedSpecData, setNormalizedSpecData] = useState<any[]>([])
  const [normalizedStationData, setNormalizedStationData] = useState<any[]>([])
  const [mergedData, setMergedData] = useState<TrafficRow[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [filterByPlatformType, setFilterByPlatformType] = useState(false)
  const [filterByDMA, setFilterByDMA] = useState(false)

  const handleSpecFileUpload = async (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    setSpecFile(file)
    setIsProcessing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setNormalizedSpecData(data.normalizedData)
      setProgress(50)

      // If we have both files, perform the merge
      if (stationFile) {
        const mergedRows = mergeSpecAndStationData(
          data.normalizedData,
          normalizedStationData,
          {
            filterByPlatformType,
            filterByDMA,
            selectedStations: selectedStations.length > 0 ? selectedStations : undefined,
          }
        )
        setMergedData(mergedRows)
        setProgress(100)
      }
    } catch (error) {
      console.error('Error processing spec file:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStationFileUpload = async (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    setStationFile(file)
    setIsProcessing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setNormalizedStationData(data.normalizedData)
      setProgress(50)

      // If we have both files, perform the merge
      if (specFile) {
        const mergedRows = mergeSpecAndStationData(
          normalizedSpecData,
          data.normalizedData,
          {
            filterByPlatformType,
            filterByDMA,
            selectedStations: selectedStations.length > 0 ? selectedStations : undefined,
          }
        )
        setMergedData(mergedRows)
        setProgress(100)
      }
    } catch (error) {
      console.error('Error processing station file:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (mergedData.length === 0) {
      alert('Please upload and process both files first')
      return
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: mergedData }),
      })

      if (!response.ok) {
        throw new Error('PDF generation failed')
      }

      const { pdfUrls } = await response.json()
      // Handle the generated PDF URLs (e.g., display them or trigger downloads)
      console.log('Generated PDFs:', pdfUrls)
    } catch (error) {
      console.error('Error generating PDFs:', error)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Traffic Gen</h1>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Spec Sheet</h2>
          <FileDropZone onFilesUploaded={handleSpecFileUpload} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Station List</h2>
          <FileDropZone onFilesUploaded={handleStationFileUpload} />
        </div>
      </div>

      {isProcessing && <ProgressBar percentage={progress} />}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filterByPlatformType}
              onChange={(e) => setFilterByPlatformType(e.target.checked)}
            />
            Filter by Platform Type
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filterByDMA}
              onChange={(e) => setFilterByDMA(e.target.checked)}
            />
            Filter by DMA
          </label>
        </div>
      </div>

      {mergedData.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Merged Data Preview</h2>
          <MappingTable rows={mergedData} />
        </div>
      )}

      <button
        onClick={handleGeneratePDF}
        disabled={mergedData.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Generate PDFs
      </button>
    </main>
  )
} 