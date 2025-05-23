export interface UserResponse {
    users:      User[];
    totalUser:  number;
    userLenght: number;
}

export interface User {
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


export interface UserFormReq {
    name: string | null;
    last_name: string | null;
    email: string | null;
    password: string | null;
    salary: number | null;
    roles: string[];
}

export interface ResponseCreatedUser {
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


export interface UpdateReqUser {
    name:      string;
    last_name: string;
    email:     string;
    salary:    number;
    roles?: string[];
}

export interface ResponseUpdateUser {
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


export interface UserDeletedResponse {
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
