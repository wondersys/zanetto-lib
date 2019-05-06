import 'mocha';
import { expect } from 'chai';
import { NoopProcessor } from '../src/noop-processor';
import { ProcessMessage } from '../src/interfaces/process-message';

describe('Noop Processor', () => {

    beforeEach(() => {

    });
    afterEach(() => {

    });

    it('Test Handle Message', (done) => {
        const processor = new NoopProcessor();
        const message: ProcessMessage = {
            files: [],
            data: {},
            status: 'start',
            rule: {
                conditions: [],
                process: [
                    {
                        processorName: 'start',
                        next: ['no-op'],
                        config: {}
                    },
                    {
                        processorName: "no-op",
                        next: [],
                        config: {}
                    }
                ]
            }
        };
        
        processor.processMessage(message)
            .then(ret => {
                expect(ret).not.to.be.null;
                expect(ret).to.be.eql(message);
                // @ts-ignore
                expect(ret.status).to.be.a('string').equal(processor.getName());
                done();
            })
            .catch(done);


    });

    it('Test Skip Message', (done) => {
        const processor = new NoopProcessor();
        const message: ProcessMessage = {
            files: [],
            data: {},
            status: 'start',
            rule: {
                conditions: [],
                process: [
                    {
                        processorName: 'start',
                        next: ['send-mail'],
                        config: {}
                    },
                    {
                        processorName: 'send-mail',
                        next: ['no-op'],
                        config: {}
                    },
                    {
                        processorName: 'no-op',
                        next: [],
                        config: {}
                    }
                ]
            }
        };
        
        processor.processMessage(message)
            .then(ret => {
                expect(ret).to.be.null;
                done();
            })
            .catch(done);


    });

    it('Test Message Exception', () => {
        const processor = new NoopProcessor();
        const message: ProcessMessage = {
            files: [],
            data: {},
            status: 'start',
            rule: {
                conditions: [],
                process: []
            }
        };
        
        return processor.processMessage(message)
            .then(ret => {
                expect.fail('An exception was expected to be thrown');
            })
            .catch((err) => {
                expect(err.message).to.be.equal('Processor no-op failed to process message, because of Step is missing for status start. Who did send this message?');
            });
    });

});