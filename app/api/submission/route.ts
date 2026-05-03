import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CensusSubmission from '@/models/CensusSubmission';
import { generateSubmissionId } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { sessionToken, formData } = await req.json();
    if (!sessionToken) return NextResponse.json({ success: false, error: 'No session' }, { status: 400 });

    const db = await connectDB();
    if (!db) {
      // Even without DB, generate a local ID so user gets feedback
      const id = generateSubmissionId(formData.state || '');
      return NextResponse.json({ success: true, submissionId: id, dbSaved: false });
    }

    const doc = await CensusSubmission.findOneAndUpdate(
      { sessionToken, status: 'draft' },
      {
        $set: {
          ...formData,
          status: 'submitted',
          submittedAt: new Date(),
          lastSavedAt: new Date(),
        },
      },
      { new: true }
    );

    // If no draft found (edge case), create new submitted record
    if (!doc) {
      const submissionId = generateSubmissionId(formData.state || '');
      const newDoc = await CensusSubmission.create({
        sessionToken,
        submissionId,
        ...formData,
        status: 'submitted',
        submittedAt: new Date(),
      });
      return NextResponse.json({ success: true, submissionId: newDoc.submissionId, dbSaved: true });
    }

    return NextResponse.json({ success: true, submissionId: doc.submissionId, dbSaved: true });
  } catch (err) {
    console.error('POST /api/submission:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
