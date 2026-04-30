// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import {
//   fetchAdminPayouts,
//   fetchPayoutSummary,
//   updatePayoutStatus,
// } from "../../../Redux Toolkit/Admin/payoutSlice";
// import { api } from "../../../Config/Api";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Select,
//   MenuItem,
//   Tabs,
//   Tab,
//   Box,
//   Button,
//   CircularProgress,
//   Typography,
// } from "@mui/material";

// const AdminPayoutsTable = () => {
//   const dispatch = useAppDispatch();
//   const { payouts, summary, loading, error } = useAppSelector(
//     (store) => store.adminPayouts
//   );

//   const [tab, setTab] = useState(0);

//   const payoutsArray = Array.isArray(payouts) ? payouts : [];
//   const summaryArray = Array.isArray(summary) ? summary : [];

//   useEffect(() => {
//     dispatch(fetchAdminPayouts());
//     dispatch(fetchPayoutSummary());
//   }, [dispatch]);

//   // Create payout
//   const createPayout = async (seller: any) => {
//     if (!seller.monthly || seller.monthly <= 0) {
//       alert("Monthly earnings is zero, cannot create payout.");
//       return;
//     }

//     try {
//       await api.post("/api/payouts/create", {
//         sellerId: seller.sellerId,
//         amount: seller.total, // Use total earnings
//         commission: 0,
//       });
//       dispatch(fetchAdminPayouts());
//       dispatch(fetchPayoutSummary()); // Refresh summary too
//       alert("Payout Created Successfully");
//     } catch (error) {
//       console.log(error);
//       alert("Failed to create payout");
//     }
//   };

//   // Update payout status
//   const handleStatusChange = (id: string, status: string) => {
//     dispatch(updatePayoutStatus({ id, status }));
//   };

//   if (loading)
//     return (
//       <Box textAlign="center" mt={4}>
//         <CircularProgress />
//       </Box>
//     );

//   if (error)
//     return (
//       <Box textAlign="center" mt={4}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );

//   return (
//     <Box>
//       {/* Tabs */}
//       <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
//         <Tab label="Admin Seller Earnings" />
//         <Tab label="Payout History" />
//       </Tabs>

//       {/* TAB 0: Seller Summary */}
//       {tab === 0 && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Seller</TableCell>
//                 <TableCell>Total Orders</TableCell>
//                 <TableCell>Weekly Orders</TableCell>
//                 <TableCell>Monthly Orders</TableCell>
//                 <TableCell>Create Payout</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {summaryArray.length > 0 ? (
//                 summaryArray.map((seller: any) => (
//                   <TableRow key={seller.sellerId}>
//                     <TableCell>{seller.sellerName}</TableCell>
//                     <TableCell>₹{seller.total || 0}</TableCell>
//                     <TableCell>₹{seller.weekly || 0}</TableCell>
//                     <TableCell>₹{seller.monthly || 0}</TableCell>
//                     <TableCell>
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => createPayout(seller)}
//                         disabled={!seller.monthly || seller.monthly <= 0}
//                       >
//                         Create Payout
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">
//                     No seller summary available
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* TAB 1: Payout History */}
//       {tab === 1 && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Payout ID</TableCell>
//                 <TableCell>Seller</TableCell>
//                 <TableCell>Amount</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Commission</TableCell>
//                 <TableCell>Net</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {payoutsArray.length > 0 ? (
//                 payoutsArray.map((payout: any) => (
//                   <TableRow key={payout._id}>
//                     <TableCell>{payout._id}</TableCell>
//                     <TableCell>{payout.seller?.sellerName || "Unknown"}</TableCell>
//                     <TableCell>₹{payout.amount || 0}</TableCell>
//                     <TableCell>{payout.status || "PENDING"}</TableCell>
//                     <TableCell>₹{payout.commission || 0}</TableCell>
//                     <TableCell>
//                       ₹{(payout.amount || 0) - (payout.commission || 0)}
//                     </TableCell>
//                     <TableCell>
//                       <Select
//                         size="small"
//                         value={payout.status || "PENDING"}
//                         onChange={(e) =>
//                           handleStatusChange(payout._id, e.target.value)
//                         }
//                         disabled={payout.status === "SUCCESS"}
//                       >
//                         <MenuItem value="PENDING">Pending</MenuItem>
//                         <MenuItem value="SUCCESS">Success</MenuItem>
//                         <MenuItem value="REJECTED">Rejected</MenuItem>
//                       </Select>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     No payouts found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default AdminPayoutsTable;












import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchPendingPayouts,
  fetchPayoutHistory,
  updatePayoutStatus,
  fetchPayoutSummary,
} from "../../../Redux Toolkit/Admin/payoutSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Box,
  Button,
  CircularProgress,
  Typography,
  Chip,
} from "@mui/material";

const AdminPayoutsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  // Use safe selectors with fallback empty arrays
  const { 
    pending = [], 
    history = [], 
    summary = [], 
    loading, 
    error 
  } = useAppSelector((store: any) => store.adminPayouts || {});

  const [tab, setTab] = useState(0);

  useEffect(() => {
    dispatch(fetchPendingPayouts());
    dispatch(fetchPayoutHistory());
    dispatch(fetchPayoutSummary());
  }, [dispatch]);

  const handleApprove = (id: string) => {
    dispatch(updatePayoutStatus({ id, status: "SUCCESS" }));
  };

  const handleReject = (id: string) => {
    dispatch(updatePayoutStatus({ id, status: "REJECTED" }));
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Pending Requests" />
        <Tab label="Payout History" />
        <Tab label="Seller Earnings Summary" />
      </Tabs>

      {/* TAB 0: Pending Requests */}
      {tab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Seller Name</TableCell>
                <TableCell>Firm Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Bank Details</TableCell>
                <TableCell>Amount (₹)</TableCell>
                <TableCell>Requested On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!pending.length ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No pending payouts</TableCell>
                </TableRow>
              ) : (
                pending.map((payout: any) => (
                  <TableRow key={payout?._id || Math.random()}>
                    <TableCell>{payout?.seller?.sellerName || "-"}</TableCell>
                    <TableCell>{payout?.seller?.businessDetails?.businessName || "-"}</TableCell>
                    <TableCell>{payout?.seller?.mobile || "-"}</TableCell>
                    <TableCell>
                      {payout?.seller?.bankDetails?.accountHolderName || "-"} <br />
                      {payout?.seller?.bankDetails?.accountNumber || "-"} <br />
                      IFSC: {payout?.seller?.bankDetails?.ifscCode || "-"}
                    </TableCell>
                    <TableCell>₹{payout?.amount ?? 0}</TableCell>
                    <TableCell>{payout?.createdAt ? new Date(payout.createdAt).toLocaleString() : "-"}</TableCell>
                    <TableCell>
                      <Button size="small" variant="contained" color="success" onClick={() => handleApprove(payout._id)} sx={{ mr: 1 }}>
                        Approve
                      </Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleReject(payout._id)}>
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* TAB 1: Payout History */}
      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Seller</TableCell>
                <TableCell>Amount (₹)</TableCell>
                <TableCell>Commission (₹)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Paid On</TableCell>
                <TableCell>Requested On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!history.length ? (
                <TableRow><TableCell colSpan={6} align="center">No payout history</TableCell></TableRow>
              ) : (
                history.map((payout: any) => (
                  <TableRow key={payout?._id || Math.random()}>
                    <TableCell>{payout?.seller?.sellerName || "-"}</TableCell>
                    <TableCell>₹{payout?.amount ?? 0}</TableCell>
                    <TableCell>₹{payout?.commissionAmount ?? 0}</TableCell>
                    <TableCell>
                      <Chip label={payout?.status || "UNKNOWN"} color={payout?.status === "SUCCESS" ? "success" : "error"} size="small" />
                    </TableCell>
                    <TableCell>{payout?.paidAt ? new Date(payout.paidAt).toLocaleString() : "-"}</TableCell>
                    <TableCell>{payout?.createdAt ? new Date(payout.createdAt).toLocaleString() : "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* TAB 2: Earnings Summary */}
      {tab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Seller</TableCell>
                <TableCell>Total Earnings (₹)</TableCell>
                <TableCell>Weekly (₹)</TableCell>
                <TableCell>Monthly (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!summary.length ? (
                <TableRow><TableCell colSpan={4} align="center">No earnings data</TableCell></TableRow>
              ) : (
                summary.map((seller: any, idx: number) => (
                  <TableRow key={seller?.sellerId || idx}>
                    <TableCell>{seller?.sellerName || "-"}</TableCell>
                    <TableCell>₹{seller?.total ?? 0}</TableCell>
                    <TableCell>₹{seller?.weekly ?? 0}</TableCell>
                    <TableCell>₹{seller?.monthly ?? 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminPayoutsTable;
