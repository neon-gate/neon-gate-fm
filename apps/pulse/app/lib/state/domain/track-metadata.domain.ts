import { Album } from "./album.domain";

export interface TrackMetadata {
  id: string
  name: string
  description: string
  durationMs: number
  album: Album
}
