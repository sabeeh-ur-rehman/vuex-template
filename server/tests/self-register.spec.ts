import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Helper to load router after mocks
async function createApp() {
  const { default: router } = await import('../src/routes/auth')
  const app = express()
  app.use(express.json())
  app.use('/auth', router)
  return app
}

describe('POST /auth/self-register', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns 403 when self register disabled', async () => {
    process.env.ALLOW_SELF_REGISTER = 'false'
    const app = await createApp()
    const res = await request(app)
      .post('/auth/self-register')
      .send({ tenantCode: 't', name: 'n', email: 'e@e.com', password: 'pass1234' })
    expect(res.status).toBe(403)
  })

  it('returns 404 when tenant not found', async () => {
    process.env.ALLOW_SELF_REGISTER = 'true'
    vi.doMock('../src/db/mongo', () => ({ connectMongo: vi.fn().mockResolvedValue(null) }))
    const tenantFindOne = vi.fn().mockResolvedValue(null)
    vi.doMock('../src/models/Tenant', () => ({ default: { findOne: tenantFindOne } }))
    vi.doMock('../src/models/User', () => ({ default: {} }))
    vi.doMock('../../src/server/security/crypto', () => ({ hashPassword: vi.fn() }))
    const app = await createApp()
    const res = await request(app)
      .post('/auth/self-register')
      .send({ tenantCode: 'ABC', name: 'John', email: 'john@example.com', password: 'password123' })
    expect(res.status).toBe(404)
  })

  it('registers first user as admin', async () => {
    process.env.ALLOW_SELF_REGISTER = 'true'
    vi.doMock('../src/db/mongo', () => ({ connectMongo: vi.fn().mockResolvedValue(null) }))
    vi.doMock('../src/models/Tenant', () => ({ default: { findOne: vi.fn().mockResolvedValue({ _id: 't1' }) } }))
    const userFindOne = vi.fn().mockResolvedValue(null)
    const countDocuments = vi.fn().mockResolvedValue(0)
    const create = vi.fn().mockResolvedValue({ role: 'admin' })
    vi.doMock('../src/models/User', () => ({ default: { findOne: userFindOne, countDocuments, create } }))
    vi.doMock('../../src/server/security/crypto', () => ({ hashPassword: vi.fn().mockResolvedValue('hash') }))
    const app = await createApp()
    const res = await request(app)
      .post('/auth/self-register')
      .send({ tenantCode: 'ABC', name: 'John', email: 'john@example.com', password: 'password123' })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true, role: 'admin' })
    expect(create).toHaveBeenCalled()
  })
})
