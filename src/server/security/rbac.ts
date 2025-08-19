export const canSeePrices = (role: 'admin'|'rep'|'user') => role !== 'user';
export const canEditPriceList = (role: 'admin'|'rep'|'user') => role === 'admin';
export const canEditProposal = (role: 'admin'|'rep'|'user') => role === 'admin' || role === 'rep';
