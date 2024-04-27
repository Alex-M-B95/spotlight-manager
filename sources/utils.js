export class Constants {
    static get moduleName() { return 'spotlight-manager'}
    
    static get updateTriggerHookName() { return `${this.moduleName}.hooks.update-trigger` }
    
    static isDebugMode = true
}

export function log(...args) {
    if (Constants.isDebugMode) {
        console.log(`[${Constants.moduleName}]`, ...args)    
    }
}
