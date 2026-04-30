// import { Card, CardContent, Typography, Box } from "@mui/material";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import PaymentsIcon from "@mui/icons-material/Payments";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
// import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
// import { useAppSelector } from "../../../Redux Toolkit/Store";

// const AdminAnalyticsCards = () => {
//   const { adminOrders, adminPayouts, adminReturns } = useAppSelector(
//     (store) => store
//   );

//   const totalOrders = adminOrders.orders.length;
//   const totalPayouts = adminPayouts.payouts.length;
//   const totalReturns = adminReturns.returns.length;

//   const totalCommission = adminOrders.orders.reduce(
//     (sum, order) => sum + (order.commissionAmount || 0),
//     0
//   );

//   const totalEarnings = adminOrders.orders.reduce(
//     (sum, order) => sum + (order.totalSellingPrice || 0),
//     0
//   );

//   const totalNetEarnings = totalEarnings - totalCommission;

//   // Card style
//   const cardStyle = {
//     flex: "1 1 250px", // grow/shrink with min width
//     minWidth: 250,
//     height: 120,
//     borderTop: "5px solid orange",
//     borderRadius: 2,
//     boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
//   };

//   const titleStyle = {
//     display: "flex",
//     alignItems: "center",
//     gap: 1,
//     fontWeight: 600,
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexWrap: "wrap",
//         gap: 2,
//       }}
//     >
//       {/* Total Orders */}
//       <Card sx={cardStyle}>
//         <CardContent>
//           <Typography sx={titleStyle}>
//             <ShoppingCartIcon fontSize="small" />
//             Total Orders
//           </Typography>
//           <Typography variant="h4">{totalOrders}</Typography>
//         </CardContent>
//       </Card>

//       {/* Return Requests */}
//       <Card sx={{ ...cardStyle, borderTop: "5px solid #d32f2f" }}>
//         <CardContent>
//           <Typography sx={titleStyle}>
//             <AssignmentReturnIcon fontSize="small" color="error" />
//             Return Requests
//           </Typography>
//           <Typography variant="h4">{totalReturns}</Typography>
//         </CardContent>
//       </Card>

//       {/* Total Payouts */}
//       <Card sx={cardStyle}>
//         <CardContent>
//           <Typography sx={titleStyle}>
//             <PaymentsIcon fontSize="small" />
//             Total Payouts
//           </Typography>
//           <Typography variant="h4">{totalPayouts}</Typography>
//         </CardContent>
//       </Card>

//       {/* Total Commission */}
//       <Card sx={cardStyle}>
//         <CardContent>
//           <Typography sx={titleStyle}>
//             <CurrencyRupeeIcon fontSize="small" />
//             Total Commission
//           </Typography>
//           <Typography variant="h4">₹{totalCommission}</Typography>
//           <Typography variant="body2">
//             Net Earnings: ₹{totalNetEarnings}
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default AdminAnalyticsCards;












import { Card, CardContent, Typography, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const AdminAnalyticsCards = () => {
  const { adminOrders, adminPayouts, adminReturns } = useAppSelector(
    (store) => store
  );

  // Safe fallbacks
  const orders = adminOrders?.orders || [];
  const payoutsPending = adminPayouts?.pending || [];
  const payoutsHistory = adminPayouts?.history || [];
  const returns = adminReturns?.returns || [];

  const totalOrders = orders.length;
  const totalPayouts = payoutsPending.length + payoutsHistory.length;
  const totalReturns = returns.length;

  const totalCommission = orders.reduce(
    (sum, order) => sum + (order?.commissionAmount || 0),
    0
  );

  const totalEarnings = orders.reduce(
    (sum, order) => sum + (order?.totalSellingPrice || 0),
    0
  );

  const totalNetEarnings = totalEarnings - totalCommission;

  const cardStyle = {
    flex: "1 1 250px",
    minWidth: 250,
    height: 120,
    borderTop: "5px solid orange",
    borderRadius: 2,
    boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
  };

  const titleStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    fontWeight: 600,
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {/* Total Orders */}
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={titleStyle}>
            <ShoppingCartIcon fontSize="small" />
            Total Orders
          </Typography>
          <Typography variant="h4">{totalOrders}</Typography>
        </CardContent>
      </Card>

      {/* Return Requests */}
      <Card sx={{ ...cardStyle, borderTop: "5px solid #d32f2f" }}>
        <CardContent>
          <Typography sx={titleStyle}>
            <AssignmentReturnIcon fontSize="small" color="error" />
            Return Requests
          </Typography>
          <Typography variant="h4">{totalReturns}</Typography>
        </CardContent>
      </Card>

      {/* Total Payouts (Pending + History) */}
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={titleStyle}>
            <PaymentsIcon fontSize="small" />
            Total Payouts
          </Typography>
          <Typography variant="h4">{totalPayouts}</Typography>
        </CardContent>
      </Card>

      {/* Total Commission & Net */}
      <Card sx={cardStyle}>
        <CardContent>
          <Typography sx={titleStyle}>
            <CurrencyRupeeIcon fontSize="small" />
            Total Commission
          </Typography>
          <Typography variant="h4">₹{totalCommission}</Typography>
          <Typography variant="body2">
            Net Earnings: ₹{totalNetEarnings}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminAnalyticsCards;
