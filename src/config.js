// basic grid size
const base = 10

export default {
  cell: 10,
  input: {
    m: {
      i: base * 5,
      o: base * 10
    },
  },
  gate: {
    m: {
      i: base * 1,
      o: base * 10
    },
    p: base * 1,
    size: base * 6,
  },
  not: {
    size: base * 1
  }
}
