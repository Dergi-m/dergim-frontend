import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const blobName = searchParams.get('blobName');
  const fileName = searchParams.get('fileName');

  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value || '';
  const sessionToken = cookieStore.get('sessionToken')?.value || '';

  if (!blobName) {
    return NextResponse.json({ success: false, message: 'Missing blob name' }, { status: 400 });
  }

  try {
    const backendResponse = await fetch(
      `${process.env.BACKEND_API_URL}/api/ProjectFile/download/${blobName}?fileName=${fileName}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          SessionToken: sessionToken,
        },
      }
    );

    const contentType = backendResponse.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition =
      backendResponse.headers.get('content-disposition') || `attachment; filename="${fileName}"`;

    const fileStream = backendResponse.body;

    return new NextResponse(fileStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Download failed', error },
      { status: 500 }
    );
  }
}
