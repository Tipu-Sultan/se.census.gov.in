import type { Lang } from './utils';

export type FieldType = 'radio' | 'checkbox' | 'text' | 'number' | 'select' | 'counter';

export interface Option { value: string; en: string; hi: string; emoji?: string; }
export interface Question {
  key: string;
  type: FieldType;
  en: string;
  hi: string;
  hint_en?: string;
  hint_hi?: string;
  options?: Option[];
  min?: number;
  max?: number;
  // radio = only one correct answer logically; checkbox = multiple can apply
}

// ── STEP 0: Location — handled as text/select fields in the form ──

// ── STEP 2: Building & Structure ──
export const STRUCTURE_QUESTIONS: Question[] = [
  {
    key: 'structureType',
    type: 'radio', // only ONE type of building
    en: 'Q6. What is the type of the census house?',
    hi: 'Q6. जनगणना घर का प्रकार क्या है?',
    options: [
      { value: 'pucca', en: 'Pucca (permanent materials — brick, stone, cement)', hi: 'पक्का (ईंट, पत्थर, सीमेंट)' },
      { value: 'semi_pucca', en: 'Semi-Pucca (mixed materials)', hi: 'अर्ध-पक्का (मिश्रित सामग्री)' },
      { value: 'kaccha', en: 'Kaccha (temporary — mud, thatch, bamboo)', hi: 'कच्चा (मिट्टी, खपरैल, बाँस)' },
      { value: 'other_structure', en: 'Other', hi: 'अन्य' },
    ],
  },
  {
    key: 'structureCondition',
    type: 'radio', // only ONE condition at a time
    en: 'Q7. What is the condition of the structure?',
    hi: 'Q7. संरचना की स्थिति क्या है?',
    options: [
      { value: 'good', en: 'Good (no major repairs needed)', hi: 'अच्छी (कोई बड़ी मरम्मत नहीं)' },
      { value: 'liveable', en: 'Liveable (minor repairs needed)', hi: 'रहने योग्य (छोटी मरम्मत जरूरी)' },
      { value: 'dilapidated', en: 'Dilapidated (major repairs needed)', hi: 'जर्जर (बड़ी मरम्मत जरूरी)' },
    ],
  },
  {
    key: 'tenure',
    type: 'radio', // only ONE tenure type
    en: 'Q8. What is the tenure of occupancy of the census house?',
    hi: 'Q8. जनगणना घर का अधिभोग कार्यकाल क्या है?',
    options: [
      { value: 'owned', en: 'Owned', hi: 'स्वामित्व' },
      { value: 'rented', en: 'Rented', hi: 'किराए पर' },
      { value: 'employer_provided', en: 'Provided by employer', hi: 'नियोक्ता द्वारा प्रदत्त' },
      { value: 'rent_free', en: 'Rent-free (other than employer)', hi: 'किराया मुक्त' },
      { value: 'other_tenure', en: 'Other', hi: 'अन्य' },
    ],
  },
];

// ── STEP 3: Water & Sanitation ──
export const WATER_QUESTIONS: Question[] = [
  {
    key: 'drinkingWater',
    type: 'checkbox', // household may use MULTIPLE sources
    en: 'Q11. What are the main source(s) of drinking water for the household?',
    hi: 'Q11. परिवार के लिए पेयजल के मुख्य स्रोत क्या हैं?',
    hint_en: 'Select all that apply',
    hint_hi: 'सभी लागू विकल्प चुनें',
    options: [
      { value: 'tap_treated', en: 'Tap water — treated (piped supply)', hi: 'नल का पानी — शुद्ध (पाइप आपूर्ति)' },
      { value: 'tap_untreated', en: 'Tap water — untreated', hi: 'नल का पानी — अशुद्ध' },
      { value: 'covered_well', en: 'Covered well', hi: 'ढका हुआ कुआं' },
      { value: 'uncovered_well', en: 'Uncovered / open well', hi: 'खुला कुआं' },
      { value: 'handpump', en: 'Handpump / Tubewell / Borewell', hi: 'हैंडपंप / नलकूप / बोरवेल' },
      { value: 'river_canal', en: 'River / Canal / Spring', hi: 'नदी / नहर / झरना' },
      { value: 'rainwater', en: 'Rainwater harvesting', hi: 'वर्षा जल संचयन' },
      { value: 'tank_pond', en: 'Tank / Pond / Lake', hi: 'टंकी / तालाब / झील' },
      { value: 'packaged_water', en: 'Packaged / bottled water', hi: 'पैकेज्ड / बोतलबंद पानी' },
      { value: 'other_water', en: 'Other source', hi: 'अन्य स्रोत' },
    ],
  },
  {
    key: 'waterAvailability',
    type: 'radio', // only ONE location for primary source
    en: 'Q12. Where is the main source of drinking water located?',
    hi: 'Q12. पेयजल का मुख्य स्रोत कहाँ स्थित है?',
    options: [
      { value: 'within_premises', en: 'Within the premises', hi: 'परिसर के भीतर' },
      { value: 'near_100m', en: 'Near the premises (within 100 m)', hi: 'परिसर के निकट (100 मीटर के भीतर)' },
      { value: 'far', en: 'Away (more than 100 m)', hi: 'दूर (100 मीटर से अधिक)' },
    ],
  },
  {
    key: 'latrine',
    type: 'radio', // main type used
    en: 'Q14. Type of latrine facility used by the household?',
    hi: 'Q14. परिवार द्वारा उपयोग की जाने वाली शौचालय सुविधा?',
    options: [
      { value: 'flush_sewer', en: 'Flush / Pour flush — connected to sewer', hi: 'फ्लश — सीवर से जुड़ा' },
      { value: 'flush_septic', en: 'Flush / Pour flush — septic tank', hi: 'फ्लश — सेप्टिक टैंक' },
      { value: 'flush_open', en: 'Flush / Pour flush — open drain', hi: 'फ्लश — खुली नाली' },
      { value: 'pit_slab', en: 'Pit latrine with slab / ventilated', hi: 'गड्ढा शौचालय — स्लैब के साथ' },
      { value: 'pit_no_slab', en: 'Pit latrine without slab', hi: 'गड्ढा शौचालय — स्लैब के बिना' },
      { value: 'composting', en: 'Composting toilet', hi: 'कम्पोस्टिंग शौचालय' },
      { value: 'no_latrine', en: 'No latrine — open defecation', hi: 'शौचालय नहीं — खुले में शौच' },
      { value: 'other_latrine', en: 'Other', hi: 'अन्य' },
    ],
  },
  {
    key: 'bathroom',
    type: 'radio', // ONE bathroom status
    en: 'Q15. Is there a bathroom facility in the census house?',
    hi: 'Q15. जनगणना घर में स्नानघर की सुविधा है?',
    options: [
      { value: 'exclusive', en: 'Yes — exclusive use', hi: 'हाँ — विशेष उपयोग के लिए' },
      { value: 'shared', en: 'Yes — shared with others', hi: 'हाँ — साझा' },
      { value: 'no_bathroom', en: 'No bathroom facility', hi: 'स्नानघर नहीं' },
    ],
  },
  {
    key: 'wasteWater',
    type: 'radio', // ONE drainage type
    en: 'Q16. What is the type of waste water outlet from the house?',
    hi: 'Q16. घर से अपशिष्ट जल निकास का प्रकार?',
    options: [
      { value: 'closed_drain', en: 'Closed (underground) drainage system', hi: 'बंद (भूमिगत) नाली प्रणाली' },
      { value: 'open_drain', en: 'Open drain / surface drain', hi: 'खुली नाली' },
      { value: 'no_drain', en: 'No drainage / soaks in ground', hi: 'कोई नाली नहीं / जमीन में सोखता है' },
    ],
  },
];

// ── STEP 4: Energy & Kitchen ──
export const ENERGY_QUESTIONS: Question[] = [
  {
    key: 'lighting',
    type: 'radio', // one PRIMARY source
    en: 'Q13. What is the main source of lighting in the census house?',
    hi: 'Q13. जनगणना घर में प्रकाश का मुख्य स्रोत क्या है?',
    options: [
      { value: 'electricity_grid', en: 'Electricity — Government grid', hi: 'बिजली — सरकारी ग्रिड' },
      { value: 'electricity_solar', en: 'Electricity — Solar power', hi: 'बिजली — सौर ऊर्जा' },
      { value: 'electricity_generator', en: 'Electricity — Generator / DG set', hi: 'बिजली — जनरेटर' },
      { value: 'kerosene', en: 'Kerosene / Oil lantern', hi: 'मिट्टी का तेल / लालटेन' },
      { value: 'other_oil', en: 'Other oil (mustard, coconut, etc.)', hi: 'अन्य तेल (सरसों, नारियल आदि)' },
      { value: 'candle', en: 'Candle / firewood for light', hi: 'मोमबत्ती / जलाऊ लकड़ी' },
      { value: 'no_lighting', en: 'No lighting facility', hi: 'प्रकाश सुविधा नहीं' },
    ],
  },
  {
    key: 'kitchen',
    type: 'radio', // ONE kitchen status
    en: 'Q17. Is there a kitchen / cooking space in the census house?',
    hi: 'Q17. जनगणना घर में रसोई / खाना पकाने की जगह है?',
    options: [
      { value: 'exclusive_lpg', en: 'Yes — exclusive, uses LPG/PNG', hi: 'हाँ — विशेष उपयोग, LPG/PNG के साथ' },
      { value: 'exclusive_no_lpg', en: 'Yes — exclusive, without LPG/PNG', hi: 'हाँ — विशेष उपयोग, LPG/PNG के बिना' },
      { value: 'shared', en: 'Yes — shared kitchen', hi: 'हाँ — साझा रसोई' },
      { value: 'no_kitchen', en: 'No separate kitchen', hi: 'अलग रसोई नहीं' },
    ],
  },
  {
    key: 'cookingFuel',
    type: 'checkbox', // family may use MULTIPLE fuels (e.g. LPG + firewood)
    en: 'Q18. What fuel(s) are mainly used for cooking?',
    hi: 'Q18. खाना पकाने के लिए मुख्यतः कौन से ईंधन उपयोग होते हैं?',
    hint_en: 'Select all that apply',
    hint_hi: 'सभी लागू विकल्प चुनें',
    options: [
      { value: 'lpg_png', en: 'LPG / PNG (piped natural gas)', hi: 'एलपीजी / पाइप्ड गैस' },
      { value: 'firewood', en: 'Firewood / chips', hi: 'जलाऊ लकड़ी / टुकड़े' },
      { value: 'crop_residue', en: 'Crop residue / straw', hi: 'फसल अवशेष / पुआल' },
      { value: 'cow_dung', en: 'Cow dung cake', hi: 'गोबर के उपले' },
      { value: 'coal_lignite', en: 'Coal / lignite / charcoal', hi: 'कोयला / लिग्नाइट / चारकोल' },
      { value: 'kerosene_cook', en: 'Kerosene', hi: 'मिट्टी का तेल' },
      { value: 'electricity_cook', en: 'Electricity (induction / microwave)', hi: 'बिजली (इंडक्शन / माइक्रोवेव)' },
      { value: 'biogas', en: 'Biogas', hi: 'बायोगैस' },
      { value: 'no_cooking', en: 'No cooking done in the house', hi: 'घर में खाना नहीं पकाया जाता' },
    ],
  },
];

// ── STEP 6: Ownership ──
export const OWNERSHIP_QUESTIONS: Question[] = [
  {
    key: 'houseOwnership',
    type: 'radio',
    en: 'Q30. Does the household own this house?',
    hi: 'Q30. क्या परिवार इस घर का मालिक है?',
    options: [
      { value: 'owned', en: 'Yes — owned', hi: 'हाँ — स्वामित्व' },
      { value: 'not_owned', en: 'No — not owned', hi: 'नहीं — स्वामित्व नहीं' },
    ],
  },
  {
    key: 'landOwnership',
    type: 'radio',
    en: 'Q31. Does the household own or lease agricultural land?',
    hi: 'Q31. क्या परिवार के पास कृषि भूमि है (स्वामित्व या पट्टे पर)?',
    options: [
      { value: 'owned_land', en: 'Owned agricultural land', hi: 'स्वामित्व वाली कृषि भूमि' },
      { value: 'leased_land', en: 'Leased agricultural land', hi: 'पट्टे पर कृषि भूमि' },
      { value: 'both_land', en: 'Both owned and leased', hi: 'स्वामित्व और पट्टे दोनों' },
      { value: 'no_land', en: 'No agricultural land', hi: 'कोई कृषि भूमि नहीं' },
    ],
  },
];
