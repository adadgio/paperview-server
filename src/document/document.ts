import * as fs                  from 'fs';
import * as fse                 from 'fs-extra';
import * as path                from 'path';
import * as trim                from 'trim-character';
import * as mime                from 'mime-types';
import { uuid, fileInfo }       from '../utils';
import { FileInputInterface }   from '../document'
import { Config }               from '../environments/config';

export class Document
{
    protected uniqkey: string;
    protected name: string;
    protected ext: string;
    protected path: string;
    protected mimetype: string;

    private _input: FileInputInterface;

    constructor(uniqkey?: string)
    {
        if (uniqkey) {
            // we are creating an object for an already existing document asset
            this.uniqkey = uniqkey;
            this.configureExisting()

        } else {
            // create a new document from scratch with a new keu (uuid)
            // we will probably need to call createFromInput afterwards to fill in its details
            this.uniqkey = uuid()
            this.configureNew()
        }
    }

    key()
    {
        return this.uniqkey;
    }

    createFromInput(input: FileInputInterface)
    {
        const info = fileInfo(input.name)

        this._input = input

        this.name = info.name
        this.mimetype = input.mimetype
        this.ext = info.extension.toLowerCase()

        // creates document directory if it does not exists
        this.configureNew()

        return this;
    }

    private configureExisting(): boolean
    {
        if (!fs.existsSync(this.dirpath())) {
            return false;
        }

        return true;
    }

    private configureNew(): void
    {
        // create document directory if it does not exists
        if (false === fs.existsSync(this.dirpath())) {
            fs.mkdirSync(this.dirpath())
        }
    }

    extension()
    {
        return this.ext;
    }

    dirpath(): string
    {
        const datasdir = trim.right(path.resolve(Config.get('DATAS_DIR')), '/')
        return `${datasdir}/${this.key()}`
    }

    webpath(ext?: string): string
    {
        let port = (Config.get('PORT') !== null) ? `:${Config.get('PORT')}` : null;
        let host = `${Config.get('HOST')}${port}`;

        // when extension is not specified the default extension guessed from the filename will be used
        ext = (ext) ? ext : this.ext
        return `${host}/document/${this.key()}/${this.key()}.${ext}`
    }

    filepath(ext?: string): string
    {
        // when extension is not specified the default extension guessed from the filename will be used
        ext = (ext) ? ext : this.ext
        return `${this.dirpath()}/${this.key()}.${ext}`
    }

    pdf()
    {
        return `${this.dirpath()}/${this.key()}.pdf`
    }

    save(): Promise<Document>
    {
        return new Promise((resolve, reject) => {
            const srcpath = this._input.path;
            const destpath = this.filepath()

            this._input.mv(destpath, error => {
                this._input = null
                delete this._input
                if (error) { reject(error) } else { resolve(this) }
            })
        })
    }

    saveAs(ext: string): Promise<Document>
    {
        return new Promise((resolve, reject) => {
            const srcpath = this._input.path;
            const destpath = this.filepath()

            fse.copy(srcpath, destpath, error => {
                this._input = null
                delete this._input
                if (error) { reject(error) } else { resolve(this) }
            })
        })
    }

    update(data: any)
    {
        for (let prop in data) {
            if (this.hasOwnProperty(prop)) {
                this[prop] = data[prop]
            }
        }

        return Promise.resolve(this)
    }

    remove(): Promise<boolean>
    {
        return new Promise((resolve, reject) => {
            fse.remove(this.dirpath(), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    }

    serialize(): any
    {
        let port = (Config.get('PORT') !== null) ? `:${Config.get('PORT')}` : null;
        let host = `${Config.get('HOST')}${port}`;

        return  {
            key: this.key(),
            name: this.name,
            ext: this.ext,
            url: this.webpath(),
            assets: this.webpath('zip'),
            pdf: this.webpath('pdf')
        }
    }
}
