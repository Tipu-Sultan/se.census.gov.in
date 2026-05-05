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

        {/* Result card */}
        {result && (() => {
          const isSubmitted = result.status === 'submitted';
          const isDraft     = result.status === 'draft';

          // Colour tokens based on status
          const headerBg   = isSubmitted
            ? 'linear-gradient(135deg, #0F9A0F, var(--green))'
            : isDraft
              ? 'linear-gradient(135deg, #B45309, #92400E)'   // amber/orange for draft
              : 'linear-gradient(135deg, #DC2626, #991B1B)';  // red for unknown/invalid

          const statusIcon        = isSubmitted ? '✅' : isDraft ? '⏳' : '❌';
          const statusHeading     = isSubmitted
            ? 'Verified — Self-Enumeration Confirmed'
            : isDraft
              ? 'Incomplete — Draft Not Yet Submitted'
              : 'Unknown Status';
          const statusSubHeading  = isSubmitted
            ? 'स्व-गणना सत्यापित हुई'
            : isDraft
              ? 'अधूरा — फॉर्म अभी जमा नहीं हुआ'
              : 'अज्ञात स्थिति';

          const statusBadgeBg = isSubmitted ? '#16A34A' : isDraft ? '#D97706' : '#DC2626';

          const statusCellColor = isSubmitted
            ? 'var(--green)'
            : isDraft
              ? '#B45309'
              : '#DC2626';

          // Officer note content changes by status
          const noteIcon    = isSubmitted ? '📋' : isDraft ? '⚠️' : '🚫';
          const noteBg      = isSubmitted ? 'var(--saffron-bg)'  : isDraft ? '#FFFBEB' : '#FEF2F2';
          const noteBorder  = isSubmitted ? 'var(--saffron-bd)'  : isDraft ? '#FCD34D' : '#FECACA';
          const noteTitleColor = isSubmitted ? 'var(--saffron)' : isDraft ? '#B45309' : '#DC2626';
          const noteTitle   = isSubmitted ? 'Officer Note' : isDraft ? 'Action Required' : 'Alert';
          const noteBody    = isSubmitted
            ? <>Cross-check the <strong>Head&apos;s name</strong>, <strong>House No.</strong>, and <strong>Village</strong> with your physical records. Mark as verified in your enumeration register.</>
            : isDraft
              ? <>This household has started but <strong>not yet submitted</strong> their census form. Please ask the head of household to complete and submit the form, or assist them in doing so.</>
              : <>This record has an unrecognised status. Please contact your supervisor or the census helpdesk.</>;
          const noteHi = isSubmitted
            ? 'परिवार मुखिया का नाम, घर नंबर और गाँव अपने रजिस्टर से मिलाएं।'
            : isDraft
              ? 'परिवार ने फॉर्म शुरू किया है लेकिन अभी जमा नहीं किया। उन्हें फॉर्म पूरा करने में सहायता करें।'
              : 'अज्ञात स्थिति — अपने पर्यवेक्षक से संपर्क करें।';

          return (
            <div className="card2 asc" style={{ overflow: 'hidden', marginBottom: 16 }}>

              {/* ── Status header ── */}
              <div style={{ background: headerBg, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {statusIcon}
                </div>
                <div style={{ color: 'white', flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.3 }}>{statusHeading}</div>
                  <div className="dv" style={{ fontSize: 12, opacity: 0.82, marginTop: 3 }}>{statusSubHeading}</div>
                </div>
                {/* Status pill */}
                <div style={{
                  flexShrink: 0,
                  padding: '4px 10px', borderRadius: 20,
                  background: statusBadgeBg,
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  fontSize: 11, fontWeight: 800, letterSpacing: '.06em',
                  color: 'white',
                }}>
                  {result.status.toUpperCase()}
                </div>
              </div>

              {/* ── Submission ID strip ── */}
              <div style={{ padding: '14px 22px', background: 'var(--s2)', borderBottom: '1px solid var(--bd)', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--t4)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 7 }}>
                  Submission ID / पहचान संख्या
                </div>
                <div className="id-badge">{result.submissionId}</div>
              </div>

              {/* ── Details table ── */}
              <div style={{ padding: '4px 22px 22px' }}>
                <table className="vtable" style={{ marginTop: 14 }}>
                  <tbody>
                    {FIELDS.map(f => {
                      let val = String(result[f.key] ?? '—');
                      if (f.key === 'submittedAt' && val !== '—') {
                        try { val = new Date(val).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }); } catch { /* */ }
                      }
                      const isStatusRow = f.key === 'status';
                      const isIdRow     = f.key === 'submissionId';
                      const isNameRow   = f.key === 'headName';
                      return (
                        <tr key={f.key}>
                          <td>
                            <span>{f.label}</span>
                            <span className="dv" style={{ display: 'block', fontSize: 10, color: 'var(--t4)', lineHeight: 1.1, marginTop: 1 }}>{f.hi}</span>
                          </td>
                          <td style={{
                            color     : isStatusRow ? statusCellColor : isIdRow ? 'var(--chakra)' : 'var(--t1)',
                            fontWeight: isStatusRow || isNameRow || isIdRow ? 700 : 500,
                            fontFamily: isIdRow ? 'Courier New, monospace' : 'inherit',
                          }}>
                            {/* Status row gets a coloured pill */}
                            {isStatusRow ? (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                padding: '3px 10px', borderRadius: 12,
                                fontSize: 11, fontWeight: 700, letterSpacing: '.05em',
                                background: isSubmitted ? 'var(--green-bg)' : isDraft ? '#FFFBEB' : '#FEF2F2',
                                color: statusCellColor,
                                border: `1px solid ${isSubmitted ? 'var(--green-bd)' : isDraft ? '#FCD34D' : '#FECACA'}`,
                              }}>
                                {statusIcon} {val.toUpperCase()}
                              </span>
                            ) : (val || '—')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Officer note — colour matches status ── */}
              <div style={{ margin: '0 22px 22px', padding: '12px 14px', background: noteBg, border: `1px solid ${noteBorder}`, borderRadius: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: noteTitleColor, marginBottom: 5 }}>
                  {noteIcon} {noteTitle}
                </div>
                <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.65 }}>{noteBody}</p>
                <p className="dv" style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 5 }}>{noteHi}</p>
              </div>

            </div>
          );
        })()}

      </div>
    </div>
  );
}