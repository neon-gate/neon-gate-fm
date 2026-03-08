import {
  Volume1Icon,
  Volume2Icon,
  VolumeOffIcon,
  VolumeIcon
} from 'lucide-react'

import { Volume } from '@domain'

export function getIconByVolume(volume: Volume) {
  const icon = {
    [Volume.Loud]: <Volume2Icon />,
    [Volume.Moderate]: <Volume1Icon />,
    [Volume.Quiet]: <VolumeIcon />,
    [Volume.Off]: <VolumeOffIcon />
  }[volume]

  return icon ?? <Volume1Icon />
}
