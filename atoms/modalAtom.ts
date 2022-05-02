import { atom } from 'recoil'

export const filterState = atom<number[]>({
  key: 'filterState',
  default: [],
})
