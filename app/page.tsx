'use client'

import { useState } from 'react'
import FileDropZone from '@/components/FileDropZone'
import MappingTable from '@/components/MappingTable'
import ProgressBar from '@/components/ProgressBar'

type Step = 'upload' | 'review' | 'generate'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [mappingData, setMappingData] = useState<any>(null)

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files)
    setCurrentStep('review')
  }

  const handleMappingComplete = (data: any) => {
    setMappingData(data)
    setCurrentStep('generate')
  }

  const steps = [
    { id: 'upload', title: 'Upload Files' },
    { id: 'review', title: 'Review Data' },
    { id: 'generate', title: 'Generate Reports' },
  ]

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Traffic Gen</h1>
        
        <ProgressBar steps={steps} currentStep={currentStep} />
        
        <div className="mt-8">
          {currentStep === 'upload' && (
            <FileDropZone onFilesUploaded={handleFilesUploaded} />
          )}
          
          {currentStep === 'review' && (
            <MappingTable 
              files={uploadedFiles}
              onMappingComplete={handleMappingComplete}
            />
          )}
          
          {currentStep === 'generate' && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">Generate Reports</h2>
              <p className="mb-4">Ready to generate traffic instruction reports for {uploadedFiles.length} files.</p>
              <button
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  // TODO: Implement report generation
                  console.log('Generating reports...')
                }}
              >
                Generate Reports
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 