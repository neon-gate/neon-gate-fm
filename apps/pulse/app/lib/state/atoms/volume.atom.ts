import { atom } from 'jotai'

import { Volume } from '@domain'

export const volumeAtom = atom<number>(Number(Volume.Moderate))
