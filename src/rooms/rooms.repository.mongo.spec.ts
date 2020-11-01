import { Test, TestingModule } from '@nestjs/testing';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { RoomsRepository } from './rooms.repository.mongo';
import { MongoDBModule } from '../db/database.mongo.module';
import { RoomDao } from './dao/room.dao';

describe('RoomsRepository', () => {
  let service: RoomsRepository;
  const testRoom: RoomDao = {
    _id: 'room-name',
    owner: 'room-owner',
    type: 'room-type',
    managers: [],
    created: new Date(),
    lastUpdated: new Date(),
    isActive: true,
  };
  const mockCollection = {
    findOne: jest.fn(() => of(testRoom)),
    insertOne: jest.fn(() => of({ insertedCount: 1, ops: [testRoom] })),
    updateOne: jest.fn(() => of({ modifiedCount: 1 })),
    deleteOne: jest.fn(() => of({ deletedCount: 1 })),
  };
  const dbMock = {
    collection: () => mockCollection,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [RoomsRepository, Logger, ConfigService],
      imports: [MongoDBModule],
    })
      .overrideProvider('MONGODB_CONNECTION')
      .useFactory({
        factory: async () => dbMock,
      })
      .compile();

    service = app.get<RoomsRepository>(RoomsRepository);
  });

  describe('findOne', () => {
    it('should return existing user', async () => {
      const found = await service.findOne(testRoom._id).toPromise();
      expect(found).toEqual(testRoom);
    });
  });

  describe('create', () => {
    it('should return created user', async () => {
      const created = await service.create(testRoom).toPromise();
      expect(created).toEqual(testRoom);
    });
  });

  describe('update', () => {
    it('should return 1 as updated count', async () => {
      const updatedCount = await service.update(testRoom).toPromise();
      expect(updatedCount).toEqual(1);
    });
  });

  describe('delete', () => {
    it('should return 1 as deleted count', async () => {
      const deletedCount = await service.delete(testRoom._id).toPromise();
      expect(deletedCount).toEqual(1);
    });
  });
});
