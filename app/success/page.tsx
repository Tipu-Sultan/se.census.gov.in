'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AshokaChakra({ size = 48 }: { size?: number }) {
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

function SuccessContent() {
  const params = useSearchParams();
  const submissionId = params.get('id') || 'UNKNOWN';
  const state = params.get('state') || '';

  const copyId = () => {
    navigator.clipboard?.writeText(submissionId).catch(() => {});
    // Basic feedback
    const el = document.getElementById('copy-btn');
    if (el) { el.textContent = '✓ Copied!'; setTimeout(() => { el.textContent = '📋 Copy ID'; }, 2000); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div className="tribar" />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="card2 afup" style={{ maxWidth: 560, width: '100%', padding: '40px 36px', textAlign: 'center' }}>

          {/* Success icon */}
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--green-bg)', border: '3px solid var(--green-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>
            ✅
          </div>

          <div className="badge badge-green" style={{ marginBottom: 14 }}>SUBMITTED SUCCESSFULLY</div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy)', marginBottom: 4 }}>जय हिन्द! 🇮🇳</h1>
          <p style={{ fontSize: 15, color: 'var(--t2)', marginBottom: 6 }}>Form Submitted Successfully</p>
          <p className="dv" style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 24 }}>
            फॉर्म सफलतापूर्वक जमा किया गया
          </p>

          {/* Submission ID box */}
          <div style={{ background: 'var(--s2)', border: '2px dashed var(--bd2)', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--t4)', marginBottom: 8 }}>
              Your Submission ID / आपकी पहचान संख्या
            </div>
            <div className="id-badge" style={{ display: 'block', textAlign: 'center', marginBottom: 14 }}>
              {submissionId}
            </div>
            {state && (
              <div className="badge badge-blue" style={{ marginBottom: 12 }}>
                State: {state}
              </div>
            )}
            <button id="copy-btn" onClick={copyId}
              className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
              📋 Copy ID
            </button>
          </div>

          <div style={{ background: 'var(--saffron-bg)', border: '1px solid var(--saffron-bd)', borderRadius: 10, padding: '14px', marginBottom: 20, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--saffron)', marginBottom: 6 }}>⚠️ IMPORTANT — Please save your ID</div>
            <ul style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.65, paddingLeft: 16 }}>
              <li>Share this ID with the census officer who visits your home</li>
              <li>Officers can verify your submission at <strong>/verify</strong></li>
              <li>The ID contains your state code: <strong>{submissionId.split('-')[0]}</strong></li>
              <li className="dv">इस ID को जनगणना अधिकारी को दिखाएं</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
            <Link href="/verify" className="btn btn-blue" style={{ fontSize: 13 }}>
              🔍 Verify Submission
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ fontSize: 13 }}>
              ← Back to Home
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <AshokaChakra size={28} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--navy)' }}>Office of the RGI & Census Commissioner</div>
              <div style={{ fontSize: 9, color: 'var(--t4)' }}>Ministry of Home Affairs · Census Act 1948</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
