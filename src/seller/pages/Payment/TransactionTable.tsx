// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { fetchTransactionsBySeller } from "../../../Redux Toolkit/Seller/transactionSlice";
// import { type Transaction } from "../../../types/Transaction";
// import { redableDateTime } from "../../../util/redableDateTime";

// export default function TransactionTable() {
//   const { transaction } = useAppSelector((store) => store);
//   const dispatch = useAppDispatch();

//   React.useEffect(() => {
//     dispatch(fetchTransactionsBySeller(localStorage.getItem("jwt") || ""));
//   }, [dispatch]);

//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 700 }}>
//         <TableHead>
//           <TableRow>
//             <TableCell>Date</TableCell>
//             <TableCell>Customer Details</TableCell>
//             <TableCell>Order</TableCell>
//             <TableCell align="right">Amount</TableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {transaction.transactions
//             ?.filter((item: any) => item) // safety
//             ?.map((item: Transaction) => (
//               <TableRow key={item?._id}>
//                 {/* DATE */}
//                 <TableCell align="left">
//                   <div className="space-y-1">
//                     <h1 className="font-medium">
//                       {item?.date
//                         ? redableDateTime(item.date).split("at")[0]
//                         : "-"}
//                     </h1>
//                     <h1 className="text-xs text-gray-600 font-semibold">
//                       {item?.date
//                         ? redableDateTime(item.date).split("at")[1]
//                         : "-"}
//                     </h1>
//                   </div>
//                 </TableCell>

//                 {/* CUSTOMER */}
//                 <TableCell>
//                   <div className="space-y-2">
//                     <h1>{item?.customer?.fullName || "-"}</h1>
//                     <h1 className="font-semibold">
//                       {/* {item?.customer?.email || "-"} */}
//                     </h1>
//                     {/* <h1 className="font-bold text-gray-600">
//                       {item?.customer?.mobile || "-"}
//                     </h1> */}
//                   </div>
//                 </TableCell>

//                 {/* ORDER */}
//                 <TableCell>
//                   Order Id :{" "}
//                   <strong>{item?.order?._id || "-"}</strong>
//                 </TableCell>

//                 {/* AMOUNT */}
//                 <TableCell align="right">
//                   ₹{item?.order?.totalSellingPrice || 0}
//                 </TableCell>
//               </TableRow>
//             ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }





















import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchTransactionsBySeller } from "../../../Redux Toolkit/Seller/transactionSlice";
import { type Transaction } from "../../../types/Transaction";
import { redableDateTime } from "../../../util/redableDateTime";

export default function TransactionTable() {
  const { transaction } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = React.useState<"all" | "delivered">("delivered"); // default delivered

  React.useEffect(() => {
    dispatch(fetchTransactionsBySeller(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  // Filter transactions based on dropdown
  const filteredTransactions = React.useMemo(() => {
    const transactions = transaction.transactions || [];
    if (filter === "delivered") {
      return transactions.filter(
        (item: Transaction) => item?.order?.orderStatus === "DELIVERED"
      );
    }
    return transactions; // all orders
  }, [transaction.transactions, filter]);

  return (
    <Box>
      {/* Dropdown for filtering */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="order-filter-label">Show Orders</InputLabel>
          <Select
            labelId="order-filter-label"
            value={filter}
            label="Show Orders"
            onChange={(e) => setFilter(e.target.value as "all" | "delivered")}
          >
            <MenuItem value="all">All Orders</MenuItem>
            <MenuItem value="delivered">Completed Payments (Delivered)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Customer Details</TableCell>
              <TableCell>Order</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((item: Transaction) => (
                <TableRow key={item?._id}>
                  {/* DATE */}
                  <TableCell align="left">
                    <div className="space-y-1">
                      <h1 className="font-medium">
                        {item?.date
                          ? redableDateTime(item.date).split("at")[0]
                          : "-"}
                      </h1>
                      <h1 className="text-xs text-gray-600 font-semibold">
                        {item?.date
                          ? redableDateTime(item.date).split("at")[1]
                          : "-"}
                      </h1>
                    </div>
                  </TableCell>

                  {/* CUSTOMER */}
                  <TableCell>
                    <div className="space-y-2">
                      <h1>{item?.customer?.fullName || "-"}</h1>
                    </div>
                  </TableCell>

                  {/* ORDER */}
                  <TableCell>
                    Order Id : <strong>{item?.order?._id || "-"}</strong>
                  </TableCell>

                  {/* AMOUNT */}
                  <TableCell align="right">
                    ₹{item?.order?.totalSellingPrice || 0}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
