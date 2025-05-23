export interface ExpenseResponse {
    expenses:      Expense[];
    totalExpenses: number;
    userLenght:    number;
    totalIngress:    number;
}

export interface Expense {
    _id:         string;
    description: string;
    category:    string;
    amount:      number;
    date:        Date | string | any;
    totalAmount: number;
    totalIncome: number;
    balance:     number;
    user:        string;
    created_at:  Date;
    update_at:   Date;
}


export interface ReqAddExpense {
    description: string;
    category:    string;
    amount:      number;
    date:        Date | string;
    user:        string;
    totalAmount?: number;
    totalIncome?: number;
    balance?:     number;
}

export interface ReqUpdateExpense {
    description: string;
    category:    string;
    amount:      number;
}

export interface ResponsePatchExpense {
    _id:         string;
    description: string;
    category:    string;
    amount:      number;
    date:        Date;
    user:        string;
    created_at:  Date;
    update_at:   Date;
    __v:         number;
}

export interface ExpenseResponseCreated {
    description: string;
    category:    string;
    amount:      number;
    date:        Date;
    totalAmount: number;
    totalIncome: number;
    balance:     number;
    user:        string;
    _id:         string;
    created_at:  Date;
    update_at:   Date;
    __v:         number;
}
