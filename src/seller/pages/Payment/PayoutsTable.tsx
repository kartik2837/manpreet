// import {
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import React from "react";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { type Order, type OrderItem } from "../../../types/orderTypes";
// import { fetchPayoutsBySeller } from "../../../Redux Toolkit/Seller/payoutSlice";

// const PayoutsTable = () => {
//   const { sellerOrder } = useAppSelector((store) => store);
//   const dispatch = useAppDispatch();

//   React.useEffect(() => {
//     dispatch(fetchPayoutsBySeller(localStorage.getItem("jwt") || ""));
//   }, [dispatch]);

//   return (
//     <div>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 700 }} aria-label="customized table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Commission</TableCell>
//               <TableCell>Net Earnings</TableCell>
//               <TableCell align="right">Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {sellerOrder.orders.map((item: Order) => (
//               <TableRow key={item._id}>
//                 <TableCell align="left">{item.orderDate ? new Date(item.orderDate).toLocaleDateString() : item._id}</TableCell>
//                 <TableCell component="th" scope="row">
//                   <div className="flex gap-1 flex-wrap">
//                     {item.orderItems.map((orderItem: OrderItem) => (
//                       <div key={orderItem._id} className="flex gap-5">
//                         <img
//                           className="w-20 rounded-md"
//                           src={orderItem.product.images[0]}
//                           alt=""
//                         />
//                         <div className="flex flex-col justify-between py-2">
//                           <h1>Title: {orderItem.product.title}</h1>
//                           <h1>Price: ₹{orderItem.product.sellingPrice}</h1>
//                           <h1>Color: {orderItem.product.color}</h1>
//                           <h1>Size: {orderItem.size}</h1>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   {item.orderStatus === 'DELIVERED' ? (
//                     `₹${item.commissionAmount !== undefined ? item.commissionAmount : Math.round((item.totalSellingPrice || 0) * 0.10)}`
//                   ) : (
//                     <span className="text-gray-400 italic">Pending</span>
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {item.orderStatus === 'DELIVERED' ? (
//                     `₹${item.sellerAmount !== undefined ? item.sellerAmount : (item.totalSellingPrice || 0) - (item.commissionAmount !== undefined ? item.commissionAmount : Math.round((item.totalSellingPrice || 0) * 0.10))}`
//                   ) : (
//                     <span className="text-gray-400 italic">Pending</span>
//                   )}
//                 </TableCell>
//                 {/* <TableCell>
//                   <div className='flex flex-col gap-y-2'>
//                     <h1>{item.shippingAddress.name}</h1>
//                     <h1>{item.shippingAddress.address}, {item.shippingAddress.city}</h1>
//                     <h1>{item.shippingAddress.state} - {item.shippingAddress.pinCode}</h1>
//                     <h1><strong>Mobile:</strong> {item.shippingAddress.mobile}</h1>
//                   </div>
//                 </TableCell> */}
//                 {/* <TableCell 
//                  sx={{color:orderStatusColor[item.orderStatus].color}} 
//                  align="center"> <Box sx={{borderColor:orderStatusColor[item.orderStatus].color}}  className={`border px-2 py-1 rounded-full text-xs`}>
//                   {item.orderStatus}</Box> 
//                  </TableCell> */}
//                 {/* <TableCell align="right">
//                   <Button
//                     size='small'
//                     onClick={(e) => handleClick(e, item._id)}
//                     color='primary'
//                     className='bg-primary-color'>
//                     Status
//                   </Button>
//                   <Menu
//                     id={`status-menu ${item._id}`}
//                     anchorEl={anchorEl[item._id]}
//                     open={Boolean(anchorEl[item._id])}
//                     onClose={() => handleClose(item._id)}
//                     MenuListProps={{
//                       'aria-labelledby': `status-menu ${item._id}`,
//                     }}
//                   >
//                     {orderStatus.map((status) =>
//                       <MenuItem 
//                       key={status.label} 
//                       onClick={() => handleUpdateOrder(item._id, status.label)}>
//                         {status.label}</MenuItem>
//                     )}
//                   </Menu>
//                 </TableCell> */}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default PayoutsTable;











import React, { useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchSellerPayouts } from '../../../Redux Toolkit/Seller/payoutSlice';
import { type Payouts } from '../../../types/payoutsType';

const PayoutsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { payouts, loading, error } = useAppSelector((state) => state.payouts);

  const loadPayouts = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) dispatch(fetchSellerPayouts(jwt));
  };

  useEffect(() => {
    loadPayouts();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
        <Button startIcon={<RefreshIcon />} onClick={loadPayouts} size="small" sx={{ ml: 2 }}>
          Retry
        </Button>
      </div>
    );
  }

  const payoutsList = Array.isArray(payouts) ? payouts : [];

  if (payoutsList.length === 0) {
    return (
      <Paper className="p-4 text-center text-gray-500">
        No payout requests yet.
        <Button startIcon={<RefreshIcon />} onClick={loadPayouts} size="small" sx={{ ml: 2 }}>
          Refresh
        </Button>
      </Paper>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button startIcon={<RefreshIcon />} onClick={loadPayouts} size="small">
          Refresh
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Requested On</TableCell>
              <TableCell>Amount (₹)</TableCell>
              <TableCell>Commission (₹)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Paid On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payoutsList.map((payout: Payouts) => (
              <TableRow key={payout._id}>
                <TableCell>
                  {payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>₹{payout.amount}</TableCell>
                <TableCell>₹{payout.commissionAmount || 0}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payout.status === 'SUCCESS'
                        ? 'bg-green-100 text-green-800'
                        : payout.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payout.status}
                  </span>
                </TableCell>
                <TableCell>
                  {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PayoutsTable;
