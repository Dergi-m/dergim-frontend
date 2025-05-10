import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const projectId = formData.get('projectId') as string;

  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value || '';
  const sessionToken = cookieStore.get('sessionToken')?.value || '';

  if (!file || !projectId) {
    return NextResponse.json(
      { success: false, message: 'Missing file or projectId' },
      { status: 400 }
    );
  }

  const backendForm = new FormData();
  backendForm.append('file', file);

  try {
    const backendResponse = await fetch(
      `${process.env.BACKEND_API_URL}/api/ProjectFile/upload/${projectId}`,
      {
        method: 'POST',
        body: backendForm,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          SessionToken: sessionToken,
        },
      }
    );

    const result = await backendResponse.json();
    return NextResponse.json(result, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Upload failed', error }, { status: 500 });
  }
}
