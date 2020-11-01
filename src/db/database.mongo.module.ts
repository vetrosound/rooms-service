import { Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'MONGODB_CONNECTION',
      useFactory: async (): Promise<Db> => {
        const client = await MongoClient.connect(process.env.MONGO_URL, {
          useUnifiedTopology: true,
          auth: {
            user: process.env.MONGO_USER,
            password: process.env.MONGO_PASSWORD,
          },
          authMechanism: 'DEFAULT',
        });
        return client.db('db');
      },
    },
  ],
  exports: ['MONGODB_CONNECTION'],
})
export class MongoDBModule {}
