import {
  exec
} from 'child_process';

const PATH = "/home/gustavo/Documents/programmingStuff/sites/blueoceantickets/";

exec(`tsc`, {
  cwd: `${PATH}/public/scripts`
}, (err, out, err2) => {
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
