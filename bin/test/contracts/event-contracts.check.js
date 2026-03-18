#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function assertContains(content, marker, context) {
  if (!content.includes(marker)) {
    throw new Error(`Missing marker "${marker}" in ${context}`)
  }
}

const root = path.join(__dirname, '../../..')

const soundgardenTrackMap = read(
  path.join(root, 'repos/domain/streaming/soundgarden/src/soundgarden/domain/events/track-event.map.ts')
)
const petrifiedTrackMap = read(
  path.join(root, 'repos/domain/ai/petrified/src/petrified/domain/events/petrified-event.map.ts')
)
const petrifiedOutMap = read(
  path.join(root, 'repos/domain/ai/petrified/src/petrified/domain/events/petrified-event.map.ts')
)
const fortMinorInMap = read(
  path.join(root, 'repos/domain/ai/fort-minor/src/fort-minor/domain/events/fort-minor-event.map.ts')
)
const stereoInMap = read(
  path.join(root, 'repos/domain/ai/stereo/src/stereo/domain/events/stereo-event.map.ts')
)
const stereoOutMap = read(
  path.join(root, 'repos/domain/ai/stereo/src/stereo/domain/events/stereo-event.map.ts')
)
const mockingbirdMap = read(
  path.join(root, 'repos/domain/streaming/mockingbird/src/mockingbird/domain/events/mockingbird-event.map.ts')
)
const hybridStorageMap = read(
  path.join(root, 'repos/domain/streaming/hybrid-storage/src/hybrid-storage/domain/events/hybrid-storage-event.map.ts')
)
const authorityMap = read(
  path.join(root, 'repos/domain/identity/authority/src/authority/domain/events/authority-event.map.ts')
)
const slimShadyMap = read(
  path.join(root, 'repos/domain/identity/slim-shady/src/slim-shady/domain/events/slim-shady-event.map.ts')
)

// Soundgarden -> Petrified contract parity
assertContains(soundgardenTrackMap, '[TrackEvent.Uploaded]:', 'soundgarden track-event.map.ts')
assertContains(petrifiedTrackMap, '[TrackEvent.Uploaded]:', 'petrified event.map.ts')
assertContains(soundgardenTrackMap, 'sourceStorage:', 'soundgarden track.uploaded contract')
assertContains(petrifiedTrackMap, 'sourceStorage:', 'petrified inbound track.uploaded contract')
assertContains(soundgardenTrackMap, 'petrifiedStorage:', 'soundgarden track.uploaded contract')
assertContains(petrifiedTrackMap, 'petrifiedStorage:', 'petrified inbound track.uploaded contract')
assertContains(soundgardenTrackMap, 'fortMinorStorage:', 'soundgarden track.uploaded contract')
assertContains(petrifiedTrackMap, 'fortMinorStorage:', 'petrified inbound track.uploaded contract')

// Petrified -> Fort Minor/Stereo contract parity
assertContains(petrifiedOutMap, '[TrackEvent.PetrifiedGenerated]:', 'petrified outbound map')
assertContains(fortMinorInMap, '[TrackEvent.PetrifiedGenerated]:', 'fort-minor inbound map')
assertContains(stereoInMap, '[TrackEvent.PetrifiedGenerated]:', 'stereo inbound map')
assertContains(petrifiedOutMap, 'storage: { bucket: string; key: string }', 'petrified output')
assertContains(fortMinorInMap, 'storage: { bucket: string; key: string }', 'fort-minor input')
assertContains(stereoInMap, 'storage: { bucket: string; key: string }', 'stereo input')

// Stereo -> Mockingbird approval contract parity
assertContains(stereoOutMap, '[TrackEvent.Approved]:', 'stereo outbound map')
assertContains(mockingbirdMap, '[TrackEvent.Approved]:', 'mockingbird inbound map')
assertContains(stereoOutMap, 'sourceStorage:', 'stereo approved payload')
assertContains(mockingbirdMap, 'sourceStorage:', 'mockingbird approved payload')
assertContains(stereoOutMap, 'objectKey: string', 'stereo approved payload')
assertContains(mockingbirdMap, 'objectKey: string', 'mockingbird approved payload')

// Mockingbird -> Hybrid Storage HLS contract parity
assertContains(mockingbirdMap, '[TrackEvent.HlsGenerated]:', 'mockingbird outbound map')
assertContains(hybridStorageMap, '[TrackEvent.HlsGenerated]:', 'hybrid-storage inbound map')
assertContains(mockingbirdMap, 'masterPlaylist: string', 'mockingbird hls contract')
assertContains(hybridStorageMap, 'masterPlaylist: string', 'hybrid-storage hls contract')

// Authority -> Slim Shady identity contract parity
assertContains(authorityMap, '[AuthorityEvent.UserSignedUp]:', 'authority outbound map')
assertContains(slimShadyMap, '[AuthorityEvent.UserSignedUp]:', 'slim-shady inbound map')
assertContains(authorityMap, '[UserEvent.ProfileCreated]:', 'authority event map')
assertContains(slimShadyMap, '[UserEvent.ProfileCreated]:', 'slim-shady event map')

console.log('OK event-contracts.check.js')
