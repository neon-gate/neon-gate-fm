import { atomWithImmer } from 'jotai-immer'

import type { TrackMetadata } from '@domain'
import { somewhereIBelongTrackMetadataMock } from '@mocks/track-metadata.mocks'

export const trackMetadataAtom = atomWithImmer<TrackMetadata>(somewhereIBelongTrackMetadataMock)
