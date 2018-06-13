import * as fs      from 'fs';
import * as path    from 'path';
// import * as cors    from 'cors';
import * as express from 'express';
import * as parser  from 'body-parser';
import * as upload  from 'express-fileupload';

import { Config }               from './environments/config';
import { Document }             from './document';
import { Argument }             from './argument';
import { Pubsub }               from './events';
import { Console }              from './utils';
import { ParamRequirement }     from './utils';
import { defaultOption }        from './utils';
import { WebhookListener }      from './listener';
import { Convert }              from './service';

export function App() {
    // the environment argument is always require to load
    // the correct environment json file
    Argument.require('env', ['dev', 'staging', 'prod'])
    const ENV = Argument.getArg('env')

    const configParams = require(`./environments/env.${ENV}.json`)
    Config.init(configParams)

    /**
     * Create the datas directory defined in environment config).
     */
    if (!fs.existsSync(Config.get('DATAS_DIR'))) {
        fs.mkdirSync(Config.get('DATAS_DIR'))
    }

    const server = express()
    const PORT = Config.get('PORT') || 8080;
    const corsOptions = { origin: '*', optionsSuccessStatus: 200 }

    server.use(parser.urlencoded({ extended: false, limit: '80mb' }))
    server.use(parser.json())
    server.use(upload())

    /**
     * Listeners be all ears.
     */
    let listeners = [
        new WebhookListener().listen()
    ];

    /**
     * Base API endpoint.
     */
    server.get('/', (req, res) => {
        let response = { status: 'ok' }
        res.set('Content-Type', 'application/json')
        res.status(200).send(response).end()
    })

    /**
     * Base API endpoint.
     */
    server.post('/webhook/self', (req, res) => {
        let response = { incomingRequest: req.body };
        console.log('Test webhook received: OK')
        res.set('Content-Type', 'application/json; charset=utf-8')
        res.status(200).send(response).end()
    })

    /**
     * Convert a PDF file to web assets.
     */
    server.post('/convert', (req, res) => {
        if (!req.files || typeof req.files.file !== 'object') {
            return res.status(400).send({ type: 'error', message: 'the request <file> parameter is required (files.file)'})
        }

        const file = req.files.file;
        const customData  = (req.body.data || null)
        const webhookUrl = (req.body.webhook || null)

        const document = new Document()
        document.createFromInput(file)
        
        document.save().then((doc: Document) => {
            Convert.extract(doc).then(doc => {
                if (webhookUrl) {
                    Pubsub.emit('webhook:send', { url: webhookUrl, data: { status: 'document.done', document: document }})
                }
            }).catch(error => {
                if (webhookUrl) {
                    Pubsub.emit('webhook:send', { url: webhookUrl, data: { status: 'document.error', document: document, error: 'failed to convert' }})
                }
            })
        }).catch(error => {
            if (webhookUrl) {
                Pubsub.emit('webhook:send', { url: webhookUrl, data: { status: 'document.error', document: document, error: 'unable to save uploaded file' }})
            }
        })

        res.set('Content-Type', 'application/json')
        res.status(200).send({ status: 'document.pending', document: document.serialize() }).end()
    })

    /**
     * Serve files and static assets.
     * Note: if cors is necessary use: "/document/:uuid.:ext", cors(corsOptions)
     *
     * @param
     */
    server.get('/document/:uuid.:ext', (req, res) => {
        const document = new Document(req.params.uuid)
        const filepath = document.webpath(req.params.ext)

        if (fs.existsSync(filepath)) {
            res.sendFile(filepath)
        } else {
            return res.status(404).send({ type: 'error', message: 'file not found' })
        }
    })

    /**
     * Create server
     */
    server.listen(PORT, () => {
        Console.cyan(`App listening on port ${PORT}`);
        Console.cyan('Press Ctrl+C to quit.');
    })

// end of App()
}

// const app = new App()
export let app = new App()
