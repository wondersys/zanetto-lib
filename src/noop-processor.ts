import { Processor } from "./processor";
import { ProcessMessage } from "./interfaces/process-message";

export class NoopProcessor extends Processor {
    public getName(): string {
        return "no-op"
    } 
    
    protected handleMessage(message: ProcessMessage): Promise<ProcessMessage> {
        return Promise.resolve(message);
    }


}