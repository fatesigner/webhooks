import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { HelperModule } from '../helper/helper.module';

@Module({
  imports: [HelperModule],
  controllers: [GithubController],
  providers: []
})
export class GithubModule {}
