import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchAdminOrders,
} from "../../../Redux Toolkit/Admin/orderSlice";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled, Box, Typography, Button, Chip } from "@mui/material";
import { fixTrackingLink } from "../../../util/trackingLinkFixer";

const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  PENDING: "warning",
  PLACED: "info",
  CONFIRMED: "primary",
  PACKED: "secondary",
  SHIPPED: "info",
  IN_TRANSIT: "info",
  OUT_FOR_DELIVERY: "primary",
  DELIVERED: "success",
  CANCELLED: "error",
  RETURNED: "error",
  RTO: "error",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AdminOrdersTable = () => {
  const dispatch = useAppDispatch();

  const { orders } = useAppSelector((store) => store.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);






  return (
    <Box>
      <Typography variant="h6" sx={{ pb: 3, fontWeight: "bold" }}>
        Marketplace Order Management
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Order Details</StyledTableCell>
              <StyledTableCell>Seller & Customer</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell align="center">Payment Method</StyledTableCell>
              <StyledTableCell align="center">Financials</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Logistics</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders?.map((order: any) => (
              <StyledTableRow key={order._id}>
                {/* Order Meta */}
                <StyledTableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>ID: {order._id}</Typography>
                    <Typography variant="body2" color="textSecondary">Qty: {order.totalItem}</Typography>

                  </Box>
                </StyledTableCell>

                {/* Stakeholders */}
                <StyledTableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Seller:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{order.seller?.sellerName || "N/A"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Customer:</Typography>
                      <Typography variant="body2">{order.user?.fullName || "Guest"}</Typography>
                    </Box>
                  </Box>
                </StyledTableCell>

                {/* Address */}
                <StyledTableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption">{order.shippingAddress?.address}</Typography>
                    <Typography variant="caption">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{order.shippingAddress?.mobile}</Typography>
                  </Box>
                </StyledTableCell>

                {/* Payment Method */}
                <StyledTableCell align="center">
                  {(() => {
                    const pm = (order.paymentMethod || order.paymentDetails?.method || '').toUpperCase();
                    const isCOD = pm === 'COD' || order.paymentStatus === 'COD_PENDING';
                    return (
                      <Chip
                        label={isCOD ? 'Cash on Delivery' : 'Online'}
                        color={isCOD ? 'warning' : 'success'}
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    );
                  })()}
                </StyledTableCell>

                {/* Financials */}
                <StyledTableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹{order.totalSellingPrice}</Typography>
                    {order.orderStatus === 'DELIVERED' ? (
                      <>
                        <Typography variant="caption" color="secondary">Comm: ₹{order.commissionAmount || order.commission || 0}</Typography>
                        <Typography variant="caption" color="success.main">Net: ₹{order.sellerAmount || (order.totalSellingPrice - (order.commission || 0))}</Typography>
                      </>
                    ) : (
                      <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>Pending Delivery</Typography>
                    )}
                  </Box>
                </StyledTableCell>

                {/* Status */}
                <StyledTableCell align="center">
                  <Chip
                    label={order.orderStatus}
                    size="small"
                    color={statusColors[order.orderStatus] || "default"}
                    sx={{ fontWeight: 'bold', fontSize: '10px' }}
                  />
                  {order.deliveryStatus && (
                    <Typography variant="caption" display="block" sx={{ mt: 0.5, textTransform: 'uppercase', fontSize: '9px', color: 'gray' }}>
                      {order.deliveryStatus}
                    </Typography>
                  )}
                </StyledTableCell>

                {/* Logistics */}
                <StyledTableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>DELHIVERY B2C</Typography>
                    {order.trackingLink && (
                      <Button
                        variant="outlined"
                        size="small"
                        href={fixTrackingLink(order.trackingLink)}
                        target="_blank"
                        sx={{ fontSize: '10px', mt: 1 }}
                      >
                        Track Shipment
                      </Button>
                    )}
                    {order.trackingId && (
                      <Typography variant="caption" color="primary" sx={{ fontSize: '10px', mt: 0.5 }}>
                        AWB: {order.trackingId}
                      </Typography>
                    )}
                  </Box>
                </StyledTableCell>

                {/* Actions */}
                <StyledTableCell align="center">
                  <Typography variant="caption" color="textSecondary">Automated</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminOrdersTable;
















