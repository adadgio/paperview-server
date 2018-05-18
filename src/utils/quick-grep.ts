export function quickGrep() {
    return {
        pageNo: (str: string): number => {
            const reg = new RegExp(/([0-9]+)(?:\:|\-){1}/)
            const match = str.match(reg)

            return (match) ? parseInt(match[1]) : null;
        }
    }
}
