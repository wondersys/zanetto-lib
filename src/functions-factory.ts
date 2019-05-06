import * as functions from 'firebase-functions';
import { Processor } from './processor';
import { ProcessMessage } from './interfaces/process-message';
import { PubSubClient } from './pubsub-client';

export class FunctionsFactory {

    constructor(private region: string, private errorTopic: string) {

    }

    public createFunction(topic: string, processor: Processor) {
        return functions
            .region(this.region)
            .pubsub.topic(topic)
            .onPublish(async (message, context) => {
                const data = <ProcessMessage>message.json;
                const attributes = message.attributes;
                const rawHoCount = Number.parseInt(attributes.hopCount);
                const hopCount = (isNaN(rawHoCount) ? 0 : rawHoCount + 1).toString();
                try {
                    const out = await processor.processMessage(data);
                    if (out) {
                        const pubSubClient = new PubSubClient(topic);
                        return await pubSubClient.publishProcessMessage(out, processor.getName(), { hopCount });
                    } else {
                        return null;
                    }
                } catch (err) {
                    console.error(`PubSub Process Function Err: ${err.message}`, err);
                    const pubSubClient = new PubSubClient(this.errorTopic);
                    attributes.errorMessage =  err.message;
                    attributes.errorStack = err.stack
                    return await pubSubClient.publishProcessMessage(data, processor.getName(), attributes);
                }
            });
    }
}