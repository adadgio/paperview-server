import * as fs          from 'fs';
import * as child       from 'child_process';
import { Console }      from '../utils';
import { Document }     from '../Document';
import { Pubsub }       from '../events';

class LibreOfficeServiceSingleton
{
    /**
     * Transform any non PDF document to a PDF one (expect xls probably)
     * soffice --headless --convert-to html zhon.docx
     */
    transform(document: Document, opts: any): Promise<Document>
    {
        const args = [
            '--headless',
            '--convert-to', opts.to,
            '--outdir', document.dirpath(),
            document.filepath(),
        ];
        
        return new Promise((resolve, reject) => {
            let strOut: string = '';
            const bat = child.spawn('soffice', args)

            bat.stdout.on('data', (data) => {
                // @todo Log data, dont show it
                // process.stdout.write(data.toString())
                strOut += data.toString()
            })

            bat.stderr.on('data', (data) => {
                // @TODO Log data, dont console log it, instead write to same line with "process.stdout.write"
                // process.stdout.write(data.toString())
                strOut += data.toString()
            })

            bat.on('end', (data) => {
                // process.stdout.write(data.toString())
                strOut += data.toString()
            })

            bat.on('exit', (code: number) => {
                // zero indicates a success process end in bash
                Console.lite(`convert.service.ts: Child process (convert) exited with code ${code}`)

                if (0 === code) {
                    resolve(document)
                } else {
                    reject(strOut)
                }
            })

        })
    }
}

export let LibreOffice = new LibreOfficeServiceSingleton()
