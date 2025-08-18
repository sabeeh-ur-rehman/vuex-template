'use client'

import { useEffect, useState } from 'react'

import { apiClient } from '@/utils/apiClient'

interface User {
  _id: string
  email: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiClient.get<{ items: User[] }>('/users')

        setUsers(data.items)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'

        setError(message)
      }
    }

    fetchUsers()
  }, [])

  if (error) {
    return <div className='text-red-500'>{error}</div>
  }

  return (
    <div>
      <h1 className='text-xl font-bold mb-4'>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.email}</li>
        ))}
      </ul>
    </div>
  )
}
