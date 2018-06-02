import draw from './draw'

const MODES = ['landscape', 'portrait']
const i18n = {
  landscape: 'Альбомная ориентация', 
  portrait: 'Книжная ориентация'
}
const $mode = document.getElementById('mode')

let current
const setMode = mode => {
  $mode.innerText = i18n[mode]
  draw(mode)
}
const toggleMode = () => {
  current = current ? 0 : 1
  setMode(MODES[current])
}

document.getElementById('mode').addEventListener('click', toggleMode)
document.querySelector('.controls').classList.remove('controls--hidden')
current = window.innerWidth > window.innerHeight ? 0 : 1
setMode(MODES[current])