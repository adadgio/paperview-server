export function lineClean(lineText: string) {
    return lineText.replace('       ', ' ').replace('  ', ' ').replace('\r', '').trim()
}

export function linesFormat(lines: Array<any>) {
    return lines.map((lineText) => { return lineClean(lineText) }).filter((lineText) => { return ['\r', '', ' '].indexOf(lineText) === -1 })
}
