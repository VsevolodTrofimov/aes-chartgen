/*
  Till portrait mode support
  dynamic drawLine switching
  dynamic move mocking \ demoking
  
  Proper text shifting \ minus shiftings 
*/

import SVG from 'svg.js'
import panZoom from 'svg-pan-zoom'
import * as data from './data'

const INPUTS_TOTAL = data.conjuncts[0].length
data.outputs.forEach(ks => {
  for(let i = 0; i < ks.length; ++i) --ks[i]
})

// DRAWING CONSTANTS
const LINE_WIDTH = 1
const CELL = 11
const SPLIT_R = 5
const G_PAD = CELL * 10

const I_PAD = CELL * 2
const I_MAR = CELL * 5

const C_SIZE = CELL * 6
const C_PAD = CELL * 2
const C_MAR = CELL * 4

const O_MAR = CELL * 4

const N_WIDTH = CELL
const MINUS_WIDTH = 4

const I_lastUsedIn = id => data.conjuncts.filter(c => c[id] != -1).pop()
const C_lastUsedIn = id => data.outputs.filter(o => o.indexOf(id) != -1).pop()

const conjLength = id => id * C_SIZE + (id - 1) * C_PAD
const drawText = (draw, text) => draw.text(text).attr('text-anchor', 'middle')
let drawLine = (draw, length, direction='x') => {
  // will be redefined
}

const O_FILLS = [
  '#241214',
  '#248994',
  '#977914',
  '#245114',
  '#fa1214',
  '#24ee14',
  '#bb1217',
]


// INPUTS
const inputLength = id => {
  const lastUseIdx = data.conjuncts.indexOf(I_lastUsedIn(id)) + 1

  return conjLength(lastUseIdx) - id * CELL - CELL/2
}


const drawInput = (draw, id) => {
  const g = draw.group().move(id * I_PAD, 0)

  g.text(data.inputLetter + String(id + 1)).move(-9.5, -9.5)
  drawLine(g, inputLength(id), 'y').move(0, CELL * 3)
  g.circle(CELL).attr('class', 'pin').move(-CELL/2, CELL * 2)

  return g
}

// CONJUNCTS
const C_linkLength = inputId => I_PAD * (INPUTS_TOTAL - inputId) + I_MAR

const drawGate = (draw, type, label, size) => {
  const g = draw.group()

  g.rect(size, size).attr('class', 'gate')
  drawText(g, type).move(size/2, size/2).attr('class', 'gate__type')
  drawText(g, label).move(size/2, size/2).attr('class', 'gate__label')

  return g
}

const drawLink = (draw, inputId, type, circle=true) => {
  const link = draw.group()
  const lineWidth = C_linkLength(inputId) - (type === 0 ? CELL + CELL: 0)
  
  drawLine(link, lineWidth)
  
  if(type == 0) {
    drawLine(link, CELL).move(lineWidth + CELL, 0)
    link.rect(N_WIDTH, CELL).move(lineWidth, -CELL/2).attr('class', 'not')
    const wrapper = link.group().move(lineWidth + N_WIDTH/2, 0)
    wrapper.rect(MINUS_WIDTH, LINE_WIDTH).oMove(-MINUS_WIDTH/2, 0)
  }

  if(circle) {
    const splitShift = -(SPLIT_R - LINE_WIDTH)/2
    link.circle(SPLIT_R).move(splitShift, splitShift)
  }

  return link
}

const outInputIdxPos = (idx, total) => {
  const perConj = 4/total * CELL
  return (total - idx + 0.5) * perConj
}

const conjuncOutputLength = id => {
  const lastUse = C_lastUsedIn(id)
  const lastUseIdx = lastUse.indexOf(id)
  const lastUseOutputIdx = data.outputs.indexOf(lastUse)

  return O_MAR + lastUseOutputIdx * (C_SIZE + C_PAD) + outInputIdxPos(lastUseIdx, lastUse.length) 
}

const drawConjunct = (draw, id) => {
  const g = draw.group().move(0, id * (C_SIZE + C_PAD))
  drawGate(g, '1', data.conjunctLetter + String(id + 1), C_SIZE)

  data.conjuncts[id].forEach((type, idx) => {
    if(type === -1) return

    drawLink(g, idx, type, I_lastUsedIn(idx) !== data.conjuncts[id])
      .move(-C_linkLength(idx), (INPUTS_TOTAL - idx + 0.5) * CELL)
  })

  drawLine(g, conjuncOutputLength(id)).move(C_SIZE, C_SIZE/2)

  return g
}

// Outputs

const O_linkLength = conjId => (C_SIZE + C_PAD) * (data.conjuncts.length - conjId) + O_MAR + C_SIZE/2

const drawOutput = (draw, id, orientation) => {
  const g = draw.group().move(id * (C_SIZE + C_PAD), 0)
  const label = data.outputLetter + String(id + 1)
  drawGate(g, '&', label, C_SIZE)

  data.outputs[id].forEach((k, idx, used) => {
    const length = O_linkLength(k + 1)
    const line_g = g.group().move(outInputIdxPos(idx, used.length), -length)

    drawLine(line_g, length, 'y')
    if(C_lastUsedIn(k) !== data.outputs[id]) {
      const splitShift = -(SPLIT_R - LINE_WIDTH)/2
      line_g.circle(SPLIT_R).move(splitShift, splitShift)
    }
  })

  const label_g = g.group().move(C_SIZE/2, C_SIZE)
  drawLine(label_g, CELL, 'y')
  label_g.circle(CELL).attr('class', 'pin').move(-CELL/2, CELL)
  const outPutLabel = label_g.text(label)

  outPutLabel.move(-9.5, CELL*4)

  return g
}

// FINAL
let pz = { destroy: () => {} }
const oMove = SVG.Element.prototype.move
SVG.Element.prototype.oMove = oMove
const drawFull = (orientation='landscape') => {
  pz.destroy()
  document.getElementById('root').innerHTML = ''
  const draw = SVG('root')

  const canv = draw.group().move(G_PAD, G_PAD)

  const base = canv.__proto__.__proto__.__proto__.__proto__

  if(orientation === 'landscape') {
    base.move = function(x,y) {
      return oMove.call(this, y, x)
    }
    drawLine = (draw, length, direction='x') => {
      if(direction === 'x') return draw.rect(LINE_WIDTH, length)
      else return draw.rect(length, LINE_WIDTH)
    }
  } else {
    base.move = oMove
    drawLine = (draw, length, direction='x') => {
      if(direction === 'x') return draw.rect(length, LINE_WIDTH)
      else return  draw.rect(LINE_WIDTH, length)
    }
  }

  const cons = canv.group().move(I_PAD * INPUTS_TOTAL + I_MAR, C_MAR)
  const outs = cons.group().move(C_SIZE + O_MAR, O_MAR + conjLength(data.conjuncts.length))

  for(let i = 0; i < INPUTS_TOTAL; ++i) drawInput(canv, i)
  for(let i = 0; i < data.conjuncts.length; ++i) drawConjunct(cons, i)
  for(let i = 0; i < data.outputs.length; ++i) drawOutput(outs, i)

  pz = panZoom(document.querySelector('#root svg'))
  pz.zoom(0.9)
}

export default drawFull