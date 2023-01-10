import { Model } from 'objection';

class HotData extends Model {
    id!: string
    user_id!: string;
    status!: string;
    reciever!: string;
    reciever_id!: string;
    otp!: number;
    amount!: number;
    created_at!: Date;
    updated_at!: Date;

    static get tableName() {
        return 'hot_data';
    }
}
export default HotData