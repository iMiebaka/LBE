import { Model } from 'objection';

class User extends Model {
  id!: string
  public_id!: string;
  first_name!: string;
  last_name!: string;
  password!: string;
  email!: string;
  created_at!: Date;
  updated_at!: Date;
  
  static get tableName() {
    return 'users';
  }

  //   static get relationMappings() {
  //     const Channel = require('./channel');
  //     return {
  //       channel: {
  //         relation: Model.BelongsToOneRelation,
  //         modelClass: Channel,
  //         join: {
  //           from: 'user.channelId',
  //           to: 'channel.id',
  //         },
  //       },
  //     };
  //   }
}
export default User;