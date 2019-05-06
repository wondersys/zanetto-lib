// Imports the Google Cloud client library
import { PubSub } from '@google-cloud/pubsub';
import { ProcessMessage } from './interfaces/process-message';

export class PubSubClient {

    private pubSub: PubSub;

    constructor(private processingTopic: string) {
        // Instantiates a client
        this.pubSub = new PubSub();
    }

    public publishProcessMessage(message: ProcessMessage, sourceProcessor: string, meta?: any) {

        const data = JSON.stringify(message);
        const dataBuffer = Buffer.from(data);
        const attributes = Object.assign({
            dataType: 'ProcessMessage',
            source: sourceProcessor,
        }, meta);
        return this.pubSub.topic(this.processingTopic).publish(dataBuffer, attributes);
    }
}
