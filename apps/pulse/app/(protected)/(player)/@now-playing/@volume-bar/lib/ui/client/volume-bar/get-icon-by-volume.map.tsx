import {
  Volume1Icon,
  Volume2Icon,
  VolumeOffIcon,
  VolumeIcon
} from 'lucide-react'

import { Volume } from '@domain'

import { getClosestIconVolume } from './get-closest-icon-volume.compute'

export function getIconByVolume(volume: number) {
  const closestVolume = getClosestIconVolume(volume)

  const icon = {
    [Volume.Loud]: <Volume2Icon />,
    [Volume.Moderate]: <Volume1Icon />,
    [Volume.Quiet]: <VolumeIcon />,
    [Volume.Off]: <VolumeOffIcon />
  }[closestVolume]

  return icon ?? <Volume1Icon />
}
