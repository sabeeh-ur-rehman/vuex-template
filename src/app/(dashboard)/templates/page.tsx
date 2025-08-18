'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/utils/apiClient'

interface TemplateItem {
  name: string
  markers: string[]
}

export default function TemplatesPage() {
  const [history, setHistory] = useState<TemplateItem[]>([])
  const [markers, setMarkers] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await apiClient.get<{ items: TemplateItem[] }>('/templates')
        setHistory(data.items || [])
        setError(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load templates'
        setError(message)
      }
    }
    loadHistory()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setError(null)
      const uploaded = await apiClient.post<TemplateItem>('/templates', formData)
      setMarkers(uploaded.markers)
      setHistory(prev => [...prev, uploaded])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
    }
  }

  return (
    <div>
      <h1>Templates</h1>
      {error && <div className='text-red-500'>{error}</div>}
      <input type='file' accept='.docx' onChange={handleUpload} />
      {markers.length > 0 && (
        <div>
          <h2>Markers</h2>
          <ul>
            {markers.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      <h2>History</h2>
      <ul>
        {history.map((item, i) => (
          <li key={i}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}

