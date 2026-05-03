// ── Validation helpers ──

export interface ValidationResult { valid: boolean; message: string; }

export function validatePhone(value: string): ValidationResult {
  const digits = value.replace(/\D/g, '');
  if (!value.trim()) return { valid: true, message: '' }; // optional
  if (digits.length !== 10) return { valid: false, message: 'Phone must be 10 digits' };
  if (!/^[6-9]/.test(digits)) return { valid: false, message: 'Must start with 6, 7, 8, or 9' };
  return { valid: true, message: '' };
}

export function validateAadhaar(value: string): ValidationResult {
  const digits = value.replace(/\s/g, '');
  if (!value.trim()) return { valid: true, message: '' };
  if (!/^\d{12}$/.test(digits)) return { valid: false, message: 'Aadhaar must be exactly 12 digits' };
  if (/^[01]/.test(digits)) return { valid: false, message: 'Invalid Aadhaar number' };
  return { valid: true, message: '' };
}

export function validateName(value: string): ValidationResult {
  if (!value.trim()) return { valid: false, message: 'Name is required' };
  if (value.trim().length < 2) return { valid: false, message: 'Name too short' };
  if (value.trim().length > 100) return { valid: false, message: 'Name too long' };
  // Allow letters, spaces, dots, hyphens — supports Hindi/Devanagari too
  if (/[^a-zA-Z\u0900-\u097F\s.\-']/.test(value)) return { valid: false, message: 'Name contains invalid characters' };
  return { valid: true, message: '' };
}

export function validateState(value: string): ValidationResult {
  if (!value.trim()) return { valid: false, message: 'Please select a state' };
  return { valid: true, message: '' };
}

export function validatePositiveInt(value: number, min = 0, max = 999, label = 'Value'): ValidationResult {
  if (!Number.isInteger(value)) return { valid: false, message: `${label} must be a whole number` };
  if (value < min) return { valid: false, message: `${label} must be at least ${min}` };
  if (value > max) return { valid: false, message: `${label} must be at most ${max}` };
  return { valid: true, message: '' };
}

export function validateHouseNo(value: string): ValidationResult {
  if (!value.trim()) return { valid: false, message: 'House number is required' };
  if (value.trim().length > 20) return { valid: false, message: 'Too long (max 20 chars)' };
  return { valid: true, message: '' };
}

export function validateCheckboxMin(values: string[], min = 1): ValidationResult {
  if (values.length < min) return { valid: false, message: `Please select at least ${min} option` };
  return { valid: true, message: '' };
}

export function validateRadio(value: string, fieldName = 'This field'): ValidationResult {
  if (!value) return { valid: false, message: `${fieldName} is required` };
  return { valid: true, message: '' };
}

// Format phone number as user types
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 5) return digits;
  return digits.slice(0, 5) + ' ' + digits.slice(5);
}

// Format Aadhaar as XXXX XXXX XXXX
export function formatAadhaar(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 12);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) parts.push(digits.slice(i, i + 4));
  return parts.join(' ');
}
