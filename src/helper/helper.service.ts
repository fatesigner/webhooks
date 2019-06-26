import { Injectable } from '@nestjs/common';

const shell = require('shelljs');

@Injectable()
export class HelperService {
  execShellCommand(cmd, cwd?) {
    if (cwd) {
      shell.cd(cwd);
    }
    return new Promise((resolve, reject) => {
      shell.exec(cmd, (code, stdout, stderr) => {
        if (stdout) {
          // console.log('shell.exec output:', stdout);
        }

        if (stderr) {
          // console.log('shell.exec stderr:', stderr);
        }

        if (code !== undefined) {
          console.log('shell exec Exit code:', code);
          if (code === 0) {
            resolve(code);
          } else {
            reject(code);
          }
        }
      });
    });
  }
}
