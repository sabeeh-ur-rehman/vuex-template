'use client'

import { useState } from 'react'

interface PriceItem {
  code: string
  price: number
}

export default function PriceListPage() {
  const [items, setItems] = useState<PriceItem[]>([])
  const [code, setCode] = useState('')
  const [price, setPrice] = useState('')
  const [version, setVersion] = useState(1)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()

    if (items.some(i => i.code === code)) {
      alert('Code must be unique')
      
return
    }

    setItems([...items, { code, price: parseFloat(price) }])
    setCode('')
    setPrice('')
  }

  const handleSave = () => {
    if (window.confirm(`Bump version to ${version + 1}?`)) {
      setVersion(v => v + 1)
      alert('Price list saved')
    }
  }

  return (
    <div>
      <h1>Price List v{version}</h1>
      <form onSubmit={handleAdd}>
        <input value={code} onChange={e => setCode(e.target.value)} placeholder='Code' />
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder='Price'
          type='number'
          step='0.01'
        />
        <button type='submit'>Add</button>
      </form>
      <ul>
        {items.map(item => (
          <li key={item.code}>
            {item.code}: ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <button onClick={handleSave}>Save</button>
    </div>
  )
}

