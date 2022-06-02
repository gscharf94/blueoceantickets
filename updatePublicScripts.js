import { readdirSync, watch } from 'fs';
import { exec } from 'child_process';

let files = readdirSync('./public/scripts');
const PATH = "/mnt/4AB454E6B454D653/Users/Gustavo/Google Drive/locate stuff/blueocean/reporter/";

// comment

// for (const file of files) {
//   // exec(`tsc`, { cwd: `${PATH}/public/scripts` });
//   exec(`echo $PWD`, { cwd: `${PATH}/public/scripts` }, (err, out, err2) => {
//     if (err) {
//       console.log('1')
//       console.log(err);
//     }
//     if (out) {
//       console.log('2')
//       console.log(out);
//     } if (err2) {
//       console.log('3')
//       console.log(err2);
//     }
//   });
// }
exec(`tsc`, { cwd: `${PATH}/public/scripts` }, (err, out, err2) => {
  if (err) {
    console.log(err);
  }
  if (out) {
    console.log(out);
  }
  if (err2) {
    console.log(err2);
  }
});

console.log(`updated public/scripts`);