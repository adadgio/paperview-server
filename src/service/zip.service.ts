import * as fs          from 'fs';
import * as child       from 'child_process';
import { Console }      from '../utils';
import { Document }     from '../Document';
import { Pubsub }       from '../events';

class ZipServiceSingleton
{
    /**
     * Zip a folder wihthout directory structure
     * zip -rj truc.zip ./0275f68f-32fc
     */
    zip(document: Document, zipname: string = document.key(), exclude: Array<string> = []): Promise<Document>
    {
        const args = [
            '-rj',
            // `${document.dirpath()}/${document.key()}.zip`,
            `${document.dirpath()}/${zipname}.zip`,
            `${document.dirpath()}`,
            `*.${document.extension()}`,
        ];
        
        if (exclude.length > 0) {
            args.push('-x')

            for (let glob of exclude) {
                args.push(glob)
            }
        }

        console.log(args)

        return new Promise((resolve, reject) => {
            let strOut: string = '';
            const bat = child.spawn('zip', args)

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

export let Zip = new ZipServiceSingleton()
