import { Model } from 'objection';

class Statement extends Model {
  id!: string
  description!: string;
  user_id!: string;
  created_at!: Date;
  updated_at!: Date;
  
  static get tableName() {
    return 'statement';
  }
}
export default Statement