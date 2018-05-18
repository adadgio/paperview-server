import * as moment          from 'moment';
import * as nodemailer      from 'nodemailer';
import * as striptags       from 'striptags';
import { Config }           from '../environments/config';

class MailerServiceSingleton
{
    private transport: any;

    private mailOptions = {
        from: null,     // sender address
        to: null,       // comma separated string
        subject: '',    // subject line
        text: '',       // plain text body
        html: ''        // html body
    };

    setup()
    {
        this.transport =nodemailer.createTransport({
            host: Config.get('SMTP')['host'],
            port: Config.get('SMTP')['port'],
            secure: false, // true for 465, false for other ports
            auth: {
                user: Config.get('SMTP')['user'],
                pass: Config.get('SMTP')['pass'],
            }
        })
    }

    send(to: string, message: string, subject: string = ''): Promise<any>
    {
        const mailOptions = this.mailOptions;

        mailOptions.from = `'👻 Poppy' <poppy@no-reply.com>`;
        mailOptions.to = to;
        mailOptions.subject = subject;
        mailOptions.text = striptags(message);
        mailOptions.html = message;

        return new Promise((resolve, reject) => {
            this.transport.sendMail(this.mailOptions, (error, info) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(true)
                }
            })
        })
    }
}

export let Mailer = new MailerServiceSingleton()
