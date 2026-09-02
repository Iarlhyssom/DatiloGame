
// FUNÇÃO PARA ALTERAR AS CORES DO HTML
export function changeStyleColor (colorList) {
    document.documentElement.style.setProperty('--bg-color', colorList['bg-color']);
    document.documentElement.style.setProperty('--text-color', colorList['text-color']);
    document.documentElement.style.setProperty('--border-color', colorList['border-color']);
    document.documentElement.style.setProperty('--button-bg', colorList['button-bg']);
    document.documentElement.style.setProperty('--shadowText', colorList['shadowText']);
}
