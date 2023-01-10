import { Model } from 'objection';

class Wallet extends Model {
    id!: string
    user_id!: string
    amount!: number;
    account_number!: number;
    created_at!: Date;
    updated_at!: Date;

    static get tableName() {
        return 'wallet';
    }


}
export default Wallet;