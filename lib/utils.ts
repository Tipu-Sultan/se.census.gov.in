// State codes — official 2-letter codes used in Indian census
export const STATE_CODES: Record<string, string> = {
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  'Assam': 'AS',
  'Bihar': 'BR',
  'Chhattisgarh': 'CG',
  'Goa': 'GA',
  'Gujarat': 'GJ',
  'Haryana': 'HR',
  'Himachal Pradesh': 'HP',
  'Jharkhand': 'JH',
  'Karnataka': 'KA',
  'Kerala': 'KL',
  'Madhya Pradesh': 'MP',
  'Maharashtra': 'MH',
  'Manipur': 'MN',
  'Meghalaya': 'ML',
  'Mizoram': 'MZ',
  'Nagaland': 'NL',
  'Odisha': 'OD',
  'Punjab': 'PB',
  'Rajasthan': 'RJ',
  'Sikkim': 'SK',
  'Tamil Nadu': 'TN',
  'Telangana': 'TS',
  'Tripura': 'TR',
  'Uttar Pradesh': 'UP',
  'Uttarakhand': 'UK',
  'West Bengal': 'WB',
  'Andaman and Nicobar Islands': 'AN',
  'Chandigarh': 'CH',
  'Dadra and Nagar Haveli and Daman and Diu': 'DN',
  'Delhi': 'DL',
  'Jammu and Kashmir': 'JK',
  'Ladakh': 'LA',
  'Lakshadweep': 'LD',
  'Puducherry': 'PY',
};

export const INDIAN_STATES = Object.keys(STATE_CODES);

/**
 * Generate a Census Submission ID
 * Format: {STATE_CODE}-{YEAR}-{PHASE}-{6 alphanumeric chars}
 * Example: UP-2027-P1-X4K9M2
 */
export function generateSubmissionId(state: string): string {
  const code = STATE_CODES[state] || 'XX';
  const year = '2027';
  const phase = 'P1';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid confusion
  let uid = '';
  for (let i = 0; i < 6; i++) {
    uid += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${code}-${year}-${phase}-${uid}`;
}

/**
 * Validate a submission ID format
 */
export function isValidSubmissionId(id: string): boolean {
  return /^[A-Z]{2}-2027-P1-[A-Z0-9]{6}$/.test(id.trim().toUpperCase());
}

export type Lang = 'en' | 'hi';

export const STEPS = (lang: Lang) => [
  { id: 0, title: lang === 'hi' ? 'स्थान विवरण' : 'Location Details', icon: '📍', hint: lang === 'hi' ? 'राज्य, जिला, गाँव' : 'State, District, Village' },
  { id: 1, title: lang === 'hi' ? 'परिवार पहचान' : 'Household Identity', icon: '👨‍👩‍👧‍👦', hint: lang === 'hi' ? 'मुखिया, सदस्य' : 'Head, Members' },
  { id: 2, title: lang === 'hi' ? 'भवन संरचना' : 'Building & Structure', icon: '🏗️', hint: lang === 'hi' ? 'प्रकार, स्थिति, कमरे' : 'Type, Condition, Rooms' },
  { id: 3, title: lang === 'hi' ? 'जल एवं स्वच्छता' : 'Water & Sanitation', icon: '💧', hint: lang === 'hi' ? 'जल स्रोत, शौचालय' : 'Water source, Toilet' },
  { id: 4, title: lang === 'hi' ? 'ऊर्जा एवं रसोई' : 'Energy & Kitchen', icon: '⚡', hint: lang === 'hi' ? 'प्रकाश, ईंधन, रसोई' : 'Lighting, Fuel, Kitchen' },
  { id: 5, title: lang === 'hi' ? 'संपत्ति एवं उपकरण' : 'Assets & Devices', icon: '📱', hint: lang === 'hi' ? 'इलेक्ट्रॉनिक्स, वाहन' : 'Electronics, Vehicles' },
  { id: 6, title: lang === 'hi' ? 'स्वामित्व एवं बैंकिंग' : 'Ownership & Banking', icon: '🏦', hint: lang === 'hi' ? 'भूमि, बैंक, आधार' : 'Land, Bank, Aadhaar' },
];
