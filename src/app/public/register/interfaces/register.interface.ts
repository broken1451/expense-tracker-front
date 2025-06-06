export interface ResponseUserCreated {
    returnUserCreated: ReturnUserCreated;
    token:             string;
}

export interface ReturnUserCreated {
    _id:             string;
    name:            string;
    last_name:       string;
    email:           string;
    roles:           string[];
    isActive:        boolean;
    retry:           number;
    salary:          number;
    created_at:      Date;
    update_at:       Date;
    update_at_login: Date;
}
