'use client'

import { useState } from 'react'

interface TemplateItem {
  name: string
  markers: string[]
}

export default function TemplatesPage() {
  const [history, setHistory] = useState<TemplateItem[]>([])
  const [markers, setMarkers] = useState<string[]>([])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      const text = reader.result?.toString() || ''
      const found = Array.from(text.match(/{{[^}]+}}/g) || [])

      setMarkers(found)
      setHistory(prev => [...prev, { name: file.name, markers: found }])
    }

    reader.readAsText(file)
  }

  return (
    <div>
      <h1>Templates</h1>
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

