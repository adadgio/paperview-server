import { Console }      from '../utils';
import { Pubsub }       from '../events';

const request = require('request')

export class WebhookListener
{
    /**
     * Send webhook to your subscribers
     */
    listen()
    {
        Pubsub.on('webhook:send', (e: any) => {

            Console.cyan(`webhook sent: ${e.url}`)
            
            request({
                method: 'POST',
                url: e.url,
                body: e.data,
                json: true,
            }, (error, response, body) => {
                if (error) {
                    console.log('Webhook failed', e.url)
                }
            })

        })
    }
}
