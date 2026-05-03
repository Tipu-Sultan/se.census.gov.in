import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CensusSubmission from '@/models/CensusSubmission';
import { isValidSubmissionId } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')?.trim().toUpperCase();
  if (!id) return NextResponse.json({ found: false, error: 'No ID provided' }, { status: 400 });
  if (!isValidSubmissionId(id)) return NextResponse.json({ found: false, error: 'Invalid ID format. Expected: XX-2027-P1-XXXXXX' }, { status: 400 });

  const db = await connectDB();
  if (!db) return NextResponse.json({ found: false, error: 'Database unavailable. Try again later.' }, { status: 503 });

  try {
    const doc = await CensusSubmission.findOne(
      { submissionId: id, status: 'submitted' },
      // Return only safe fields — no session token, no aadhaar
      {
        submissionId: 1, state: 1, district: 1, subDistrict: 1, village: 1,
        headName: 1, householdMembers: 1, submittedAt: 1, houseNo: 1,
        buildingNo: 1, structureType: 1, status: 1, _id: 0,
      }
    ).lean();

    if (!doc) return NextResponse.json({ found: false, error: 'No submitted record found with this ID' });
    return NextResponse.json({ found: true, record: doc });
  } catch (err) {
    console.error('GET /api/verify:', err);
    return NextResponse.json({ found: false, error: 'Server error' }, { status: 500 });
  }
}
