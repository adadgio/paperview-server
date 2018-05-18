import * as events from 'events'

class PubsubSingleton extends events.EventEmitter
{
    constructor()
    {
        super()
    }

    publish(eventName: string, eventData: any)
    {
        this.emit(eventName, eventData)
    }
}

export let Pubsub = new PubsubSingleton()
