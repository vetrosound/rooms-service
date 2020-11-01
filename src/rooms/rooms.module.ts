import { Module, Logger } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsRepository } from './rooms.repository.mongo';
import { MongoDBModule } from '../db/database.mongo.module';

@Module({
  imports: [MongoDBModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository, Logger],
})
export class RoomsModule {}
