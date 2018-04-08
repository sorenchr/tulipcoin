/**
 * Logs a message to the console with a timestamp.
 * @param msg The message to log.
 */
export function log(msg) {
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(`[${timestamp}] ${msg}`);
}