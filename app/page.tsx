'use client';
import Link from 'next/link';
import { useState } from 'react';

function AshokaChakra({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 360) / 24;
    const r = (a * Math.PI) / 180;
    const r1 = size * 0.06, r2 = size * 0.44;
    const cx = size / 2;
    return (
      <line key={i}
        x1={cx + r1 * Math.cos(r)} y1={cx + r1 * Math.sin(r)}
        x2={cx + r2 * Math.cos(r)} y2={cx + r2 * Math.sin(r)}
        stroke="#003F87" strokeWidth={size * 0.012} strokeLinecap="round" />
    );
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={animate ? 'cspin' : ''}>
      <circle cx={size / 2} cy={size / 2} r={size * 0.46} fill="none" stroke="#003F87" strokeWidth={size * 0.028} />
      <circle cx={size / 2} cy={size / 2} r={size * 0.06} fill="#003F87" />
      {spokes}
    </svg>
  );
}

const FEATURES = [
  { icon: '🛡️', en_t: 'Secure & Encrypted', hi_t: 'सुरक्षित और एन्क्रिप्टेड', en_d: 'All data protected under the Census Act, 1948. Your information is strictly confidential.', hi_d: 'जनगणना अधिनियम, 1948 के तहत सुरक्षित। जानकारी पूर्णतः गोपनीय है।' },
  { icon: '💾', en_t: 'Never Lose Progress', hi_t: 'प्रगति कभी न खोएं', en_d: 'Dual auto-save: server + local storage. Resume from exactly where you stopped, even after power cut.', hi_d: 'दोहरी स्वचालित बचत। बिजली कटने के बाद भी जहाँ छोड़ा वहाँ से जारी करें।' },
  { icon: '🌐', en_t: 'Hindi & English', hi_t: 'हिंदी और अंग्रेजी', en_d: 'Switch between Hindi and English at any point. All 33 questions fully bilingual.', hi_d: 'किसी भी समय भाषा बदलें। 33 प्रश्न पूर्णतः द्विभाषी।' },
  { icon: '📱', en_t: 'Any Device', hi_t: 'कोई भी डिवाइस', en_d: 'Optimised for mobile phones, tablets and computers. Works on low-speed internet too.', hi_d: 'मोबाइल, टैबलेट और कंप्यूटर पर। धीमे इंटरनेट पर भी काम करता है।' },
  { icon: '🔢', en_t: 'Unique Submission ID', hi_t: 'अद्वितीय पहचान संख्या', en_d: 'Get a state-coded alphanumeric ID (e.g. UP-2027-P1-X4K9). Share it with census officers.', hi_d: 'राज्य-कोड युक्त पहचान संख्या प्राप्त करें (जैसे UP-2027-P1-X4K9)।' },
  { icon: '🔍', en_t: 'Officer Verification', hi_t: 'अधिकारी सत्यापन', en_d: 'Census officers can instantly verify your self-enumeration using your Submission ID.', hi_d: 'जनगणना अधिकारी पहचान संख्या से तुरंत सत्यापन कर सकते हैं।' },
];

const STEPS_INFO = [
  { en: 'Select your state, district, and village', hi: 'अपना राज्य, जिला और गाँव चुनें', icon: '📍' },
  { en: 'Enter household head name and member count', hi: 'परिवार के मुखिया और सदस्यों की जानकारी भरें', icon: '👨‍👩‍👧‍👦' },
  { en: 'Answer 33 questions on housing conditions', hi: 'आवास की स्थिति पर 33 प्रश्नों के उत्तर दें', icon: '🏠' },
  { en: 'Submit and receive your unique Submission ID', hi: 'जमा करें और अपनी अद्वितीय पहचान संख्या पाएं', icon: '✅' },
];

export default function Home() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const hi = lang === 'hi';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="tribar" />

      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--bd)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AshokaChakra size={38} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--navy)', lineHeight: 1.2 }}>Census of India 2027</div>
              <div className="dv" style={{ fontSize: 11, color: 'var(--saffron)', lineHeight: 1.2 }}>भारत की जनगणना</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* <Link href="/verify" style={{ fontSize: 13, fontWeight: 600, color: 'var(--chakra)', textDecoration: 'none', padding: '6px 12px', borderRadius: 8, border: '1.5px solid #BFDBFE', background: '#EFF6FF' }}>
              🔍 {hi ? 'अधिकारी सत्यापन' : 'Officer Verify'}
            </Link> */}
            <button onClick={() => setLang(hi ? 'en' : 'hi')}
              style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20, border: '1.5px solid var(--saffron-bd)', background: 'var(--saffron-bg)', color: 'var(--saffron)', cursor: 'pointer' }}>
              {hi ? 'English' : 'हिंदी'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #d87722 0%, #97a4b3 50%, #146c43 100%)', color: 'white', padding: '70px 20px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,107,0,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="badge badge-orange afup" style={{ marginBottom: 18 }}>
              <span className="sdot sdot-s" />
              {hi ? 'चरण 1 सक्रिय — अप्रैल 2026' : 'Phase 1 Active — April 2026'}
            </div>
            <h1 className={`afup d1 ${hi ? 'dv' : ''}`} style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
              {hi ? (
                <>भारत की <span style={{ color: '#FFAA5C' }}>जनगणना</span><br />२०२७</>
              ) : (
                <>Census of <span style={{ color: '#FFAA5C' }}>India</span> 2027</>
              )}
            </h1>
            <p className={`afup d2 ${hi ? 'dv' : ''}`} style={{ fontSize: 16, opacity: 0.7, marginBottom: 6 }}>
              {hi ? 'Bharat ki Janganna' : 'भारत की जनगणना'}
            </p>
            <p className={`afup d3 ${hi ? 'dv' : ''}`} style={{ fontSize: 15, opacity: 0.8, lineHeight: 1.65, marginBottom: 28, maxWidth: 480 }}>
              {hi
                ? 'भारत की पहली डिजिटल स्व-गणना में भाग लें। गृह-सूचीकरण एवं आवास प्रश्नावली 10–15 मिनट में पूरी करें।'
                : "Participate in India's first digital self-enumeration. Complete the Houselisting & Housing questionnaire in 10–15 minutes."}
            </p>
            <div className="afup d4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/census" className={`btn btn-o ${hi ? 'dv' : ''}`} style={{ fontSize: 15, padding: '13px 28px' }}>
                {hi ? 'जनगणना फॉर्म भरें' : 'Start Filling Form'} →
              </Link>
              <Link href="/learn-more" className="btn btn-ghost" style={{ color: 'rgba(65, 41, 41, 0.85)', borderColor: 'rgba(255,255,255,0.25)', fontSize: 14, padding: '13px 22px' }}>
                {hi ? 'अधिक जानें' : 'Learn More'}
              </Link>
            </div>
            <p className="afup d5" style={{ marginTop: 16, fontSize: 12, opacity: 0.5 }}>
              {hi ? '✓ 10–15 मिनट  ✓ स्वचालित सहेजें  ✓ डेटा 100% गोपनीय' : '✓ 10–15 min  ✓ Auto-save  ✓ 100% confidential data'}
            </p>
          </div>
          {/* Chakra visual */}
          <div className="afup d3" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.15)', animation: 'cspin 40s linear infinite' }} />
            <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
            <AshokaChakra size={160} animate />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--bd)', padding: '20px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 0 }}>
          {[
            { n: '36', en: 'States & UTs', hi: 'राज्य और केशा' },
            { n: '1.4B+', en: 'Population', hi: 'जनसंख्या' },
            { n: '33', en: 'Questions', hi: 'प्रश्न' },
            { n: '2027', en: 'Census Year', hi: 'जनगणना वर्ष' },
            { n: 'Phase 1', en: 'Currently Active', hi: 'अभी सक्रिय' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px 16px', borderRight: i < 4 ? '1px solid var(--bd)' : 'none' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--saffron)', lineHeight: 1.1 }}>{s.n}</div>
              <div className={hi ? 'dv' : ''} style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>{hi ? s.hi : s.en}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '56px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="badge badge-blue" style={{ marginBottom: 10 }}>{hi ? 'कैसे भरें' : 'HOW IT WORKS'}</div>
          <h2 className={hi ? 'dv' : ''} style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>
            {hi ? '4 आसान चरण' : '4 Simple Steps'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {STEPS_INFO.map((s, i) => (
            <div key={i} className="card" style={{ padding: '22px 20px', position: 'relative' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: i === 3 ? 'var(--green-bg)' : 'var(--saffron-bg)', border: `2px solid ${i === 3 ? 'var(--green-bd)' : 'var(--saffron-bd)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 14 }}>
                {s.icon}
              </div>
              <div style={{ position: 'absolute', top: 18, right: 18, width: 24, height: 24, borderRadius: '50%', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--t4)' }}>
                {i + 1}
              </div>
              <p className={hi ? 'dv' : ''} style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.55 }}>{hi ? s.hi : s.en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 20px 56px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="badge badge-orange" style={{ marginBottom: 10 }}>{hi ? 'विशेषताएं' : 'FEATURES'}</div>
          <h2 className={hi ? 'dv' : ''} style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>
            {hi ? 'ऑनलाइन क्यों भरें?' : 'Why fill online?'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card" style={{ padding: '20px 22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 26, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div className={`${hi ? 'dv' : ''}`} style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{hi ? f.hi_t : f.en_t}</div>
                <div className={hi ? 'dv' : ''} style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.55 }}>{hi ? f.hi_d : f.en_d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '56px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🇮🇳</div>
          <h2 className={hi ? 'dv' : ''} style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy)', marginBottom: 12 }}>
            {hi ? 'जनगणना में भाग लें' : 'Your participation matters'}
          </h2>
          <p className={hi ? 'dv' : ''} style={{ color: 'var(--t3)', fontSize: 14, marginBottom: 28, lineHeight: 1.65 }}>
            {hi
              ? 'हर परिवार की जानकारी देश की योजना के लिए महत्वपूर्ण है। अपना योगदान दें।'
              : 'Every household counts. Your data helps the Government of India plan better infrastructure, schools, hospitals, and welfare programs.'}
          </p>
          <Link href="/census" className={`btn btn-o ${hi ? 'dv' : ''}`} style={{ fontSize: 16, padding: '14px 36px' }}>
            {hi ? 'अभी जनगणना फॉर्म भरें' : 'Fill Census Form Now'} →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.55)', padding: '32px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AshokaChakra size={30} />
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>Census of India 2027</div>
              <div className="dv" style={{ fontSize: 10, opacity: 0.55 }}>भारत की जनगणना २०२७</div>
            </div>
          </div>
          <div style={{ fontSize: 12, textAlign: 'center' }}>
            <div>Office of the Registrar General & Census Commissioner, India</div>
            <div style={{ opacity: 0.5 }}>Ministry of Home Affairs, Government of India</div>
          </div>
          <div style={{ fontSize: 11, textAlign: 'right' }}>
            <div>Protected under Census Act, 1948</div>
            <div style={{ opacity: 0.5, marginTop: 2 }}>© 2027 Government of India</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
