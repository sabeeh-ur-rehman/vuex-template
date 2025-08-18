"use client"

import { useEffect, useMemo, useState } from "react"
import { apiClient } from "@/utils/apiClient"

type TenantId = string

interface PriceItem {
  name: string
  unit: string
  price: number
  description?: string
}

interface PriceListPayload {
  tenantId: TenantId
  name: string
  description?: string
  items: PriceItem[]
}

// TODO: wire this from auth/route/context
const DEFAULT_TENANT: TenantId = "000000000000000000000001"

export default function PriceListPage() {
  const [tenantId] = useState<TenantId>(DEFAULT_TENANT)
  const [listName, setListName] = useState("First Price")
  const [listDescription, setListDescription] = useState("Default pricing")

  const [items, setItems] = useState<PriceItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // new item form
  const [newName, setNewName] = useState("")
  const [newUnit, setNewUnit] = useState("")
  const [newPrice, setNewPrice] = useState<string>("")
  const [newDesc, setNewDesc] = useState("")

  const duplicateNames = useMemo(() => {
    const seen = new Set<string>()
    const dups = new Set<string>()
    for (const it of items) {
      const key = it.name.trim().toLowerCase()
      if (seen.has(key)) dups.add(key)
      seen.add(key)
    }
    return dups
  }, [items])

  // LOAD existing list
  useEffect(() => {
    const load = async () => {
      try {
        setError(null)
        // Make sure your apiClient baseURL includes /api (or use full path below)
        const data = await apiClient.get<Partial<PriceListPayload>>(
          `/price-lists?tenantId=${encodeURIComponent(tenantId)}`
        )

        if (data?.items?.length) {
          const normalized = data.items
            .map(i => ({
              name: String(i.name ?? "").trim(),
              unit: String(i.unit ?? "").trim(),
              price: Number(i.price),
              description: i.description ? String(i.description) : undefined,
            }))
            .filter(i => i.name && i.unit && Number.isFinite(i.price))
          setItems(normalized)
        } else {
          setItems([])
        }

        if (typeof data?.name === "string" && data.name.trim()) setListName(data.name)
        if (typeof data?.description === "string") setListDescription(data.description)
      } catch (e) {
        // If 404/no list yet, start blank
        setItems([])
        setError(null)
      }
    }
    load()
  }, [tenantId])

  const addItem = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    setError(null)

    const name = newName.trim()
    const unit = newUnit.trim()
    const priceNum = Number(newPrice)

    if (!name || !unit || !newPrice) return setError("Name, unit, and price are required.")
    if (!Number.isFinite(priceNum)) return setError("Price must be a valid number.")
    if (items.some(i => i.name.trim().toLowerCase() === name.toLowerCase()))
      return setError("Item name must be unique.")

    setItems(prev => [...prev, { name, unit, price: priceNum, description: newDesc.trim() || undefined }])
    setNewName("")
    setNewUnit("")
    setNewPrice("")
    setNewDesc("")
  }

  const removeItem = (name: string) => {
    setItems(prev => prev.filter(i => i.name !== name))
  }

  const updateItemField = (index: number, field: keyof PriceItem, value: string) => {
    setItems(prev => {
      const copy = [...prev]
      const item = { ...copy[index] }
      if (field === "price") {
        const num = Number(value)
        // allow empty while typing
        item.price = Number.isFinite(num) ? num : (copy[index].price ?? 0)
      } else if (field === "name" || field === "unit" || field === "description") {
        ; (item as any)[field] = value
      }
      copy[index] = item
      return copy
    })
  }

  const save = async () => {
    try {
      setError(null)
      setSuccess(null)

      if (!tenantId) return setError("Missing tenantId.")
      if (!listName.trim()) return setError("List name is required.")
      if (!items.length) return setError("Add at least one item.")

      // basic client-side validation
      for (const it of items) {
        if (!it.name.trim() || !it.unit.trim() || !Number.isFinite(it.price)) {
          return setError("Every item needs a name, unit, and numeric price.")
        }
      }
      if (duplicateNames.size) {
        return setError("Duplicate item names are not allowed.")
      }

      const payload: PriceListPayload = {
        tenantId,
        name: listName.trim(),
        description: listDescription.trim() || undefined,
        items: items.map(it => ({
          name: it.name.trim(),
          unit: it.unit.trim(),
          price: Number(it.price),
          description: it.description?.trim() || undefined,
        })),
      }

      // POST to your API (create or update)
      const result = await apiClient.post<PriceListPayload>("/price-lists", payload)

      // normalize the echo back
      const normalized = (result.items ?? []).map(i => ({
        name: String(i.name ?? "").trim(),
        unit: String(i.unit ?? "").trim(),
        price: Number(i.price),
        description: i.description ? String(i.description) : undefined,
      }))
      setItems(normalized)
      if (result.name) setListName(result.name)
      if (typeof result.description === "string") setListDescription(result.description)
      setSuccess("Price list saved.")
    } catch (e: any) {
      setError(e?.message || "Failed to save price list.")
    }
  }

  const fmt = (n: number) => (Number.isFinite(n) ? Number(n).toFixed(2) : "0.00")

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Price List</h1>

      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <div className="space-y-2">
        <div>
          <label className="block text-sm">Tenant ID</label>
          <input className="border p-2 w-full" value={tenantId} disabled />
        </div>
        <div>
          <label className="block text-sm">List Name</label>
          <input
            className="border p-2 w-full"
            value={listName}
            onChange={e => setListName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <input
            className="border p-2 w-full"
            value={listDescription}
            onChange={e => setListDescription(e.target.value)}
          />
        </div>
      </div>

      <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
        <div>
          <label className="block text-sm">Item Name</label>
          <input className="border p-2 w-full" value={newName} onChange={e => setNewName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Unit</label>
          <input className="border p-2 w-full" value={newUnit} onChange={e => setNewUnit(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Price</label>
          <input
            className="border p-2 w-full"
            value={newPrice}
            onChange={e => setNewPrice(e.target.value)}
            type="number"
            step="0.01"
            inputMode="decimal"
          />
        </div>
        <div className="md:col-span-4">
          <label className="block text-sm">Description (optional)</label>
          <div className="flex gap-2">
            <input className="border p-2 w-full" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <button type="submit" className="border px-4 py-2">Add</button>
          </div>
        </div>
      </form>

      <div className="border rounded">
        <div className="grid grid-cols-5 font-medium border-b p-2">
          <div>Name</div>
          <div>Unit</div>
          <div>Price</div>
          <div>Description</div>
          <div></div>
        </div>
        {items.map((it, idx) => {
          const isDup = duplicateNames.has(it.name.trim().toLowerCase())
          return (
            <div key={`${it.name}-${idx}`} className="grid grid-cols-5 items-center border-b p-2 gap-2">
              <input
                className={`border p-1 w-full ${isDup ? "border-red-500" : ""}`}
                value={it.name}
                onChange={e => updateItemField(idx, "name", e.target.value)}
              />
              <input
                className="border p-1 w-full"
                value={it.unit}
                onChange={e => updateItemField(idx, "unit", e.target.value)}
              />
              <input
                className="border p-1 w-full"
                type="number"
                step="0.01"
                value={String(it.price)}
                onChange={e => updateItemField(idx, "price", e.target.value)}
              />
              <input
                className="border p-1 w-full"
                value={it.description ?? ""}
                onChange={e => updateItemField(idx, "description", e.target.value)}
              />
              <button type="button" className="border px-2 py-1" onClick={() => removeItem(it.name)}>
                Delete
              </button>
            </div>
          )
        })}
        {!items.length && <div className="p-3 text-sm text-gray-600">No items yet. Add one above.</div>}
      </div>

      <button onClick={save} className="border px-4 py-2">Save</button>
    </div>
  )
}
