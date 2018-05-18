export function trimdot(word: string)
{
    // remove dots, spaces or any strange char
    return word.replace(/\.$/i, '')
}
