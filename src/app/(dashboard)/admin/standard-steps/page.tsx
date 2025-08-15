'use client'

import { useState } from 'react'

interface Item {
  id: number
  name: string
}

export default function StandardStepsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingId === null) {
      setItems([...items, { id: Date.now(), name }])
    } else {
      setItems(items.map(item => (item.id === editingId ? { ...item, name } : item)))
      setEditingId(null)
    }

    setName('')
  }

  const handleEdit = (id: number) => {
    const item = items.find(i => i.id === id)

    if (!item) return
    setName(item.name)
    setEditingId(id)
  }

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div>
      <h1>Standard Steps</h1>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
        <button type='submit'>{editingId === null ? 'Add' : 'Update'}</button>
      </form>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => handleEdit(item.id)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

