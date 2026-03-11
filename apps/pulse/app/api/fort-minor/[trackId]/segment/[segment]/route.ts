// GET /api/fort-minor/[trackId]/segment/[segment]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackId: string; segment: string }> }
) {
  const { trackId, segment: segmentFile } = await params
  const baseUrl = process.env.FORT_MINOR_BASE_URL ?? process.env.BFF_BASE_URL

  if (!baseUrl) {
    return NextResponse.json(
      { message: 'Missing FORT_MINOR_BASE_URL' },
      { status: 500 }
    )
  }

  const response = await fetch(
    `${baseUrl}/fort-minor/${trackId}/segment/${segmentFile}`,
    {
      headers: {
        Accept: 'video/mp2t'
      }
    }
  )

  const segment = await response.arrayBuffer()

  return new NextResponse(segment, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'video/mp2t'
    }
  })
}
