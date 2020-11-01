import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    RoomsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class RootModule {}
