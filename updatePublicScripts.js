import { readdirSync, watch } from 'fs';
import { exec } from 'child_process';

let files = readdirSync('./public/scripts');
const PATH = "/mnt/4AB454E6B454D653/Users/Gustavo/Google Drive/locate stuff/blueocean/reporter/";


for (const file of files) {
  exec(`tsc "${PATH}/public/scripts/${file}"`);
}

console.log(`updated public/scripts`);