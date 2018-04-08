/**
 * Kills the running process with an error.
 * @param msg The message to display to the user before exiting.
 */
export function exitWithMessage(msg): void {
    console.log(msg);
    process.exit(1);
}