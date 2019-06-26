import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    logger: true
  });

  app.use(
    bodyParser.xml({
      xmlParseOptions: {
        // 始终返回数组。默认情况下只有数组元素数量大于 1 是才返回数组。
        explicitArray: false
      }
    })
  );

  const server = await app.listen(3001);

  // 设置超时时间 30 Min
  server.setTimeout(30 * 60 * 1000);
}
bootstrap();
