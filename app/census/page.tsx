'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { INDIAN_STATES, STEPS, type Lang } from '@/lib/utils';
import { STRUCTURE_QUESTIONS, WATER_QUESTIONS, ENERGY_QUESTIONS, OWNERSHIP_QUESTIONS } from '@/lib/questions';
import {
  validateName, validateState, validateHouseNo, validatePhone,
  validatePositiveInt, validateCheckboxMin, validateRadio,
  formatPhone, formatAadhaar, validateAadhaar,
  type ValidationResult
} from '@/lib/validators';
import Link from 'next/link';

// ── Session ──
function getSessionToken(): string {
  let t = localStorage.getItem('cn27_sess');
  if (!t) {
    t = 'sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    localStorage.setItem('cn27_sess', t);
  }
  return t;
}

// ── Types ──
interface FormData {
  // Location
  state: string; district: string; subDistrict: string;
  village: string; wardNo: string; houseNo: string;
  // Household
  buildingNo: string; censusHouseNo: string; householdNo: string;
  headName: string; headPhone: string;
  householdMembers: number; marriedCouples: number;
  // Building
  structureType: string; structureCondition: string; tenure: string;
  exclusiveRooms: number; totalRooms: number;
  // Water
  drinkingWater: string[]; waterAvailability: string;
  latrine: string; bathroom: string; wasteWater: string;
  // Energy
  lighting: string; kitchen: string;
  cookingFuel: string[]; separateCookingRoom: boolean;
  // Assets
  assets: string[];
  // Ownership
  houseOwnership: string; landOwnership: string;
  hasBankAccount: boolean; hasAadhaar: boolean; aadhaarRef: string;
}

const BLANK: FormData = {
  state: '', district: '', subDistrict: '', village: '', wardNo: '', houseNo: '',
  buildingNo: '', censusHouseNo: '', householdNo: '', headName: '', headPhone: '',
  householdMembers: 1, marriedCouples: 0,
  structureType: '', structureCondition: '', tenure: '',
  exclusiveRooms: 1, totalRooms: 1,
  drinkingWater: [], waterAvailability: '', latrine: '', bathroom: '', wasteWater: '',
  lighting: '', kitchen: '', cookingFuel: [], separateCookingRoom: false,
  assets: [],
  houseOwnership: '', landOwnership: '',
  hasBankAccount: false, hasAadhaar: false, aadhaarRef: '',
};

// ── Sub-components ──
function AshokaChakra({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={size * 0.46} fill="none" stroke="#003F87" strokeWidth={size * 0.03} />
      <circle cx={size / 2} cy={size / 2} r={size * 0.06} fill="#003F87" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * 360) / 24, r = (a * Math.PI) / 180, cx = size / 2;
        return <line key={i} x1={cx + size * 0.06 * Math.cos(r)} y1={cx + size * 0.06 * Math.sin(r)} x2={cx + size * 0.44 * Math.cos(r)} y2={cx + size * 0.44 * Math.sin(r)} stroke="#003F87" strokeWidth={size * 0.012} />;
      })}
    </svg>
  );
}

function RadioGroup({ name, options, value, onChange, lang }: {
  name: string; options: { value: string; en: string; hi: string }[];
  value: string; onChange: (v: string) => void; lang: Lang;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {options.map(o => (
        <div key={o.value} className={`ropt ${value === o.value ? 'on' : ''}`} onClick={() => onChange(o.value)}>
          <div className="rdot"><div className="rdot-in" /></div>
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => {}} className="sr-only" />
          <span className={lang === 'hi' ? 'dv' : ''} style={{ fontSize: 13.5, lineHeight: 1.45 }}>{lang === 'hi' ? o.hi : o.en}</span>
        </div>
      ))}
    </div>
  );
}

function CheckboxGroup({ options, values, onChange, lang }: {
  options: { value: string; en: string; hi: string }[];
  values: string[]; onChange: (v: string[]) => void; lang: Lang;
}) {
  const toggle = (v: string) => {
    const next = values.includes(v) ? values.filter(x => x !== v) : [...values, v];
    onChange(next);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {options.map(o => (
        <div key={o.value} className={`copt ${values.includes(o.value) ? 'on' : ''}`} onClick={() => toggle(o.value)}>
          <div className="cbox"><span className="ccheck">✓</span></div>
          <span className={lang === 'hi' ? 'dv' : ''} style={{ fontSize: 13.5, lineHeight: 1.45 }}>{lang === 'hi' ? o.hi : o.en}</span>
        </div>
      ))}
    </div>
  );
}

function Counter({ value, onChange, min = 0, max = 99, label }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; label?: string;
}) {
  const v = validatePositiveInt(value, min, max, label || 'Value');
  return (
    <div>
      <div className="nstep">
        <button type="button" className="nbtn" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <div className="nval">{value}</div>
        <button type="button" className="nbtn" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
      {!v.valid && <div className="ferr">⚠ {v.message}</div>}
    </div>
  );
}

function FieldError({ err }: { err: string }) {
  if (!err) return null;
  return <div className="ferr">⚠ {err}</div>;
}

function ValidatedInput({ value, onChange, validate, placeholder, type = 'text', className = 'inp', formatFn, disabled }: {
  value: string; onChange: (v: string) => void;
  validate?: (v: string) => ValidationResult;
  placeholder?: string; type?: string; className?: string;
  formatFn?: (v: string) => string; disabled?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  const res = validate ? validate(value) : { valid: true, message: '' };
  const showErr = touched && !res.valid && value.length > 0;
  const showOk = touched && res.valid && value.length > 0;
  return (
    <div>
      <div className="inp-wrap">
        <input
          type={type}
          value={value}
          onChange={e => onChange(formatFn ? formatFn(e.target.value) : e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${className} ${showErr ? 'err' : showOk ? 'ok' : ''}`}
        />
        {showOk && <span className="inp-icon">✅</span>}
        {showErr && <span className="inp-icon">⚠️</span>}
      </div>
      {showErr && <div className="ferr">⚠ {res.message}</div>}
    </div>
  );
}

const ASSET_OPTIONS = [
  { value: 'radio', en: 'Radio / Transistor', hi: 'रेडियो / ट्रांजिस्टर', emoji: '📻' },
  { value: 'tv', en: 'Television', hi: 'टेलीविजन', emoji: '📺' },
  { value: 'internet', en: 'Internet access', hi: 'इंटरनेट', emoji: '🌐' },
  { value: 'computer', en: 'Computer / Laptop / Tablet', hi: 'कंप्यूटर / लैपटॉप / टैबलेट', emoji: '💻' },
  { value: 'landline', en: 'Landline telephone', hi: 'लैंडलाइन फोन', emoji: '☎️' },
  { value: 'mobile', en: 'Mobile phone (any)', hi: 'मोबाइल फोन', emoji: '📱' },
  { value: 'smartphone', en: 'Smartphone', hi: 'स्मार्टफोन', emoji: '📲' },
  { value: 'bicycle', en: 'Bicycle', hi: 'साइकिल', emoji: '🚲' },
  { value: 'two_wheeler', en: 'Two-wheeler (scooter / motorcycle)', hi: 'दोपहिया वाहन', emoji: '🏍️' },
  { value: 'four_wheeler', en: 'Four-wheeler (car / jeep / van)', hi: 'चार पहिया वाहन', emoji: '🚗' },
];

// ── Main component ──
export default function CensusForm() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(BLANK);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' | 'info' } | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const sessRef = useRef('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hi = lang === 'hi';
  const steps = STEPS(lang);

  function showToast(msg: string, type: 'ok' | 'err' | 'info' = 'ok') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Load on mount ──
  useEffect(() => {
    sessRef.current = getSessionToken();
    const savedLang = localStorage.getItem('cn27_lang') as Lang | null;
    if (savedLang) setLang(savedLang);

    async function loadData() {
      // Try local first for instant load
      const localData = localStorage.getItem('cn27_form');
      const localStep = localStorage.getItem('cn27_step');
      if (localData) {
        try {
          setForm(prev => ({ ...prev, ...JSON.parse(localData) }));
          if (localStep) setStep(parseInt(localStep) || 0);
        } catch { /* ignore */ }
      }
      // Then try server to get latest
      try {
        const res = await fetch(`/api/census?sessionToken=${sessRef.current}`);
        const { submission, dbOk } = await res.json();
        if (dbOk && submission) {
          setForm(prev => ({ ...prev, ...submission }));
          setStep(submission.currentStep || 0);
        }
      } catch { /* DB offline — local data is fine */ }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // ── Save ──
  const saveProgress = useCallback(async (data: FormData, s: number) => {
    localStorage.setItem('cn27_form', JSON.stringify(data));
    localStorage.setItem('cn27_step', String(s));
    setSaveStatus('saving');
    try {
      await fetch('/api/census', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: sessRef.current, formData: data, currentStep: s }),
      });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus('idle'), 2500);
  }, []);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveProgress(next, step), 900);
      return next;
    });
    // Clear error for this field
    setStepErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  }

  // ── Step validation ──
  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};

    if (s === 0) {
      const sv = validateState(form.state);
      if (!sv.valid) errs['state'] = sv.message;
      const hv = validateHouseNo(form.houseNo);
      if (!hv.valid) errs['houseNo'] = hv.message;
      if (!form.village.trim()) errs['village'] = hi ? 'गाँव/शहर का नाम आवश्यक है' : 'Village/City is required';
      if (!form.district.trim()) errs['district'] = hi ? 'जिले का नाम आवश्यक है' : 'District is required';
    }
    if (s === 1) {
      const nv = validateName(form.headName);
      if (!nv.valid) errs['headName'] = nv.message;
      const hm = validatePositiveInt(form.householdMembers, 1, 50, 'Household members');
      if (!hm.valid) errs['householdMembers'] = hm.message;
      if (form.headPhone) {
        const pv = validatePhone(form.headPhone);
        if (!pv.valid) errs['headPhone'] = pv.message;
      }
    }
    if (s === 2) {
      const rv = validateRadio(form.structureType, 'Structure type');
      if (!rv.valid) errs['structureType'] = hi ? 'घर का प्रकार चुनें' : rv.message;
      const cv = validateRadio(form.structureCondition, 'Structure condition');
      if (!cv.valid) errs['structureCondition'] = hi ? 'संरचना की स्थिति चुनें' : cv.message;
      const tv = validateRadio(form.tenure, 'Tenure');
      if (!tv.valid) errs['tenure'] = hi ? 'अधिभोग प्रकार चुनें' : tv.message;
    }
    if (s === 3) {
      const dv = validateCheckboxMin(form.drinkingWater);
      if (!dv.valid) errs['drinkingWater'] = hi ? 'कम से कम एक जल स्रोत चुनें' : 'Select at least one water source';
      if (!form.waterAvailability) errs['waterAvailability'] = hi ? 'जल स्थान चुनें' : 'Select water location';
      if (!form.latrine) errs['latrine'] = hi ? 'शौचालय प्रकार चुनें' : 'Select latrine type';
      if (!form.bathroom) errs['bathroom'] = hi ? 'स्नानघर विकल्प चुनें' : 'Select bathroom option';
      if (!form.wasteWater) errs['wasteWater'] = hi ? 'अपशिष्ट जल विकल्प चुनें' : 'Select waste water option';
    }
    if (s === 4) {
      if (!form.lighting) errs['lighting'] = hi ? 'प्रकाश स्रोत चुनें' : 'Select lighting source';
      if (!form.kitchen) errs['kitchen'] = hi ? 'रसोई विकल्प चुनें' : 'Select kitchen option';
      const fv = validateCheckboxMin(form.cookingFuel);
      if (!fv.valid) errs['cookingFuel'] = hi ? 'कम से कम एक ईंधन चुनें' : 'Select at least one cooking fuel';
    }
    if (s === 6) {
      if (!form.houseOwnership) errs['houseOwnership'] = hi ? 'घर स्वामित्व चुनें' : 'Select house ownership';
      if (!form.landOwnership) errs['landOwnership'] = hi ? 'भूमि स्वामित्व चुनें' : 'Select land ownership';
      if (form.hasAadhaar && form.aadhaarRef) {
        const av = validateAadhaar(form.aadhaarRef);
        if (!av.valid) errs['aadhaarRef'] = av.message;
      }
    }

    setStepErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleNext() {
    if (!validateStep(step)) {
      showToast(hi ? 'कृपया सभी आवश्यक प्रश्नों का उत्तर दें' : 'Please answer all required questions', 'err');
      return;
    }
    const next = step + 1;
    await saveProgress(form, next);
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    if (!validateStep(step)) {
      showToast(hi ? 'कृपया सभी प्रश्नों का उत्तर दें' : 'Please complete all required fields', 'err');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: sessRef.current, formData: form }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem('cn27_form');
        localStorage.removeItem('cn27_step');
        router.push(`/success?id=${encodeURIComponent(data.submissionId)}&state=${encodeURIComponent(form.state)}`);
      } else {
        showToast(data.error || 'Submission failed. Please try again.', 'err');
      }
    } catch {
      showToast(hi ? 'नेटवर्क त्रुटि। पुनः प्रयास करें।' : 'Network error. Please try again.', 'err');
    } finally {
      setIsSubmitting(false);
    }
  }

  const progress = Math.round((step / steps.length) * 100);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: 14 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" className="cspin2">
          <circle cx={20} cy={20} r={18} fill="none" stroke="var(--saffron)" strokeWidth={3} />
          <circle cx={20} cy={20} r={18} fill="none" stroke="var(--bg)" strokeWidth={3} strokeDasharray="28 85" />
        </svg>
        <p className={hi ? 'dv' : ''} style={{ fontSize: 14, color: 'var(--t3)' }}>{hi ? 'लोड हो रहा है...' : 'Loading your progress...'}</p>
      </div>
    );
  }

  // ── Field sections per step ──
  const renderStep = () => {
    switch (step) {
      // ── Step 0: Location ──
      case 0: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className={`flabel req ${hi ? 'dv' : ''}`}>{hi ? 'राज्य / केंद्र शासित प्रदेश' : 'State / Union Territory'}</label>
            <div className="inp-wrap">
              <select className={`inp ${stepErrors.state ? 'err' : ''}`} value={form.state}
                onChange={e => update('state', e.target.value)}>
                <option value="">{hi ? '-- राज्य चुनें --' : '-- Select State --'}</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <FieldError err={stepErrors.state || ''} />
          </div>
          <div>
            <label className={`flabel req ${hi ? 'dv' : ''}`}>{hi ? 'जिला' : 'District'}</label>
            <ValidatedInput value={form.district} onChange={v => update('district', v)}
              validate={v => v.trim() ? { valid: true, message: '' } : { valid: false, message: 'District is required' }}
              placeholder={hi ? 'जिले का नाम' : 'Enter district name'} />
            <FieldError err={stepErrors.district || ''} />
          </div>
          <div>
            <label className={`flabel ${hi ? 'dv' : ''}`}>{hi ? 'उप-जिला / तहसील' : 'Sub-District / Tehsil'}</label>
            <input className="inp" placeholder={hi ? 'उप-जिला / तहसील' : 'Sub-district or Tehsil'} value={form.subDistrict} onChange={e => update('subDistrict', e.target.value)} />
          </div>
          <div>
            <label className={`flabel req ${hi ? 'dv' : ''}`}>{hi ? 'गाँव / कस्बा / शहर' : 'Village / Town / City'}</label>
            <input className={`inp ${stepErrors.village ? 'err' : ''}`} placeholder={hi ? 'गाँव या शहर का नाम' : 'Village or city name'} value={form.village} onChange={e => update('village', e.target.value)} />
            <FieldError err={stepErrors.village || ''} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className={`flabel ${hi ? 'dv' : ''}`}>{hi ? 'वार्ड / मोहल्ला' : 'Ward / Locality'}</label>
              <input className="inp" placeholder={hi ? 'वार्ड नं.' : 'Ward No.'} value={form.wardNo} onChange={e => update('wardNo', e.target.value)} />
            </div>
            <div>
              <label className={`flabel req ${hi ? 'dv' : ''}`}>{hi ? 'घर / द्वार नंबर' : 'House / Door No.'}</label>
              <ValidatedInput value={form.houseNo} onChange={v => update('houseNo', v)}
                validate={validateHouseNo} placeholder={hi ? 'घर नंबर' : 'House No.'} />
              <FieldError err={stepErrors.houseNo || ''} />
            </div>
          </div>
        </div>
      );

      // ── Step 1: Household ──
      case 1: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label className="flabel">{hi ? 'Q1. भवन संख्या' : 'Q1. Building No.'}</label>
              <input className="inp" placeholder="e.g. 42" value={form.buildingNo} onChange={e => update('buildingNo', e.target.value)} />
            </div>
            <div>
              <label className="flabel">{hi ? 'Q2. जनगणना घर नं.' : 'Q2. Census House No.'}</label>
              <input className="inp" placeholder="e.g. 15" value={form.censusHouseNo} onChange={e => update('censusHouseNo', e.target.value)} />
            </div>
            <div>
              <label className="flabel">{hi ? 'Q3. परिवार क्रम नं.' : 'Q3. Household Serial No.'}</label>
              <input className="inp" placeholder="e.g. 3" value={form.householdNo} onChange={e => update('householdNo', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={`flabel req ${hi ? 'dv' : ''}`}>{hi ? 'Q4. परिवार के मुखिया का नाम' : 'Q4. Name of Head of Household'}</label>
            <ValidatedInput value={form.headName} onChange={v => update('headName', v)}
              validate={validateName} placeholder={hi ? 'पूरा नाम' : 'Full name'} />
            <FieldError err={stepErrors.headName || ''} />
          </div>

          <div>
            <label className={`flabel ${hi ? 'dv' : ''}`}>{hi ? 'मुखिया का मोबाइल नंबर (वैकल्पिक)' : 'Head\'s Mobile Number (optional)'}</label>
            <ValidatedInput value={form.headPhone} onChange={v => update('headPhone', v)}
              validate={validatePhone} formatFn={formatPhone}
              placeholder={hi ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'} type="tel" />
            <FieldError err={stepErrors.headPhone || ''} />
            <div className="fhint">{hi ? 'केवल सत्यापन के लिए — गोपनीय' : 'For verification only — strictly confidential'}</div>
          </div>

          <div className="sdiv">{hi ? 'परिवार की गणना' : 'Household Count'}</div>

          <div>
            <label className={`flabel req ${hi ? 'dv' : ''}`}>
              {hi ? 'Q5. परिवार के कुल सदस्य' : 'Q5. Total Household Members'}
            </label>
            <Counter value={form.householdMembers} onChange={v => update('householdMembers', v)} min={1} max={50} label="Household members" />
            <FieldError err={stepErrors.householdMembers || ''} />
          </div>

          <div>
            <label className={`flabel ${hi ? 'dv' : ''}`}>{hi ? 'Q10. विवाहित जोड़ों की संख्या' : 'Q10. Number of married couples in the household'}</label>
            <Counter value={form.marriedCouples} onChange={v => update('marriedCouples', v)} min={0} max={20} label="Married couples" />
          </div>
        </div>
      );

      // ── Step 2: Building ──
      case 2: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {STRUCTURE_QUESTIONS.map(q => (
            <div key={q.key}>
              <div className="qnum">Q — {hi ? 'एकल चयन' : 'single choice'}</div>
              <div className={`qtxt ${hi ? 'dv' : ''}`}>{hi ? q.hi : q.en}</div>
              <RadioGroup name={q.key} options={q.options!} value={(form as unknown as Record<string, string>)[q.key]} onChange={v => update(q.key as keyof FormData, v as never)} lang={lang} />
              <FieldError err={stepErrors[q.key] || ''} />
            </div>
          ))}

          <div className="sdiv">{hi ? 'कमरे' : 'Rooms'}</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label className={`flabel req ${hi ? 'dv' : ''}`}>{hi ? 'Q9. विशेष उपयोग के कमरे' : 'Q9. Rooms for exclusive use'}</label>
              <Counter value={form.exclusiveRooms} onChange={v => update('exclusiveRooms', v)} min={0} max={50} label="Rooms" />
            </div>
            <div>
              <label className={`flabel req ${hi ? 'dv' : ''}`}>{hi ? 'Q29. कुल कमरे' : 'Q29. Total rooms'}</label>
              <Counter value={form.totalRooms} onChange={v => update('totalRooms', v)} min={1} max={100} label="Total rooms" />
            </div>
          </div>
        </div>
      );

      // ── Step 3: Water & Sanitation ──
      case 3: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {WATER_QUESTIONS.map(q => (
            <div key={q.key}>
              <div className="qnum">{q.type === 'checkbox' ? (hi ? 'बहु चयन' : 'multi-select') : (hi ? 'एकल चयन' : 'single choice')}</div>
              <div className={`qtxt ${hi ? 'dv' : ''}`}>{hi ? q.hi : q.en}</div>
              {q.hint_en && (
                <div className={`qhint ${hi ? 'dv' : ''}`}>{hi ? q.hint_hi : q.hint_en}</div>
              )}
              {q.type === 'checkbox' ? (
                <CheckboxGroup options={q.options!} values={(form as unknown as Record<string, string[]>)[q.key]} onChange={v => update(q.key as keyof FormData, v as never)} lang={lang} />
              ) : (
                <RadioGroup name={q.key} options={q.options!} value={(form as unknown as Record<string, string>)[q.key]} onChange={v => update(q.key as keyof FormData, v as never)} lang={lang} />
              )}
              <FieldError err={stepErrors[q.key] || ''} />
            </div>
          ))}
        </div>
      );

      // ── Step 4: Energy & Kitchen ──
      case 4: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {ENERGY_QUESTIONS.map(q => (
            <div key={q.key}>
              <div className="qnum">{q.type === 'checkbox' ? (hi ? 'बहु चयन' : 'multi-select') : (hi ? 'एकल चयन' : 'single choice')}</div>
              <div className={`qtxt ${hi ? 'dv' : ''}`}>{hi ? q.hi : q.en}</div>
              {q.hint_en && <div className={`qhint ${hi ? 'dv' : ''}`}>{hi ? q.hint_hi : q.hint_en}</div>}
              {q.type === 'checkbox' ? (
                <CheckboxGroup options={q.options!} values={(form as unknown as Record<string, string[]>)[q.key]} onChange={v => update(q.key as keyof FormData, v as never)} lang={lang} />
              ) : (
                <RadioGroup name={q.key} options={q.options!} value={(form as unknown as Record<string, string>)[q.key]} onChange={v => update(q.key as keyof FormData, v as never)} lang={lang} />
              )}
              <FieldError err={stepErrors[q.key] || ''} />
            </div>
          ))}

          <div>
            <div className="qnum">{hi ? 'एकल चयन' : 'single choice'}</div>
            <div className={`qtxt ${hi ? 'dv' : ''}`}>{hi ? 'Q28. क्या खाना पकाने के लिए अलग कमरे का उपयोग होता है?' : 'Q28. Is there a separate room used for cooking?'}</div>
            <RadioGroup name="separateCookingRoom"
              options={[{ value: 'yes', en: 'Yes', hi: 'हाँ' }, { value: 'no', en: 'No', hi: 'नहीं' }]}
              value={form.separateCookingRoom ? 'yes' : 'no'}
              onChange={v => update('separateCookingRoom', v === 'yes')} lang={lang} />
          </div>
        </div>
      );

      // ── Step 5: Assets ──
      case 5: return (
        <div>
          <div className="qnum">{hi ? 'बहु चयन — Q19–Q27' : 'multi-select — Q19–Q27'}</div>
          <div className={`qtxt ${hi ? 'dv' : ''}`}>
            {hi ? 'परिवार के पास उपलब्ध संपत्तियाँ और उपकरण — सभी चुनें जो लागू हों:' : 'Assets and devices available to the household — select all that apply:'}
          </div>
          <div className="qhint" style={{ marginBottom: 14 }}>
            {hi ? 'कोई भी नहीं होने पर खाली छोड़ें' : 'Leave empty if none of these apply'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 8 }}>
            {ASSET_OPTIONS.map(a => (
              <div key={a.value} className={`copt ${form.assets.includes(a.value) ? 'on' : ''}`}
                onClick={() => {
                  const next = form.assets.includes(a.value)
                    ? form.assets.filter(x => x !== a.value)
                    : [...form.assets, a.value];
                  update('assets', next);
                }}>
                <div className="cbox"><span className="ccheck">✓</span></div>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{a.emoji}</span>
                <span className={hi ? 'dv' : ''} style={{ fontSize: 13 }}>{hi ? a.hi : a.en}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--s2)', borderRadius: 8, fontSize: 12, color: 'var(--t3)' }}>
            {hi ? `${form.assets.length} संपत्ति चुनी गई` : `${form.assets.length} asset${form.assets.length !== 1 ? 's' : ''} selected`}
          </div>
        </div>
      );

      // ── Step 6: Ownership & Banking ──
      case 6: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {OWNERSHIP_QUESTIONS.map(q => (
            <div key={q.key}>
              <div className="qnum">{hi ? 'एकल चयन' : 'single choice'}</div>
              <div className={`qtxt ${hi ? 'dv' : ''}`}>{hi ? q.hi : q.en}</div>
              <RadioGroup name={q.key} options={q.options!} value={(form as unknown as Record<string, string>)[q.key]} onChange={v => update(q.key as keyof FormData, v as never)} lang={lang} />
              <FieldError err={stepErrors[q.key] || ''} />
            </div>
          ))}

          <div className="sdiv">{hi ? 'बैंकिंग एवं आधार' : 'Banking & Aadhaar'}</div>

          <div>
            <div className={`qtxt ${hi ? 'dv' : ''}`} style={{ marginBottom: 10 }}>
              {hi ? 'Q32. क्या परिवार के किसी सदस्य का बैंक / डाकघर बचत खाता है?' : 'Q32. Does any household member have a bank or post office savings account?'}
            </div>
            <RadioGroup name="hasBankAccount"
              options={[{ value: 'yes', en: 'Yes', hi: 'हाँ' }, { value: 'no', en: 'No', hi: 'नहीं' }]}
              value={form.hasBankAccount ? 'yes' : 'no'}
              onChange={v => update('hasBankAccount', v === 'yes')} lang={lang} />
          </div>

          <div>
            <div className={`qtxt ${hi ? 'dv' : ''}`} style={{ marginBottom: 10 }}>
              {hi ? 'Q33. क्या परिवार के किसी सदस्य के पास आधार संख्या है?' : 'Q33. Does any household member have an Aadhaar number?'}
            </div>
            <RadioGroup name="hasAadhaar"
              options={[{ value: 'yes', en: 'Yes', hi: 'हाँ' }, { value: 'no', en: 'No', hi: 'नहीं' }]}
              value={form.hasAadhaar ? 'yes' : 'no'}
              onChange={v => update('hasAadhaar', v === 'yes')} lang={lang} />
            {form.hasAadhaar && (
              <div style={{ marginTop: 12 }}>
                <label className={`flabel ${hi ? 'dv' : ''}`}>
                  {hi ? 'आधार संख्या (सत्यापन के लिए — वैकल्पिक)' : 'Aadhaar Number (for verification — optional)'}
                </label>
                <ValidatedInput value={form.aadhaarRef} onChange={v => update('aadhaarRef', v)}
                  validate={validateAadhaar} formatFn={formatAadhaar}
                  placeholder="XXXX XXXX XXXX" type="tel" />
                <div className="fhint">{hi ? 'केवल सांख्यिकीय उद्देश्यों के लिए — जनगणना अधिनियम 1948 के तहत संरक्षित' : 'For statistical purposes only — protected under Census Act 1948'}</div>
                <FieldError err={stepErrors.aadhaarRef || ''} />
              </div>
            )}
          </div>

          {/* Review box */}
          <div style={{ background: 'var(--green-bg)', border: '1px solid var(--green-bd)', borderRadius: 10, padding: '14px 16px', marginTop: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--green)', marginBottom: 10 }}>
              {hi ? '✓ फॉर्म समीक्षा' : '✓ Form Review'}
            </div>
            <table className="vtable">
              <tbody>
                {[
                  [hi ? 'राज्य' : 'State', form.state || '—'],
                  [hi ? 'जिला' : 'District', form.district || '—'],
                  [hi ? 'गाँव/शहर' : 'Village/City', form.village || '—'],
                  [hi ? 'मुखिया' : 'Head', form.headName || '—'],
                  [hi ? 'सदस्य' : 'Members', String(form.householdMembers)],
                  [hi ? 'संरचना' : 'Structure', form.structureType || '—'],
                  [hi ? 'प्रकाश' : 'Lighting', form.lighting || '—'],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td style={{ color: 'var(--t1)', fontWeight: 500 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="tribar" />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--bd)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AshokaChakra size={30} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 12.5, color: 'var(--navy)', lineHeight: 1.2 }}>Census of India 2027</div>
                <div className="dv" style={{ fontSize: 10, color: 'var(--saffron)', lineHeight: 1.2 }}>भारत की जनगणना</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Save indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: saveStatus === 'saved' ? 'var(--green)' : saveStatus === 'error' ? '#EF4444' : 'var(--t4)' }}>
                {saveStatus === 'saving' && <><div className="sdot sdot-s" /><span>Saving…</span></>}
                {saveStatus === 'saved' && <><div className="sdot sdot-ok" /><span>{hi ? 'सहेजा' : 'Saved'}</span></>}
                {saveStatus === 'error' && <span>⚠ Offline — local</span>}
              </div>
              <button onClick={() => { setLang(hi ? 'en' : 'hi'); localStorage.setItem('cn27_lang', hi ? 'en' : 'hi'); }}
                style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20, border: '1.5px solid var(--saffron-bd)', background: 'var(--saffron-bg)', color: 'var(--saffron)', cursor: 'pointer' }}>
                {hi ? 'English' : 'हिंदी'}
              </button>
            </div>
          </div>
          {/* Progress */}
          <div className="pbar" style={{ marginBottom: 0 }}>
            <div className="pfill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 60px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/" className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}>← Back</Link>
          </div>
        {/* Sidebar */}
        <aside style={{ display: 'none' }} className="sidebar-hide">
          <div className="card" style={{ padding: '12px 10px', position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--t4)', padding: '4px 11px 10px' }}>
              {hi ? 'चरण' : 'SECTIONS'}
            </div>
            {steps.map((s, i) => (
              <div key={s.id} className={`step-li ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
                onClick={() => i < step && setStep(i)}>
                <div className="step-n">{i < step ? '✓' : i + 1}</div>
                <div className="step-con">
                  <div className={`${hi ? 'dv' : ''}`} style={{ fontSize: 12, fontWeight: 600, color: i === step ? 'var(--saffron)' : i < step ? 'var(--green)' : 'var(--t2)', lineHeight: 1.3 }}>{s.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--t4)', lineHeight: 1.3, marginTop: 1 }}>{s.hint}</div>
                </div>
              </div>
            ))}
            <div style={{ margin: '12px 10px 4px', padding: '10px', background: 'var(--s2)', borderRadius: 8, fontSize: 11 }}>
              <div style={{ color: 'var(--t4)', marginBottom: 4 }}>{hi ? 'प्रगति' : 'Progress'}</div>
              <div style={{ fontWeight: 700, color: 'var(--saffron)', fontSize: 18 }}>{progress}%</div>
              <div className="pbar" style={{ marginTop: 6 }}>
                <div className="pfill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </aside>

        {/* Main form */}
        <div style={{ gridColumn: '1 / -1' }}>
          {/* Mobile step pills */}
          <div style={{ overflowX: 'auto', marginBottom: 14, scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', gap: 6, minWidth: 'max-content', padding: '2px 0' }}>
              {steps.map((s, i) => (
                <button key={s.id} onClick={() => i < step && setStep(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 20,
                    fontSize: 12, fontWeight: 600, cursor: i < step ? 'pointer' : 'default',
                    background: i === step ? 'var(--saffron)' : i < step ? 'var(--green-bg)' : 'var(--surface)',
                    color: i === step ? 'white' : i < step ? 'var(--green)' : 'var(--t3)',
                    border: i === step ? 'none' : i < step ? '1px solid var(--green-bd)' : '1px solid var(--bd)',
                    whiteSpace: 'nowrap',
                    fontFamily: hi ? 'Noto Sans Devanagari, sans-serif' : 'inherit',
                  }}>
                  <span>{i < step ? '✓' : s.icon}</span>
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step card */}
          <div className="card2" style={{ padding: '28px 24px' }}>
            {/* Step header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid var(--bd)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--saffron-bg)', border: '2px solid var(--saffron-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {steps[step]?.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div className={`${hi ? 'dv' : ''}`} style={{ fontWeight: 800, fontSize: 18, color: 'var(--navy)', lineHeight: 1.2 }}>{steps[step]?.title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--t4)', marginTop: 2 }}>
                  {hi ? `चरण ${step + 1} / ${steps.length}` : `Section ${step + 1} of ${steps.length}`} · {steps[step]?.hint}
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 22, color: progress > 0 ? 'var(--saffron)' : 'var(--t4)' }}>{progress}%</div>
            </div>

            {/* Fields */}
            <div className="asc">{renderStep()}</div>

            {/* Nav buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--bd)', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={handleBack} disabled={step === 0} className="btn btn-ghost" style={{ opacity: step === 0 ? 0.35 : 1 }}>
                ← {hi ? 'पिछला' : 'Back'}
              </button>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--t4)' }}>{step + 1}/{steps.length}</span>
                {step < steps.length - 1 ? (
                  <button onClick={handleNext} className="btn btn-o">
                    {hi ? 'आगे' : 'Next'} →
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-g" style={{ minWidth: 120 }}>
                    {isSubmitting ? (
                      <><svg width="14" height="14" viewBox="0 0 14 14" className="spinner" style={{ marginRight: 4 }}>
                        <circle cx="7" cy="7" r="5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                        <circle cx="7" cy="7" r="5" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 24" />
                      </svg>{hi ? 'जमा हो रहा है…' : 'Submitting…'}</>
                    ) : (hi ? '✓ फॉर्म जमा करें' : '✓ Submit Form')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type === 'ok' ? 'ok' : toast.type === 'err' ? 'err' : 'info'}`}>
          <span>{toast.type === 'ok' ? '✅' : toast.type === 'err' ? '⚠️' : 'ℹ️'}</span>
          <span className={hi ? 'dv' : ''} style={{ fontSize: 13 }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
