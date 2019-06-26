import to from 'await-to-js';
import { Body, Controller, Headers, HttpCode, Post, Query, UnauthorizedException } from '@nestjs/common';

import { IGithubHooks } from './github.interface';
import { HelperService } from '../helper/helper.service';

const fs = require('fs');
const crypto = require('crypto');

@Controller('github')
export class GithubController {
  secret = 'nPkbKBe2pjtsbRhvXAjHTPYeC';
  repoPath = '/home/repos';

  constructor(private helperService: HelperService) {
  }

  @Post()
  @HttpCode(200)
  async post(@Query() query: { script: string }, @Body() repo: IGithubHooks, @Headers() headers) {
    const sig = 'sha1=' + crypto.createHmac('sha1', this.secret).update(JSON.stringify(repo)).digest('hex');

    console.log(sig);

    if (Object.prototype.hasOwnProperty.call(headers, 'x-hub-signature') && headers['x-hub-signature'] == sig) {
      this.action(query, repo).catch((err) => {
        console.log(err);
      });

      // 验证通过后，直接返回 200
      return 200;
    }

    throw new UnauthorizedException('Invalid token.');
  }

  async action(query: { script: string }, repo: IGithubHooks) {
    const path = `${this.repoPath}/${repo.repository.name}`;
    console.log(path);

    if (fs.existsSync(path)) {
      // 项目已存在，拉取
      console.log(`Running: git fetch --all && git reset --hard origin/master && git pull`);
      const [err] = await to(this.helperService.execShellCommand(`git fetch --all && git reset --hard origin/master && git pull && npm install`, path));

      if (err) {
        throw err;
      } else {
        if (query.script) {
          console.log(`Running: npm install && npm run ${query.script}`);
          const [err] = await to(this.helperService.execShellCommand(`npm run ${query.script}`, path));
          if (err) {
            throw err;
          }
        }
      }
    } else {
      // 项目不存在，克隆
      console.log(`Running: git clone ${repo.repository.ssh_url} ./${repo.repository.name}`);
      const [err] = await to(this.helperService.execShellCommand(`git clone ${repo.repository.ssh_url} ./${repo.repository.name}`, this.repoPath));

      if (err) {
        throw err;
      } else {
        if (query.script) {
          console.log(`Running: npm install && npm run ${query.script}`);
          const [err] = await to(this.helperService.execShellCommand(`npm install && npm run ${query.script}`, path));
          if (err) {
            throw err;
          }
        }
      }
    }
  }
}
