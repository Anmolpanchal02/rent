import { UserRole } from '@/types'

/**
 * Role verification utilities for checking user permissions
 * These helpers can be used throughout the application for role-based logic
 */

/**
 * Check if a user has a specific role
 * @param userRole - The user's current role
 * @param requiredRole - The role to check against
 * @returns true if the user has the required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return userRole === requiredRole
}

/**
 * Check if a user has any of the specified roles
 * @param userRole - The user's current role
 * @param allowedRoles - Array of roles to check against
 * @returns true if the user has any of the allowed roles
 */
export function hasAnyRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole)
}

/**
 * Check if a user is a tenant
 * @param userRole - The user's current role
 * @returns true if the user is a tenant
 */
export function isTenant(userRole: UserRole): boolean {
  return userRole === 'tenant'
}

/**
 * Check if a user is an owner
 * @param userRole - The user's current role
 * @returns true if the user is an owner
 */
export function isOwner(userRole: UserRole): boolean {
  return userRole === 'owner'
}

/**
 * Check if a user is an admin
 * @param userRole - The user's current role
 * @returns true if the user is an admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'admin'
}

/**
 * Check if a user can access tenant features
 * Tenants can access property browsing, filtering, booking, and chat
 * @param userRole - The user's current role
 * @returns true if the user can access tenant features
 */
export function canAccessTenantFeatures(userRole: UserRole): boolean {
  return isTenant(userRole)
}

/**
 * Check if a user can access owner features
 * Owners can access property management, booking request handling, and performance metrics
 * @param userRole - The user's current role
 * @returns true if the user can access owner features
 */
export function canAccessOwnerFeatures(userRole: UserRole): boolean {
  return isOwner(userRole)
}

/**
 * Check if a user can access admin features
 * Admins can access user monitoring, property management, and content moderation
 * @param userRole - The user's current role
 * @returns true if the user can access admin features
 */
export function canAccessAdminFeatures(userRole: UserRole): boolean {
  return isAdmin(userRole)
}

/**
 * Get a list of features accessible by a user role
 * @param userRole - The user's current role
 * @returns Array of feature names accessible by the role
 */
export function getAccessibleFeatures(userRole: UserRole): string[] {
  switch (userRole) {
    case 'tenant':
      return ['property-browsing', 'property-filtering', 'booking', 'chat']
    case 'owner':
      return ['property-management', 'booking-requests', 'performance-metrics', 'chat']
    case 'admin':
      return ['user-monitoring', 'property-management', 'content-moderation', 'chat']
    default:
      return []
  }
}

/**
 * Check if a user can access a specific feature
 * @param userRole - The user's current role
 * @param feature - The feature to check access for
 * @returns true if the user can access the feature
 */
export function canAccessFeature(userRole: UserRole, feature: string): boolean {
  const accessibleFeatures = getAccessibleFeatures(userRole)
  return accessibleFeatures.includes(feature)
}

/**
 * Validate if a role is valid
 * @param role - The role to validate
 * @returns true if the role is valid
 */
export function isValidRole(role: string): role is UserRole {
  return ['tenant', 'owner', 'admin'].includes(role)
}
