import * as chai            from 'chai'
import { should, expect }   from 'chai'
import * as request         from 'request'

const env = require('../environments/env.test.json')

describe('GET /', () => {
    it('respond with json {"status": "ok"}', (done) => {

        request(`${env.HOST}:${env.PORT}`, (error, response, body) => {
            let jsonResponse: any = JSON.parse(response.body)

            expect(response.statusCode).to.equal(200)
            expect(jsonResponse.status).to.equal('ok')

            done()
        })

    })
})
