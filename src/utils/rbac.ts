export const hasRole = (userRoles: string[], required: string | string[]) => {
  const requiredRoles = Array.isArray(required) ? required : [required]

  return requiredRoles.some(role => userRoles.includes(role))
}

export const hasPermission = (userPermissions: string[], required: string | string[]) => {
  const requiredPerms = Array.isArray(required) ? required : [required]

  return requiredPerms.some(permission => userPermissions.includes(permission))
}
