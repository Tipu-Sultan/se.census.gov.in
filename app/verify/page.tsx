'use client';
import { useState } from 'react';
import Link from 'next/link';
import { isValidSubmissionId } from '@/lib/utils';

function AshokaChakra({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={size*0.46} fill="none" stroke="#003F87" strokeWidth={size*0.03}/>
      <circle cx={size/2} cy={size/2} r={size*0.06} fill="#003F87"/>
      {Array.from({length:24},(_,i)=>{const a=(i*360)/24,r=(a*Math.PI)/180,cx=size/2;return<line key={i} x1={cx+size*0.06*Math.cos(r)} y1={cx+size*0.06*Math.sin(r)} x2={cx+size*0.44*Math.cos(r)} y2={cx+size*0.44*Math.sin(r)} stroke="#003F87" strokeWidth={size*0.012}/>})}
    </svg>
  );
}

interface VerifyRecord {
  submissionId: string;
  state: string;
  district: string;
  subDistrict: string;
  village: string;
  headName: string;
  householdMembers: number;
  houseNo: string;
  buildingNo: string;
  structureType: string;
  submittedAt: string;
  status: string;
}

export default function VerifyPage() {
  const [inputId, setInputId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyRecord | null>(null);
  const [error, setError] = useState('');
  const [formatErr, setFormatErr] = useState('');

  function handleInput(val: string) {
  // साफ input (only A-Z and 0-9)
  let raw = val.toUpperCase().replace(/[^A-Z0-9]/g, '');

  let v = '';

  if (raw.length <= 2) {
    v = raw;
  } else if (raw.length <= 6) {
    v = raw.slice(0, 2) + '-' + raw.slice(2);
  } else if (raw.length <= 8) {
    v = raw.slice(0, 2) + '-' + raw.slice(2, 6) + '-' + raw.slice(6);
  } else {
    v =
      raw.slice(0, 2) +
      '-' +
      raw.slice(2, 6) +
      '-' +
      raw.slice(6, 8) +
      '-' +
      raw.slice(8, 14);
  }

  setInputId(v);
  setResult(null);
  setError('');
  setFormatErr('');
  }

  async function handleVerify() {
    const id = inputId.trim().toUpperCase();
    if (!id) { setFormatErr('Please enter a Submission ID'); return; }
    if (!isValidSubmissionId(id)) {
      setFormatErr('Invalid format. Expected: XX-2027-P1-XXXXXX  (e.g. UP-2027-P1-X4K9M2)');
      return;
    }
    setFormatErr('');
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await fetch(`/api/verify?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.found) {
        setResult(data.record);
      } else {
        setError(data.error || 'No submitted record found with this ID.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const FIELDS: { key: keyof VerifyRecord; label: string; hi: string }[] = [
    { key: 'submissionId', label: 'Submission ID', hi: 'पहचान संख्या' },
    { key: 'state', label: 'State', hi: 'राज्य' },
    { key: 'district', label: 'District', hi: 'जिला' },
    { key: 'subDistrict', label: 'Sub-District', hi: 'उप-जिला' },
    { key: 'village', label: 'Village / City', hi: 'गाँव / शहर' },
    { key: 'houseNo', label: 'House No.', hi: 'घर नंबर' },
    { key: 'buildingNo', label: 'Building No.', hi: 'भवन संख्या' },
    { key: 'headName', label: 'Head of Household', hi: 'परिवार मुखिया' },
    { key: 'householdMembers', label: 'Household Members', hi: 'परिवार सदस्य' },
    { key: 'structureType', label: 'Structure Type', hi: 'संरचना प्रकार' },
    { key: 'submittedAt', label: 'Submitted At', hi: 'जमा समय' },
    { key: 'status', label: 'Status', hi: 'स्थिति' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="tribar" />

      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid var(--bd)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AshokaChakra size={30} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--navy)' }}>Census of India 2027</div>
              <div className="dv" style={{ fontSize: 10, color: 'var(--saffron)' }}>भारत की जनगणना</div>
            </div>
          </div>
          <Link href="/" className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }}>← Home</Link>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '36px 20px 60px' }}>

        {/* Page title */}
        <div className="afup" style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#EFF6FF', border: '2px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px' }}>🔍</div>
          <div className="badge badge-blue" style={{ marginBottom: 10 }}>OFFICER PORTAL</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>Verify Self-Enumeration</h1>
          <p className="dv" style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 4 }}>स्व-गणना सत्यापन</p>
          <p style={{ fontSize: 13, color: 'var(--t3)', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
            Enter the Submission ID provided by the household head to verify their digital self-enumeration record.
          </p>
        </div>

        {/* Search card */}
        <div className="card2 afup" style={{ padding: '28px 24px', marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--t3)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 8 }}>
            Submission ID / पहचान संख्या
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <input
                value={inputId}
                onChange={e => handleInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                placeholder="UP-2027-P1-X4K9M2"
                maxLength={17}
                style={{
                  display: 'block', width: '100%',
                  padding: '12px 16px',
                  fontFamily: 'Courier New, monospace',
                  fontSize: 17, fontWeight: 700,
                  letterSpacing: '.1em', textTransform: 'uppercase',
                  border: `2px solid ${formatErr ? '#EF4444' : inputId && isValidSubmissionId(inputId) ? 'var(--green)' : 'var(--bd)'}`,
                  borderRadius: 10, outline: 'none',
                  background: 'var(--s2)',
                  color: 'var(--chakra)',
                  transition: 'border-color .15s',
                }}
                spellCheck={false}
                autoComplete="off"
              />
              {inputId && isValidSubmissionId(inputId) && (
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>✅</span>
              )}
            </div>
            <button onClick={handleVerify} disabled={loading} className="btn btn-blue" style={{ padding: '12px 24px', fontSize: 14 }}>
              {loading ? (
                <svg width="16" height="16" viewBox="0 0 16 16" className="spinner">
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5"/>
                  <circle cx="8" cy="8" r="6" fill="none" stroke="white" strokeWidth="2.5" strokeDasharray="10 28"/>
                </svg>
              ) : '🔍'} {loading ? 'Verifying…' : 'Verify'}
            </button>
          </div>

          {formatErr && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 5 }}>
              ⚠️ {formatErr}
            </div>
          )}

          
        </div>

        {/* Error */}
        {error && (
          <div className="asc" style={{ padding: '16px 18px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>❌</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#991B1B', marginBottom: 3 }}>Record Not Found</div>
              <div style={{ fontSize: 12.5, color: '#DC2626', lineHeight: 1.5 }}>{error}</div>
              <div className="dv" style={{ fontSize: 12, color: '#DC2626', marginTop: 4, opacity: 0.8 }}>रिकॉर्ड नहीं मिला। पहचान संख्या जांचें।</div>
            </div>
          </div>
        )}

        {/* Success result */}
        {result && (
          <div className="card2 asc" style={{ overflow: 'hidden' }}>
            {/* Green header */}
            <div style={{ background: 'linear-gradient(135deg, #0F9A0F, var(--green))', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✅</div>
              <div style={{ color: 'white', flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>Verified — Self-Enumeration Confirmed</div>
                <div className="dv" style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>स्व-गणना सत्यापित हुई</div>
              </div>
              <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontSize: 11 }}>
                SUBMITTED
              </div>
            </div>

            {/* Submission ID highlight */}
            <div style={{ padding: '16px 22px', background: 'var(--s2)', borderBottom: '1px solid var(--bd)', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 6 }}>Submission ID</div>
              <div className="id-badge">{result.submissionId}</div>
            </div>

            {/* Details table */}
            <div style={{ padding: '0 22px 22px' }}>
              <table className="vtable" style={{ marginTop: 16 }}>
                <tbody>
                  {FIELDS.map(f => {
                    let val = String(result[f.key] ?? '—');
                    if (f.key === 'submittedAt' && val !== '—') {
                      try { val = new Date(val).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }); } catch { /* */ }
                    }
                    if (f.key === 'status') val = val.toUpperCase();
                    return (
                      <tr key={f.key}>
                        <td>
                          <span>{f.label}</span>
                          <span className="dv" style={{ display: 'block', fontSize: 10, color: 'var(--t4)', lineHeight: 1 }}>{f.hi}</span>
                        </td>
                        <td style={{ color: f.key === 'status' ? 'var(--green)' : f.key === 'submissionId' ? 'var(--chakra)' : 'var(--t1)', fontWeight: f.key === 'headName' || f.key === 'submissionId' ? 700 : 500, fontFamily: f.key === 'submissionId' ? 'Courier New, monospace' : 'inherit' }}>
                          {val || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Officer action note */}
            <div style={{ margin: '0 22px 22px', padding: '12px 14px', background: 'var(--saffron-bg)', border: '1px solid var(--saffron-bd)', borderRadius: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--saffron)', marginBottom: 5 }}>📋 Officer Note</div>
              <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>
                This household has completed digital self-enumeration. Cross-check the <strong>Head&apos;s name</strong>, <strong>House No.</strong>, and <strong>Village</strong> with your physical records. Mark as verified in your enumeration register.
              </p>
              <p className="dv" style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4 }}>
                परिवार मुखिया का नाम, घर नंबर और गाँव अपने रजिस्टर से मिलाएं।
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
