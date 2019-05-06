import { Rule } from "./rule";

export interface ProcessMessage {
    files: any[],
    rule: Rule,
    status: string,
    data: any[]
}