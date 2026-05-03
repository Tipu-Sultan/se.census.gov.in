import mongoose, { Schema } from 'mongoose';

const CensusSubmissionSchema = new Schema(
  {
    // ── Identity ──
    submissionId: { type: String, required: true, unique: true, index: true },
    sessionToken: { type: String, required: true, index: true },
    status: { type: String, enum: ['draft', 'submitted'], default: 'draft', index: true },
    submittedAt: { type: Date },
    lastSavedAt: { type: Date, default: Date.now },
    currentStep: { type: Number, default: 0 },
    lang: { type: String, enum: ['en', 'hi'], default: 'en' },

    // ── Location ──
    state: { type: String, default: '' },
    district: { type: String, default: '' },
    subDistrict: { type: String, default: '' },
    village: { type: String, default: '' },
    wardNo: { type: String, default: '' },
    houseNo: { type: String, default: '' },

    // ── Q1–Q5: Household identity ──
    buildingNo: { type: String, default: '' },
    censusHouseNo: { type: String, default: '' },
    householdNo: { type: String, default: '' },
    headName: { type: String, default: '' },
    headPhone: { type: String, default: '' },
    householdMembers: { type: Number, default: 1 },
    marriedCouples: { type: Number, default: 0 },

    // ── Q6–Q10: Building ──
    structureType: { type: String, default: '' },
    structureCondition: { type: String, default: '' },
    tenure: { type: String, default: '' },
    exclusiveRooms: { type: Number, default: 1 },
    totalRooms: { type: Number, default: 1 },

    // ── Q11–Q16: Water & Sanitation ──
    drinkingWater: { type: [String], default: [] },   // checkbox — multiple
    waterAvailability: { type: String, default: '' },
    latrine: { type: String, default: '' },
    bathroom: { type: String, default: '' },
    wasteWater: { type: String, default: '' },

    // ── Q13, Q17–Q18, Q28: Energy & Kitchen ──
    lighting: { type: String, default: '' },
    kitchen: { type: String, default: '' },
    cookingFuel: { type: [String], default: [] },     // checkbox — multiple
    separateCookingRoom: { type: Boolean, default: false },

    // ── Q19–Q27: Assets ──
    assets: { type: [String], default: [] },          // checkbox — multiple

    // ── Q29: Rooms ──
    // (totalRooms above)

    // ── Q30–Q31: Ownership ──
    houseOwnership: { type: String, default: '' },
    landOwnership: { type: String, default: '' },

    // ── Q32–Q33: Banking ──
    hasBankAccount: { type: Boolean, default: false },
    hasAadhaar: { type: Boolean, default: false },
    aadhaarRef: { type: String, default: '' }, // last 4 digits only
  },
  {
    timestamps: true,
    collection: 'census_submissions_2027',
  }
);

// Compound indexes
CensusSubmissionSchema.index({ sessionToken: 1, status: 1 });
CensusSubmissionSchema.index({ state: 1, status: 1 });
CensusSubmissionSchema.index({ submittedAt: -1 });
CensusSubmissionSchema.index({ submissionId: 1, status: 1 });

export const CensusSubmission =
  mongoose.models.CensusSubmission ||
  mongoose.model('CensusSubmission', CensusSubmissionSchema);

export default CensusSubmission;
