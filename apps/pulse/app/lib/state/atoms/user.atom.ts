import { atom } from 'jotai'

import type { User } from '@domain'

const mockUser: User = {
  name: 'Jonatas',
  surname: 'Sales',
  libraryId: '1234567890',
  avatar: {
    url: 'https://media.licdn.com/dms/image/v2/D4D03AQEckpY-o7JAdg/profile-displayphoto-scale_400_400/B4DZv8Y9fVJwAg-/0/1769465962066?e=1774483200&v=beta&t=jbY2d7O9sAFt1d84UYiSTeU2ezFwbUl9sIBAcWsFglg'
  }
}

export const userAtom = atom<User | null>(mockUser)
