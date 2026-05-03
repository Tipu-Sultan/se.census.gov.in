import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CensusSubmission from '@/models/CensusSubmission';
import { generateSubmissionId } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const sessionToken = req.nextUrl.searchParams.get('sessionToken');
  if (!sessionToken) return NextResponse.json({ submission: null, dbOk: false });

  const db = await connectDB();
  if (!db) return NextResponse.json({ submission: null, dbOk: false });

  try {
    const submission = await CensusSubmission.findOne(
      { sessionToken, status: 'draft' },
      { __v: 0 }
    ).lean();
    return NextResponse.json({ submission: submission ?? null, dbOk: true });
  } catch {
    return NextResponse.json({ submission: null, dbOk: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionToken, formData, currentStep } = body;
    if (!sessionToken) return NextResponse.json({ saved: false, error: 'No session token' }, { status: 400 });

    const db = await connectDB();
    if (!db) return NextResponse.json({ saved: false, error: 'DB unavailable — data saved locally' });

    // Create a submission ID if new record
    const existing = await CensusSubmission.findOne({ sessionToken, status: 'draft' });
    const submissionId = existing?.submissionId || generateSubmissionId(formData.state || '');

    await CensusSubmission.findOneAndUpdate(
      { sessionToken, status: 'draft' },
      {
        $set: { ...formData, currentStep, lastSavedAt: new Date() },
        $setOnInsert: { submissionId, sessionToken, status: 'draft' },
      },
      { upsert: true, new: true }
    );
    return NextResponse.json({ saved: true, submissionId });
  } catch (err) {
    console.error('POST /api/census:', err);
    return NextResponse.json({ saved: false, error: 'Server error' }, { status: 500 });
  }
}
