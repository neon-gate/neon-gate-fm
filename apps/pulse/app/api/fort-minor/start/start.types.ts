import { CurrentTrack } from '@domain'

export interface StartRequest {
  trackId?: string
}

export interface StartPlaybackResponse {
  trackId: string
  playlistPath: string
}

export interface StartResponse {
  streamUrl: string
  track: CurrentTrack
}
