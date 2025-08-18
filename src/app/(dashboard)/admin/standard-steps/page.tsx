'use client'

import { useEffect, useState } from 'react'

import { apiClient } from '@/utils/apiClient'

interface Item {
  _id: string
  name: string
}

export default function StandardStepsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)

      try {
        const data = await apiClient.get<{ items: Item[] }>('/steps')

        setItems(data.items)
      } catch {
        alert('Failed to load steps')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)

    try {
      if (editingId === null) {
        const created = await apiClient.post<Item>('/steps', { name })

        setItems([...items, created])
        alert('Step added')
      } else {
        const updated = await apiClient.put<Item>(`/steps/${editingId}`, { name })

        setItems(items.map(item => (item._id === editingId ? updated : item)))
        setEditingId(null)
        alert('Step updated')
      }

      setName('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save step'

      alert(message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    const item = items.find(i => i._id === id)

    if (!item) return
    setName(item.name)
    setEditingId(id)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)

    try {
      await apiClient.del(`/steps/${id}`)
      setItems(items.filter(item => item._id !== id))

      if (editingId === id) {
        setEditingId(null)
        setName('')
      }

      alert('Step deleted')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete step'

      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Standard Steps</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Name'
          disabled={loading}
        />
        <button type='submit' disabled={loading}>
          {editingId === null ? 'Add' : 'Update'}
        </button>
      </form>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.name}
            <button onClick={() => handleEdit(item._id)} disabled={loading}>
              Edit
            </button>
            <button onClick={() => handleDelete(item._id)} disabled={loading}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

