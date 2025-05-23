export interface RegisterReq {
    name:      string;
    last_name: string;
    email:     string;
    password:  string;
    salary:    number;
}


export interface RecoverPassReq {
    email:  string;
    password: string;
}