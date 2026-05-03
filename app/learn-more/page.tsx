'use client';
import Link from 'next/link';

function AshokaChakra({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={size*0.46} fill="none" stroke="#003F87" strokeWidth={size*0.03}/>
      <circle cx={size/2} cy={size/2} r={size*0.06} fill="#003F87"/>
      {Array.from({length:24},(_,i)=>{const a=(i*360)/24,r=(a*Math.PI)/180,cx=size/2;return<line key={i} x1={cx+size*0.06*Math.cos(r)} y1={cx+size*0.06*Math.sin(r)} x2={cx+size*0.44*Math.cos(r)} y2={cx+size*0.44*Math.sin(r)} stroke="#003F87" strokeWidth={size*0.012}/>})}
    </svg>
  );
}

const SECTIONS = [
  {
    icon: '🏛️',
    title: 'About the 2027 Census',
    hi: 'जनगणना 2027 के बारे में',
    content: [
      'The 2027 Census of India is the 16th national census since 1872 and the first since 2011, delayed due to the COVID-19 pandemic.',
      'For the first time in India\'s history, citizens can self-enumerate digitally — filling the census form online without waiting for a census officer.',
      'Phase 1 (Houselisting & Housing) covers 33 questions about housing conditions, basic amenities, and household assets.',
      'Phase 2 (Population Enumeration) will follow in 2027 and cover individual demographic data.',
    ],
  },
  {
    icon: '📋',
    title: 'What Questions Are Asked?',
    hi: 'कौन से प्रश्न पूछे जाते हैं?',
    content: [
      'Q1–Q5: Building number, census house number, household number, head of household name and total members.',
      'Q6–Q10: Type of structure (pucca/semi-pucca/kaccha), structural condition, tenure of occupancy, number of rooms.',
      'Q11–Q16: Sources of drinking water, lighting source, type of latrine, bathroom facility, and waste water drainage.',
      'Q17–Q18: Kitchen facilities and primary cooking fuel used.',
      'Q19–Q27: Assets including radio, TV, internet, computer, phone, bicycle, scooter, and car.',
      'Q28–Q33: Separate cooking room, total rooms, house and land ownership, bank account and Aadhaar number.',
    ],
  },
  {
    icon: '🔒',
    title: 'Privacy & Confidentiality',
    hi: 'गोपनीयता और सुरक्षा',
    content: [
      'All information collected is strictly confidential and protected under the Census Act, 1948.',
      'Individual data is used solely for statistical purposes — no information is shared with any other government department.',
      'Census data cannot be used against any individual or household in any legal or administrative proceedings.',
      'Your Aadhaar number, if provided, is stored in encrypted form and used only for deduplication.',
      'The census is conducted under the authority of the Registrar General & Census Commissioner, India.',
    ],
  },
  {
    icon: '📱',
    title: 'How to Self-Enumerate',
    hi: 'स्व-गणना कैसे करें',
    content: [
      '1. Click "Start Filling Form" on the home page.',
      '2. Select your State, fill in your District, Sub-district, and Village.',
      '3. Enter details about the head of household and number of members.',
      '4. Answer questions about your building structure, rooms, and tenure.',
      '5. Fill in water source(s), sanitation, and energy/kitchen details.',
      '6. Tick the assets and devices your household owns.',
      '7. Provide ownership and banking information.',
      '8. Submit the form — you\'ll receive a unique Submission ID (e.g. UP-2027-P1-X4K9M2).',
      '9. Save and share your Submission ID with the census officer who visits your home.',
    ],
  },
  {
    icon: '🆔',
    title: 'Your Submission ID',
    hi: 'आपकी पहचान संख्या',
    content: [
      'After submitting the form, you receive a unique Submission ID like UP-2027-P1-X4K9M2.',
      'The first two letters are your State code (e.g. UP = Uttar Pradesh, MH = Maharashtra, DL = Delhi).',
      '2027 indicates the census year, P1 indicates Phase 1 (Houselisting & Housing).',
      'The final 6 alphanumeric characters are a unique identifier for your household.',
      'Census officers can verify your submission using this ID at the Officer Verification Portal.',
      'Keep this ID safe — it is your proof of having completed the digital self-enumeration.',
    ],
  },
  {
    icon: '🌐',
    title: 'Language Support',
    hi: 'भाषा समर्थन',
    content: [
      'This portal fully supports both Hindi (हिंदी) and English.',
      'Use the language toggle button at the top right of any page to switch languages.',
      'Your language preference is saved automatically and remembered on your next visit.',
      'All 33 questions, options, labels, and error messages are available in both languages.',
    ],
  },
  {
    icon: '💾',
    title: 'Auto-Save & Progress',
    hi: 'स्वचालित सहेजें और प्रगति',
    content: [
      'Your form progress is saved automatically every time you change a field.',
      'Data is saved in two places: on the server (MongoDB) and locally in your browser.',
      'Even if the internet goes off or you close the browser, your progress is preserved.',
      'When you return to the form, it automatically resumes from where you stopped.',
      'Progress is tied to your browser session — use the same browser and device to continue.',
    ],
  },
];

const STATE_CODES_DISPLAY = [
  ['AP','Andhra Pradesh'],['AR','Arunachal Pradesh'],['AS','Assam'],['BR','Bihar'],
  ['CG','Chhattisgarh'],['GA','Goa'],['GJ','Gujarat'],['HR','Haryana'],
  ['HP','Himachal Pradesh'],['JH','Jharkhand'],['KA','Karnataka'],['KL','Kerala'],
  ['MP','Madhya Pradesh'],['MH','Maharashtra'],['MN','Manipur'],['ML','Meghalaya'],
  ['MZ','Mizoram'],['NL','Nagaland'],['OD','Odisha'],['PB','Punjab'],
  ['RJ','Rajasthan'],['SK','Sikkim'],['TN','Tamil Nadu'],['TS','Telangana'],
  ['TR','Tripura'],['UP','Uttar Pradesh'],['UK','Uttarakhand'],['WB','West Bengal'],
  ['AN','Andaman & Nicobar'],['CH','Chandigarh'],['DN','Dadra & NH & DD'],
  ['DL','Delhi'],['JK','Jammu & Kashmir'],['LA','Ladakh'],['LD','Lakshadweep'],['PY','Puducherry'],
];

export default function LearnMore() {
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
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/census" className="btn btn-o" style={{ fontSize: 12, padding: '7px 16px' }}>Fill Form →</Link>
            <Link href="/" className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}>← Home</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0D1B3E, #003F87)', padding: '44px 20px 48px', textAlign: 'center', color: 'white' }}>
        <div className="badge badge-blue" style={{ marginBottom: 12, background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>
          INFORMATION GUIDE
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Learn About Census 2027</h1>
        <p className="dv" style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>जनगणना 2027 के बारे में जानें</p>
        <p style={{ fontSize: 13.5, opacity: 0.7, maxWidth: 560, margin: '0 auto', lineHeight: 1.65 }}>
          Everything you need to know about India&apos;s 2027 digital census — questions asked, privacy protections, your Submission ID, and how officers verify records.
        </p>
      </section>

      {/* Quick links */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--bd)', padding: '16px 20px', overflowX: 'auto' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 8, minWidth: 'max-content' }}>
          {SECTIONS.map((s, i) => (
            <a key={i} href={`#section-${i}`}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 20, border: '1px solid var(--bd)', background: 'var(--s2)', fontSize: 12, fontWeight: 500, color: 'var(--t2)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron-bd)'; e.currentTarget.style.background = 'var(--saffron-bg)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.background = 'var(--s2)'; }}>
              <span>{s.icon}</span> <span>{s.title}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 60px' }}>
        {SECTIONS.map((s, i) => (
          <div key={i} id={`section-${i}`} className="card afup" style={{ padding: '24px 26px', marginBottom: 16, scrollMarginTop: 80 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--saffron-bg)', border: '1.5px solid var(--saffron-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)', marginBottom: 3 }}>{s.title}</h2>
                <div className="dv" style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 14 }}>{s.hi}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.content.map((c, j) => (
                    <li key={j} style={{ display: 'flex', gap: 8, fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--saffron)', flexShrink: 0, marginTop: 1 }}>›</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        {/* State codes reference */}
        <div className="card" style={{ padding: '24px 26px', marginBottom: 16 }}>
          <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)', marginBottom: 4 }}>🗺️ State Codes Reference</h2>
          <div className="dv" style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16 }}>राज्य कोड संदर्भ</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 6 }}>
            {STATE_CODES_DISPLAY.map(([code, name]) => (
              <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--s2)', borderRadius: 6, border: '1px solid var(--bd)' }}>
                <span style={{ fontFamily: 'Courier New, monospace', fontWeight: 800, fontSize: 13, color: 'var(--saffron)', minWidth: 24 }}>{code}</span>
                <span style={{ fontSize: 12, color: 'var(--t2)' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0D1B3E, #003F87)', borderRadius: 18, padding: '32px 28px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🇮🇳</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Ready to fill your census?</h3>
          <p className="dv" style={{ fontSize: 13, opacity: 0.7, marginBottom: 20 }}>जनगणना भरने के लिए तैयार हैं?</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/census" className="btn btn-o" style={{ fontSize: 14, padding: '12px 28px' }}>Start Census Form →</Link>
            <Link href="/verify" className="btn btn-ghost" style={{ fontSize: 13, padding: '12px 20px', color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.25)' }}>Officer Verification</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
