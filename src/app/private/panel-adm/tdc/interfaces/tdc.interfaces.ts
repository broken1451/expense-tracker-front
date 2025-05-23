export interface TDCInterface {
    creditCards: CreditCard[];
    totalCreditCards: number;
    countsTotalcreditCards: number;
}

export interface CreditCard {
    _id: string;
    name: string;
    creditLimit: number;
    annualInterestRate: number;
    dueDate: Date | string | any;
    grantDate: Date | string | any;
    isActive: boolean;
    user: string;
    transaction: Transaction[];
    created_at: Date;
    update_at: Date;
}

export interface Transaction {
    tarjeta: string;
    description: string;
    totalAmount: number;
    dayBuy: Date | string | any;
    installments: number;
    interestPurchase: number;
    installmentAmount: number;
    totalInterestPerInstallment: number;
    nextPayment: Date | string | any;
    state: State;
    _id?: string;
}

export interface State {
    state: string;
    pending: number;
    paid: number;
}


export interface CreateTDCReq {
    name: string;
    creditLimit: number;
    annualInterestRate: number;
    dueDate: Date;
    grantDate: Date;
    user: string;
}

export interface UpdateTDCReq {
    id?: string;
    name: string;
    creditLimit: number;
    annualInterestRate: number;
    dueDate: Date;
    grantDate: Date;
    user: string;
}


export interface ResponseDeletedTdc {
    _id:                string;
    name:               string;
    creditLimit:        number;
    annualInterestRate: number;
    dueDate:            Date;
    grantDate:          Date;
    isActive:           boolean;
    user:               string;
    transaction:        any[];
    created_at:         Date;
    update_at:          Date;
    __v:                number;
}
