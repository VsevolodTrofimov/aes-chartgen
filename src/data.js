// use as placehoder in conjuncts
const _ = -1

export const inputLetter = 'I'
export const conjunctLetter = 'k'
export const outputLetter = 'O'

// 1 -- as is 
// 0 -- as not
// _ -- not used
export const conjuncts = [
  [1, 1, 1, 0],
  [1, 1, 0, 1],
  [0, 0, 1, 0],
  [1, 0, 1, 1],
  [0, 1, 0, 0],
  [0, 0, 1, 1],
  [1, 0, 1, 0],
  [1, 0, 0, 0],
  [0, 1, 0, 1],
  [1, _, 0, 0],
  [0, 0, 0, _],
  [_, 0, 0, 1],
  [1, 1, 1, _],
  [_, 1, 1, 0],
  [_, 0, 0, 0],
]

// conjunct numbers staring form 1
export const outputs = [
  [1, 2, 3, 10],
  [1, 3, 4, 5],
  [5, 6, 7, 11, 12],
  [6, 8, 13],
  [4, 7, 10, 14],
  [1, 4, 9, 15],
  [2, 6, 11]
]


