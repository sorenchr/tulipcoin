export class Logger {
    private namespace: string;

    constructor(namespace: string) {
        this.namespace = namespace;
    }

    debug(msg: string) {
        this.log('debug', msg);
    }

    info(msg: string) {
        this.log('info', msg);
    }

    warn(msg: string) {
        this.log('warn', msg);
    }
    
    error(msg: string) {
        this.log('error', msg);
    }

    /**
     * Logs a message to the console with a timestamp.
     * @param msg The message to log.
     */
    private log(level: string, msg: string) {
        let timestamp = '\x1b[2m' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\x1b[0m';
        let coloredLevel = this.getColoredLevel(level);
        let namespace = '\x1b[90m' + this.namespace + '\x1b[0m';
        console.log(`  [${timestamp}][${coloredLevel}][${namespace}] ${msg}`);
    }

    /**
     * Return a colored level according to its severity.
     * @param level The level to color.
     */
    private getColoredLevel(level: string) {
        switch(level) {
            case "debug":
                return '\x1b[33m' + level + '\x1b[0m';
            case "info":
                return '\x1b[32m' + level + '\x1b[0m';
            case "warn":
                return '\x1b[35m' + level + '\x1b[0m';
            case "error":
                return '\x1b[31m' + level + '\x1b[0m';
        }
    }
}