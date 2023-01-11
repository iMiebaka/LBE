import { Model } from 'objection';

class HotWireTransaction extends Model {
    id!: string
    user_id!: string;
    status!: string;
    reciever!: string;
    reciever_id!: string;
    // otp!: number;
    amount!: number;
    created_at!: Date;
    updated_at!: Date;

    static get tableName() {
        return 'hot_wire_transaction';
    }
}
export default HotWireTransaction