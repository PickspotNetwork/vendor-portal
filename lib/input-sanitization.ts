/**
 * Input sanitization and validation utilities for SQL injection prevention
 * and general security hardening
 */

// Common SQL injection patterns to detect and block
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/i,
  /(--|\/\*|\*\/|;|'|"|`)/,
  /(\bOR\b|\bAND\b).*?[=<>]/i,
  /(\b(UNION|SELECT).*?(FROM|WHERE)\b)/i,
  /(script|javascript|vbscript|onload|onerror|onclick)/i,
  /(<|>|&lt;|&gt;)/,
  /(eval|setTimeout|setInterval|Function)/i
]

// XSS patterns to detect
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<img[^>]+src[^>]*>/gi
]

/**
 * Sanitize input string by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}

/**
 * Validate input against SQL injection patterns
 */
export function validateAgainstSQLInjection(input: string): {
  isValid: boolean
  detectedPattern?: string
} {
  if (typeof input !== 'string') {
    return { isValid: false, detectedPattern: 'Invalid input type' }
  }

  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return { 
        isValid: false, 
        detectedPattern: `Potentially dangerous pattern detected: ${pattern.source}` 
      }
    }
  }

  return { isValid: true }
}

/**
 * Validate input against XSS patterns
 */
export function validateAgainstXSS(input: string): {
  isValid: boolean
  detectedPattern?: string
} {
  if (typeof input !== 'string') {
    return { isValid: false, detectedPattern: 'Invalid input type' }
  }

  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      return { 
        isValid: false, 
        detectedPattern: `Potentially dangerous XSS pattern detected` 
      }
    }
  }

  return { isValid: true }
}

/**
 * Comprehensive input validation for forms
 */
export function validateFormInput(input: string, fieldName: string): {
  isValid: boolean
  sanitizedInput: string
  errors: string[]
} {
  const errors: string[] = []
  
  // Sanitize first
  const sanitizedInput = sanitizeInput(input)
  
  // Check for SQL injection
  const sqlCheck = validateAgainstSQLInjection(sanitizedInput)
  if (!sqlCheck.isValid) {
    errors.push(`${fieldName} contains potentially dangerous content`)
  }
  
  // Check for XSS
  const xssCheck = validateAgainstXSS(sanitizedInput)
  if (!xssCheck.isValid) {
    errors.push(`${fieldName} contains potentially dangerous script content`)
  }
  
  // Length validation
  if (sanitizedInput.length > 1000) {
    errors.push(`${fieldName} is too long (maximum 1000 characters)`)
  }
  
  return {
    isValid: errors.length === 0,
    sanitizedInput,
    errors
  }
}

/**
 * Validate phone number format and sanitize
 */
export function validatePhoneNumber(phone: string): {
  isValid: boolean
  sanitizedPhone: string
  error?: string
} {
  const sanitized = sanitizeInput(phone)
  
  // Basic phone validation - digits, spaces, dashes, parentheses, plus
  const phonePattern = /^[\d\s\-\(\)\+]+$/
  
  if (!phonePattern.test(sanitized)) {
    return {
      isValid: false,
      sanitizedPhone: sanitized,
      error: 'Phone number contains invalid characters'
    }
  }
  
  // Extract only digits
  const digitsOnly = sanitized.replace(/\D/g, '')
  
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return {
      isValid: false,
      sanitizedPhone: sanitized,
      error: 'Phone number must be between 10-15 digits'
    }
  }
  
  return {
    isValid: true,
    sanitizedPhone: sanitized
  }
}

/**
 * Validate name fields (first name, last name)
 */
export function validateName(name: string): {
  isValid: boolean
  sanitizedName: string
  error?: string
} {
  const sanitized = sanitizeInput(name)
  
  // Names should only contain letters, spaces, hyphens, and apostrophes
  const namePattern = /^[a-zA-Z\s\-']+$/
  
  if (!namePattern.test(sanitized)) {
    return {
      isValid: false,
      sanitizedName: sanitized,
      error: 'Name contains invalid characters'
    }
  }
  
  if (sanitized.length < 1 || sanitized.length > 50) {
    return {
      isValid: false,
      sanitizedName: sanitized,
      error: 'Name must be between 1-50 characters'
    }
  }
  
  return {
    isValid: true,
    sanitizedName: sanitized
  }
}
