export interface LoginReq {
    email:    string;
    password: string;
}


export interface LoginResponse {
    ok:    boolean;
    user:  User;
    token: string;
}

export interface User {
    _id:             string;
    name:            string;
    last_name:       string;
    email:           string;
    roles:           string[];
    isActive:        boolean;
    retry:           number;
    created_at:      Date;
    update_at:       Date;
    update_at_login: Date;
    google?:         boolean;
    salary:          number;
}
