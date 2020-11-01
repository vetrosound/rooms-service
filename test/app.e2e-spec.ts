import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import * as request from 'supertest';

import { RootModule } from './../src/root.module';
import { Room } from '../src/rooms/dto/room.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let client: MongoClient;
  const room: Room = {
    name: 'room-name',
    owner: 'room-owner',
    type: 'room-type',
    managers: [],
    created: new Date(),
    lastUpdated: new Date(),
    isActive: true,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RootModule],
    })
      .overrideProvider('MONGODB_CONNECTION')
      .useFactory({
        factory: async (): Promise<Db> => {
          client = await MongoClient.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            auth: {
              user: process.env.MONGO_USER,
              password: process.env.MONGO_PASSWORD,
            },
            authMechanism: 'DEFAULT',
          });
          return client.db('db');
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await client.close();
    await app.close();
  });

  it('should create, find, update, and delete rooms', async done => {
    const server = app.getHttpServer();
    const updatedManagers = ['new-manager'];
    const updatedType = 'new-type';

    // create a room
    let result = await request(server)
      .post('/rooms')
      .send(room);
    expect(result.status).toBe(201);
    expect(result.body).toBeDefined();
    const created: Room = result.body;
    expect(created.name).toBeTruthy();
    expect(created.owner).toBe(room.owner);
    expect(created.type).toBe(room.type);
    expect(created.managers).toEqual(room.managers);
    expect(created.created).toBeTruthy();
    expect(created.lastUpdated).toBeTruthy();
    expect(created.isActive).toBe(true);

    // lookup the room
    result = await request(server).get(`/rooms/${created.name}`);
    expect(result.status).toBe(200);
    expect(result.body).toEqual(created);

    // update the room
    result = await request(server)
      .put('/rooms')
      .send({
        name: created.name,
        managers: updatedManagers,
        type: updatedType,
        isActive: false,
      });
    expect(result.status).toBe(200);
    expect(result.text).toBe('1');

    // verify room was updated
    result = await request(server).get(`/rooms/${created.name}`);
    expect(result.status).toBe(200);
    expect(result.body.managers).toEqual(updatedManagers);
    expect(result.body.type).toBe(updatedType);
    expect(result.body.isActive).toBe(false);

    // delete the room
    result = await request(server).delete(`/rooms/${created.name}`);
    expect(result.status).toBe(200);
    expect(result.text).toEqual('1');

    // verify room was deleted
    result = await request(server).get(`/rooms/${created.name}`);
    expect(result.status).toBe(404);

    done();
  });
});
