'use client'

import { useState, useRef } from 'react'
import { DirectoryCSVImporter } from '@/lib/csv-directory-import'
import AuthGuard from '@/components/directory/AuthGuard'

export default function ImportPage() {
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const [csvContent, setCsvContent] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }

    const text = await file.text()
    setCsvContent(text)
  }

  const handleImport = async () => {
    if (!csvContent.trim()) {
      alert('Please upload a CSV file first')
      return
    }

    setImporting(true)
    try {
      const result = await DirectoryCSVImporter.importFromCSV(csvContent)
      setImportResult(result)
    } catch (error) {
      console.error('Import error:', error)
      setImportResult({
        success: false,
        imported: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duplicates: 0
      })
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = DirectoryCSVImporter.generateImportTemplate()
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pain-medicine-directory-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="border-b px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Import Pain Medicine Leaders
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Import profiles from a CSV file into the directory
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Import Instructions
                </h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Upload a CSV file with the required columns</li>
                  <li>Make sure your CSV file includes headers</li>
                  <li>Required fields: Full Name, Professional Email</li>
                  <li>Optional fields: Institution, Job Role, Nationality, etc.</li>
                  <li>Duplicate emails will be skipped automatically</li>
                </ul>
              </div>

              {/* Template Download */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    CSV Template
                  </h3>
                  <p className="text-sm text-gray-600">
                    Download the template to see the expected format
                  </p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Download Template
                </button>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Upload CSV File
                </h3>
                
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="space-y-2">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {csvContent ? 'File uploaded successfully' : 'Drop your CSV file here, or click to browse'}
                      </p>
                      {csvContent && (
                        <p className="text-xs text-green-600 mt-1">
                          Ready to import {csvContent.split('\n').length - 1} profiles
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CSV Preview */}
              {csvContent && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    CSV Preview
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {csvContent.split('\n')[0].split(',').slice(0, 5).map((header, index) => (
                              <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header.replace(/"/g, '')}
                              </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ...
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {csvContent.split('\n').slice(1, 4).map((row, index) => (
                            <tr key={index}>
                              {row.split(',').slice(0, 5).map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                  {cell.replace(/"/g, '').substring(0, 30)}
                                  {cell.length > 30 && '...'}
                                </td>
                              ))}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ...
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleImport}
                  disabled={!csvContent.trim() || importing}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Importing...</span>
                    </div>
                  ) : (
                    'Import Profiles'
                  )}
                </button>
              </div>

              {/* Import Results */}
              {importResult && (
                <div className={`rounded-lg p-4 ${
                  importResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <h3 className={`text-lg font-medium mb-2 ${
                    importResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    Import {importResult.success ? 'Completed' : 'Failed'}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Successfully imported:</span>
                        <span className={`ml-2 ${importResult.success ? 'text-green-700' : 'text-red-700'}`}>
                          {importResult.imported}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Failed:</span>
                        <span className={`ml-2 ${importResult.success ? 'text-green-700' : 'text-red-700'}`}>
                          {importResult.failed}
                        </span>
                      </div>
                      {importResult.duplicates > 0 && (
                        <div>
                          <span className="font-medium">Duplicates skipped:</span>
                          <span className="ml-2 text-yellow-600">{importResult.duplicates}</span>
                        </div>
                      )}
                    </div>

                    {importResult.errors && importResult.errors.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Errors:</h4>
                        <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                          {importResult.errors.map((error: string, index: number) => (
                            <li key={index} className="text-red-700">
                              • {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {importResult.success && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <p className="text-sm text-green-800">
                        Import completed successfully! You can now view the imported profiles in the directory.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
