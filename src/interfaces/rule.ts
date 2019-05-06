
export interface Rule {
    name: string,
    conditions: any[],
    process: ProcessItem[],
}

export interface ProcessItem {
    processorName: string,
    next: string[],
    config: any
}