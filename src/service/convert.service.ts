import * as fs          from 'fs';
import * as child       from 'child_process';
import * as pdfextr     from 'pdf-extractor';
import * as zipFolder   from 'zip-folder';
import { Console }      from '../utils';
import { Document }     from '../Document';
import { Pubsub }       from '../events';

const PdfExtractor = pdfextr.PdfExtractor

export class ConvertServiceSingleton
{
    extract(document: Document): Promise<Document>
    {
        const pdfPath = document.filepath()
        const outputDir = document.dirpath()
        
        let extractor = new PdfExtractor(outputDir, {
            viewportScale: (width, height) => {
                // dynamic zoom based on rendering a page to a fixed page size
                if (width > height) {
                    return 1100 / width; //landscape: 1100px wide
                } else {
                    return 800 / width; // portrait: 800px wide
                }
            },
            // pageRange: [1,5],
        })

        return new Promise((resolve, reject) => {
            return extractor.parse(pdfPath).then(() => {
                return this.optimizeSVG(document)
            }).then(() => {
                return this.zip(document)
            }).then(() => {
                resolve(document)
            })
            .catch(error => {
                throw new Error(error)
            })
        })
    }

    zip(document: Document): Promise<any>
    {
        let zipath = `${document.dirpath()}/assets.zip`

        return new Promise((resolve, reject) => {
            zipFolder(document.dirpath(), `${document.dirpath()}/${document.getKey()}.zip`, (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(document)
                }
            })
        })
    }

    optimizeSVG(document: Document)
    {
        let outDir = `${document.dirpath()}`;

        if (false === fs.existsSync(outDir)) {
            return Promise.reject(`${outDir} does not exist`)
        }

        const args = [ outDir ];

        return new Promise((resolve, reject) => {
            let strOut: string = '';
            const bat = child.spawn('svgo', args)

            bat.stdout.on('data', (data) => {
                strOut += data.toString()
            })
            bat.stderr.on('data', (data) => {
                strOut += data.toString()
            })
            bat.on('end', (data) => {
                strOut += data.toString()
            })

            bat.on('exit', (code: number) => {
                // zero indicates a success process end in bash
                Console.magenta(`pdf.service.ts: Child process (convert) exited with code ${code}`)

                if (0 === code) {
                    resolve(strOut)
                } else {
                    reject(strOut)
                }
            })

        })
    }
}

export let Convert =  new ConvertServiceSingleton()
