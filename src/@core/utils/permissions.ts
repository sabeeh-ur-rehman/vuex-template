import type { Role } from '@/types/auth'

export const canSeePrices = (role: Role) => role !== 'user'
export const canEditPriceList = (role: Role) => role === 'admin'
export const canEditProposal = (role: Role) => role === 'admin' || role === 'rep'

export const permissions = (role: Role) => ({
  canSeePrices: canSeePrices(role),
  canEditPriceList: canEditPriceList(role),
  canEditProposal: canEditProposal(role)
})
