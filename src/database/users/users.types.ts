import { Document, Model } from 'mongoose';

import { IGameDocument } from './../games/games.types';

export interface IUser {
  userId: number;
  firstName: string;
  lastName?: string;
  userName?: string;
  subscriptions?: Array<IGameDocument>;
  dateOfEntry?: Date;
  dateOfRegistry?: Date;
  lastUpdated?: Date;
}

export interface IUserDocument extends IUser, Document {
  setLastUpdated: (this: IUserDocument) => Promise<void>;
}

export interface IUserModel extends Model<IUserDocument> {
  findByUserName: (this: IUserModel, userName: string) => Promise<IUserDocument[]>;
  findOneOrCreate: (
    this: IUserModel,
    { userId, userName, firstName }: { userId: number; userName?: string; firstName?: string },
  ) => Promise<IUserDocument>;
}
