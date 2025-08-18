"use client"

import { useEffect, useState } from 'react'

import { apiClient } from '@/utils/apiClient'

interface PriceItem {
  code: string
  price: number
}

export default function PriceListPage() {
  const [items, setItems] = useState<PriceItem[]>([])
  const [code, setCode] = useState('')
  const [price, setPrice] = useState('')
  const [version, setVersion] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.get<{ items: PriceItem[]; version: number }>(
          '/price-lists'
        )

        setItems(data.items)
        setVersion(data.version)
        setError(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load price list'

        setError(message)
      }
    }

    load()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)

    if (!code || !price) {
      setError('Code and price are required')

      return
    }

    if (items.some(i => i.code === code)) {
      setError('Code must be unique')

      return
    }

    const priceValue = parseFloat(price)

    if (Number.isNaN(priceValue)) {
      setError('Price must be a number')

      return
    }

    try {
      await apiClient.post('/price-lists/items', { code, price: priceValue })
      setItems([...items, { code, price: priceValue }])
      setCode('')
      setPrice('')
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item'

      setError(message)
    }
  }

  const handleSave = async () => {
    try {
      setError(null)
      setSuccess(null)

      const data = await apiClient.post<{ items: PriceItem[]; version: number }>(
        '/price-lists',
        { items, version }
      )

      setItems(data.items)
      setVersion(data.version)
      setSuccess('Price list saved')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save price list'

      setError(message)
    }
  }

  return (
    <div>
      <h1>Price List v{version}</h1>
      {error && <div className='text-red-500'>{error}</div>}
      {success && <div className='text-green-500'>{success}</div>}
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
      <button onClick={handleSave} disabled={!!error}>Save</button>
    </div>
  )
}

