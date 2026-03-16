import { Profile } from '@domain'
import { avatarMock } from '@mocks'

export const profileMock = {
  displayName: 'John Doe',
  avatar: avatarMock
} satisfies Profile
