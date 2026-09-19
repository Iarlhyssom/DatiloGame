
// FUNÇÃO PARA ALTERAR AS CORES DO HTML
export function changeStyleColor (colorList) {
    document.documentElement.style.setProperty('--bg-color', colorList['bg-color']);
    document.documentElement.style.setProperty('--text-color', colorList['text-color']);
    document.documentElement.style.setProperty('--border-color', colorList['border-color']);
    document.documentElement.style.setProperty('--button-bg', colorList['button-bg']);
    document.documentElement.style.setProperty('--shadowText', colorList['shadowText']);

    let hex = colorList['bg-color'];
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Média simples do RGB
    let brilho = (r + g + b) / 3;

    if (brilho < 128) {
        document.documentElement.style.setProperty('--shadowText', '#FFFFFF0d');
    } else {
        document.documentElement.style.setProperty('--shadowText', '#0000000d');
    }

}
