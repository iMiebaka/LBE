import { Model } from 'objection';
import Wallet from './Wallet';

class User extends Model {
  id!: string
  public_id!: string;
  first_name!: string;
  pin!: string;
  last_name!: string;
  password!: string;
  email!: string;
  created_at!: Date;
  updated_at!: Date;
  
  static get tableName() {
    return 'users';
  }

    static get relationMappings() {
      return {
        channel: {
          relation: Model.BelongsToOneRelation,
          modelClass: Wallet,
          join: {
            from: 'user.user_id',
            to: 'user.id',
          },
        },
      };
    }
}
export default User;