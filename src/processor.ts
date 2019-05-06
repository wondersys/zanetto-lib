import { ProcessMessage } from "./interfaces/process-message";
import { Rule } from "./interfaces/rule";
import { config } from 'firebase-functions';

export abstract class Processor {

    private globalConfig: config.Config;

    constructor(private filter?: Filter) {
        this.globalConfig = config();
    }

    get config(): config.Config {
        return this.globalConfig;
    }

    public abstract getName(): string;

    protected abstract async handleMessage(message: ProcessMessage): Promise<ProcessMessage>;

    public async processMessage(message: ProcessMessage): Promise<ProcessMessage | null> {
        try {
            if (!this.isMyTurn(message.rule, message.status)) {
                return Promise.resolve(null);
            }
            if (this.filter && !this.filter.check(message)) {
                return Promise.resolve(null);
            }
            message.status = this.getName();
            return this.handleMessage(message);
        } catch (err) {
            throw new Error(`Processor ${this.getName()} failed to process message, because of ${err.message}`);
        }
    }

    protected isMyTurn(rule: Rule, status: string): boolean {
        if (!rule) throw new Error(`Cannot check step because rule is missing`);
        if (!rule.process || !Array.isArray(rule.process)) throw new Error(`Cannot check step because process list is missing`);
        if (!status) throw new Error(`Cannot check step because status is missing`);
        const step = rule.process.find(p => p.processorName === status);
        if (!step) throw new Error(`Step is missing for status ${status}. Who did send this message?`);
        return (step.next.includes(this.getName()));
    }

}

/**
 * Custom filtering logic
 */
export abstract class Filter {
    public abstract check(message: ProcessMessage): boolean;
}