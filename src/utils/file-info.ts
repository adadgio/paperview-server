export type FileInfoType = {
    path: string;
    extension: string;
    basename: string;
    name: string;
}

export function fileInfo(filepath: string): FileInfoType
{
    let parts = filepath.split('.')

    if (parts.length >= 2) {
        const ext = parts[parts.length - 1].toLowerCase()
        const path = parts[parts.length - 2]
        // basename is the last part of document full filepath
        const basename = filepath.split('/').slice(-1).join('')
        // name is basename without the extension
        const name = basename.split('.').slice(0, 1).join('')

        return { path: filepath, extension: ext, basename: basename, name: name };

    } else {
        return { path: filepath, extension: null, name: null, basename: null }
    }
}
