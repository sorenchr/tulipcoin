import * as fs from 'fs';

// Look for a config in the current working directory
let path = process.cwd() + '/tulipconfig.json';
export const config = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf8')) : {};