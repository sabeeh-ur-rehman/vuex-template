"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.policy = void 0;
exports.can = can;
// Simple role based access control matrix
exports.policy = {
    admin: {
        '*': ['*']
    },
    member: {
        '*': ['read']
    }
};
function can(role, action, resource) {
    const rolePolicy = exports.policy[role] || {};
    const actions = rolePolicy[resource] || rolePolicy['*'] || [];
    return actions.includes(action) || actions.includes('*');
}
