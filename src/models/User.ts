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
      wallet: {
        relation: Model.BelongsToOneRelation,
        modelClass: Wallet,
        filter: (query: any) => query.select('account_number'),
        join: {
          from: 'users.id',
          to: 'wallet.user_id',
        },
      },
      wallet_self: {
        relation: Model.BelongsToOneRelation,
        modelClass: Wallet,
        filter: (query: any) => query.select('account_number', 'amount'),
        join: {
          from: 'users.id',
          to: 'wallet.user_id',
        },
      },
    };
  }
}
export default User;