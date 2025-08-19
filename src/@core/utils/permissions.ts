import { Role } from '@/server/security/jwt';
import { canSeePrices, canEditPriceList, canEditProposal } from '@/server/security/rbac';

export const permissions = (role: Role) => ({
  canSeePrices: canSeePrices(role),
  canEditPriceList: canEditPriceList(role),
  canEditProposal: canEditProposal(role)
});
