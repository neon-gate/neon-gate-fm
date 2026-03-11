import { NextResponse } from 'next/server'

import { ErrorFactoryService, ErrorService } from '@api/transport/http'
import { HTTP_ERROR_MAP } from '@api/transport/http'
import { fortMinorInstance } from '../fort-minor.instance'
import { isStartBodyValid } from './guards/is-start-body-valid.guard'
import type { StartPlaybackResponse, StartResponse } from './start.types'
import { papercutTrackMetadataMock } from '@mocks/track-metadata.mocks'

type MinorStartResponse = Promise<NextResponse>

export async function POST(request: Request): MinorStartResponse {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()

  try {
    const body = await request.json()
    const payload = isStartBodyValid(body)

    const { data } = await fortMinorInstance.post<StartPlaybackResponse>(
      '/fort-minor/start',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-request-id': requestId
        }
      }
    )

    const streamUrl = `/api/fort-minor/${data.trackId}/playlist`
    const track = {
      ...papercutTrackMetadataMock,
      id: data.trackId,
      src: streamUrl
    }

    const response: StartResponse = {
      streamUrl,
      track
    }

    return NextResponse.json(response, {
      headers: { 'x-request-id': requestId }
    })
  } catch (error) {
    const errorFactory = new ErrorFactoryService(HTTP_ERROR_MAP)
    const errorService = new ErrorService(errorFactory)

    return errorService.normalizeRouteError(error, requestId)
  }
}
