export type Role = 'admin' | 'member';
export type Action = 'create' | 'read' | 'update' | 'delete' | '*';
export type Resource = string;

interface PolicyMatrix {
  [role: string]: {
    [resource: string]: Action[];
  };
}

// Simple role based access control matrix
export const policy: PolicyMatrix = {
  admin: {
    '*': ['*']
  },
  member: {
    '*': ['read']
  }
};

export function can(role: Role, action: Action, resource: Resource): boolean {
  const rolePolicy = policy[role] || {};
  const actions = rolePolicy[resource] || rolePolicy['*'] || [];
  return actions.includes(action) || actions.includes('*');
}
