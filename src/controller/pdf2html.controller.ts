import { BaseController }   from './base.controller';
import { Pubsub }           from '../events';
import { Document }         from '../document';
import { Pdf2Html }         from '../service';
import { defaultOption }    from '../utils';

export class Pdf2HtmlControllerSingleton extends BaseController
{
    pdf2htmlAction(request: any, response: any)
    {
        if (!request.files || typeof request.files.file !== 'object') {
            return response.status(400).send({ type: 'error', message: 'the request <file> parameter is required (files.file)'})
        }

        const file = request.files.file;
        const customData  = (JSON.parse(request.body.data) || null)
        const webhookUrl = (request.body.webhook || null)

        const splitRegexs = (JSON.parse(request.body.split) || {})
        let startRegex = defaultOption(splitRegexs, 'startRegex', null)
        let endRegex = defaultOption(splitRegexs, 'endRegex', null)

        const document = new Document()
        document.createFromInput(file)

        document.save().then((doc: Document) => {
            Pdf2Html.pdf2html(doc).then(doc => {
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
        
        response.set('Content-Type', 'application/json; charset=utf-8')
        response.status(200).send({ status: 'document.pending', document: document.serialize() }).end()
    }
}

export let Pdf2HtmlController = new Pdf2HtmlControllerSingleton()
