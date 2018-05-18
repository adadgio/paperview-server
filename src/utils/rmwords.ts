export function rmwords(word: string)
{
    const rmWords = [
        /injectable\/perfusions?$/i,
        /pour solution pour perfusion$/i,
    ];
    
    for (let i in rmWords) {
        word = word.replace(rmWords[i], '').trim()
    }

    return word;
}
