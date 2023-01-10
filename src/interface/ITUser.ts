interface ITUser {
    id: string;
    public_id: string;
    first_name: string;
    last_name: string;
    password: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export default ITUser