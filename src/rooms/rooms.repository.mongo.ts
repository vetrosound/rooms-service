import {
  Injectable,
  Inject,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Db } from 'mongodb';
import { omit, omitBy } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomDao } from './dao/room.dao';

@Injectable()
export class RoomsRepository {
  private collectionName: string;

  constructor(
    @Inject('MONGODB_CONNECTION') private db: Db,
    private log: Logger,
    private config: ConfigService,
  ) {
    this.log.setContext(RoomsRepository.name);
    this.collectionName = this.config.get<string>('DB_COLLECTION');
  }

  findOne(_id: string): Observable<RoomDao> {
    return from(this.db.collection(this.collectionName).findOne({ _id })).pipe(
      map(result => {
        if (!result) {
          throw new NotFoundException(`Room with id ${_id} not found.`);
        }
        return result;
      }),
    );
  }

  create(room: RoomDao): Observable<RoomDao> {
    const now = new Date();
    room.created = now;
    room.lastUpdated = now;
    room.isActive = true;
    return from(this.db.collection(this.collectionName).insertOne(room)).pipe(
      map(result => {
        const { insertedCount, ops } = result;
        if (insertedCount < 1) {
          throw new InternalServerErrorException('Failed to create room.');
        }
        return ops[0];
      }),
    );
  }

  update(withUpdates: RoomDao): Observable<number> {
    const _id = withUpdates._id;
    withUpdates.lastUpdated = new Date();
    const filteredEntity = omitBy(
      omit(withUpdates, 'created', '_id'),
      prop => prop === undefined,
    );
    return from(
      this.db
        .collection(this.collectionName)
        .updateOne({ _id }, { $set: filteredEntity }),
    ).pipe(
      map(result => {
        if (result.modifiedCount < 1) {
          throw new NotFoundException(`Room with id ${_id} not found.`);
        }
        return result.modifiedCount;
      }),
    );
  }

  delete(_id: string): Observable<number> {
    return from(
      this.db.collection(this.collectionName).deleteOne({ _id }),
    ).pipe(map(result => result.deletedCount));
  }
}
