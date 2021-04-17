import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { createClient } from '@astrajs/collections';

const connectionFactory = {
  provide: 'DATASTAX',
  useFactory: async () => {
    let options = {};

    if (process.env.STARGATE_URL) {
      options = {
        baseUrl: process.env.STARGATE_URL,
        baseApiPath: process.env.STARGATE_BASE_API_PATH,
        authToken: process.env.STARGATE_AUTHTOKEN,
      };
    } else {
      options = {
        astraDatabaseId: process.env.ASTRA_DB_ID,
        astraDatabaseRegion: process.env.ASTRA_DB_REGION,
        applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN,
      };
    }
    return await createClient(options);
  },
};

@Module({
  controllers: [GithubController],
  providers: [connectionFactory, GithubService],
})
export class GithubModule {}
