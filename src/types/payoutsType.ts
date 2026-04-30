
// import {type Seller } from "./sellerTypes";
// import {type Transaction } from "./Transaction";


// export interface Payouts {
//   _id: number;
//   transactions: Transaction[];
//   seller: Seller;
//   amount: number;
//   status: "PENDING" | "SUCCESS" | "REJECTED";
//   date: string;
// }






 import {type Seller } from "./sellerTypes";
 import {type Transaction } from "./Transaction";

export interface Payouts {
  _id: string;
  seller: Seller;
  subOrder?: string | null;
  amount: number;
  commissionAmount: number;
  status: "PENDING" | "SUCCESS" | "REJECTED";
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  transactions?: Transaction[];
}
