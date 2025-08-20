export type Role = 'admin' | 'rep' | 'user'

export interface JwtPayload {
  sub: string
  tenantId: string
  role: Role
  name: string
  email: string
}
