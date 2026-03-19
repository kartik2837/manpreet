import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Chip, Stack, styled, Snackbar, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchSellerOrders,
  acceptOrder,
  rejectOrder,
  packOrder,
  requestPickup,
  fetchShippingLabel,
  clearError,
} from "../../../Redux Toolkit/Seller/sellerOrderSlice";
import { type Order, type OrderItem } from "../../../types/orderTypes";
import { formatDate } from "../../../customer/util/fomateDate";

/* ================== STYLES ================== */

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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

/* ================== ORDER STATUS COLORS ================== */

const orderStatusColor: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
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

/* ================== COMPONENT ================== */

export default function OrderTable() {
  const { sellerOrder } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchSellerOrders(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  const handleAcceptOrder = (orderId: string) => {
    dispatch(acceptOrder({ jwt: localStorage.getItem("jwt") || "", orderId }));
  };

  const handleRejectOrder = (orderId: string) => {
    const reason = prompt("Enter reason for rejection:");
    if (reason) {
      dispatch(rejectOrder({ jwt: localStorage.getItem("jwt") || "", orderId, reason }));
    }
  };

  const handlePackOrder = (orderId: string) => {
    dispatch(packOrder({ jwt: localStorage.getItem("jwt") || "", orderId }));
  };

  const handleRequestPickup = (orderId: string) => {
    dispatch(requestPickup({ jwt: localStorage.getItem("jwt") || "", orderId }));
  };

  const handleDownloadLabel = (orderId: string) => {
    dispatch(fetchShippingLabel({ jwt: localStorage.getItem("jwt") || "", orderId }));
  };

  return (
    <>
      <h1 className="pb-5 font-bold text-xl">Order Management</h1>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Details</StyledTableCell>
              <StyledTableCell>Items</StyledTableCell>
              <StyledTableCell>Payment Method</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sellerOrder.orders.map((item: Order) => (
              <StyledTableRow key={item._id}>
                {/* Order Meta */}
                <StyledTableCell>
                  <Box className="space-y-1">
                    <p className="font-bold text-xs">ID: {item._id}</p>
                    <p className="text-xs text-gray-500">Date: {formatDate(item.orderDate)}</p>
                    <p className="text-xs font-semibold">Total: ₹{item.totalSellingPrice}</p>
                    {item.trackingId && (
                      <Chip size="small" label={`AWB: ${item.trackingId}`} variant="outlined" sx={{ fontSize: '10px' }} />
                    )}
                  </Box>
                </StyledTableCell>

                {/* Items */}
                <StyledTableCell>
                  <Stack spacing={1}>
                    {item.orderItems.map((orderItem: OrderItem) => (
                      <Box key={orderItem._id} className="flex gap-2 items-center border-b pb-1 last:border-0">
                        <img
                          className="w-12 h-12 rounded object-cover"
                          src={orderItem.product.images[0]}
                          alt=""
                        />
                        <Box className="text-xs">
                          <p className="font-medium line-clamp-1">{orderItem.product.title}</p>
                          <p className="text-gray-500">Qty: {orderItem.quantity} | Size: {orderItem.size}</p>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </StyledTableCell>

                {/* Customer */}
                <StyledTableCell>
                  {(() => {
                    const pm = (item.paymentMethod || item.paymentDetails?.method || '').toUpperCase();
                    const isCOD = pm === 'COD' || item.paymentStatus === 'COD_PENDING';
                    return (
                      <Chip
                        label={isCOD ? 'Cash on Delivery' : 'Pre-Paid'}
                        color={isCOD ? 'warning' : 'success'}
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    );
                  })()}
                </StyledTableCell>

                {/* Status */}
                <StyledTableCell align="center">
                  <Chip
                    label={item.orderStatus}
                    color={orderStatusColor[item.orderStatus] || "default"}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                  {item.deliveryStatus && (
                    <p className="text-[10px] text-gray-400 mt-1 uppercase">{item.deliveryStatus}</p>
                  )}
                </StyledTableCell>

                {/* Actions */}
                <StyledTableCell align="center">
                  <Stack spacing={1} direction="column" alignItems="center">
                    {item.orderStatus === 'PLACED' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          fullWidth
                          onClick={() => handleAcceptOrder(item._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          fullWidth
                          onClick={() => handleRejectOrder(item._id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {/* Actions for Manifested or Packed orders */}
                    {(item.orderStatus === 'SHIPPED' || item.orderStatus === 'PACKED') && (
                      <Stack spacing={1}>
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          fullWidth
                          onClick={() => handleDownloadLabel(item._id)}
                        >
                          Download Label
                        </Button>

                        {!item.pickupRequested ? (
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            fullWidth
                            onClick={() => handleRequestPickup(item._id)}
                          >
                            Request Pickup
                          </Button>
                        ) : (
                          <Chip label="Pickup Requested" size="small" color="success" variant="outlined" />
                        )}

                        {item.orderStatus === 'SHIPPED' && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            fullWidth
                            onClick={() => handlePackOrder(item._id)}
                          >
                            Mark Packed
                          </Button>
                        )}
                      </Stack>
                    )}

                    {['IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(item.orderStatus) && (
                      <p className="text-[10px] text-gray-400 italic">Processing...</p>
                    )}

                    {item.orderStatus === 'DELIVERED' && (
                      <p className="text-[10px] text-success-600 font-bold">COMPLETED</p>
                    )}

                    {item.orderStatus === 'CANCELLED' && (
                      <p className="text-[10px] text-error-600 font-bold">CANCELLED</p>
                    )}
                  </Stack>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={!!sellerOrder.error}
        autoHideDuration={6000}
        onClose={() => dispatch(clearError())}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => dispatch(clearError())}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {sellerOrder.error}
        </Alert>
      </Snackbar>
    </>
  );
}









































































// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import {
//   Box,
//   Button,
//   Chip,
//   Stack,
//   styled,
//   Snackbar,
//   Alert,
//   Modal,
//   Typography,
//   Divider,
//   Grid,
//   IconButton,
//   Dialog,
//   DialogContent,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import PrintIcon from "@mui/icons-material/Print";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import {
//   fetchSellerOrders,
//   acceptOrder,
//   rejectOrder,
//   packOrder,
//   requestPickup,
//   fetchShippingLabel,
//   clearError,
// } from "../../../Redux Toolkit/Seller/sellerOrderSlice";
// import { type Order, type OrderItem } from "../../../types/orderTypes";
// import { formatDate } from "../../../customer/util/fomateDate";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import PickupAddressForm from "../Account/PickupAddressForm";

// /* ================== STYLES ================== */

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

// /* ================== ORDER STATUS COLORS ================== */

// const orderStatusColor: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
//   PENDING: "warning",
//   PLACED: "info",
//   CONFIRMED: "primary",
//   PACKED: "secondary",
//   SHIPPED: "info",
//   IN_TRANSIT: "info",
//   OUT_FOR_DELIVERY: "primary",
//   DELIVERED: "success",
//   CANCELLED: "error",
//   RETURNED: "error",
//   RTO: "error",
// };

// /* ================== INVOICE MODAL ================== */

// interface InvoiceModalProps {
//   open: boolean;
//   onClose: () => void;
//   order: Order | null;
// }

// const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, onClose, order }) => {
//   const sellerProfile = useAppSelector((state) => state.sellers?.profile);

//   if (!order) return null;

//   const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

//   const subtotal = order.orderItems.reduce(
//     (acc, item) => acc + item.sellingPrice * item.quantity,
//     0
//   );

//   const deliveryCharge = order.deliveryCharge || 0;
//   const discount = order.discount || 0;

//   // GST Calculation – 18% if not already present
//   const gstRate = 18;
//   const gstAmount = order.tax ?? (subtotal * gstRate) / 100;

//   const grandTotal = subtotal + deliveryCharge + gstAmount - discount;

//   // Use pickup address if available, otherwise fallback to seller's main address
//   const pickup = sellerProfile?.pickupAddress;
//   const sellerName = pickup?.name || sellerProfile?.businessDetails?.businessName || "Your Store Name";
//   const sellerAddress = pickup
//     ? `${pickup.address}${pickup.locality ? ", " + pickup.locality : ""}`
//     : sellerProfile?.address || "Seller Address";
//   const sellerCityState = pickup
//     ? `${pickup.city}, ${pickup.state} - ${pickup.pinCode}`
//     : `${sellerProfile?.city || "City"}, ${sellerProfile?.state || "State"} - ${sellerProfile?.pincode || "PIN"}`;
//   const sellerPhone = pickup?.mobile ? `Phone: ${pickup.mobile}` : "";

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="invoice-modal-title"
//       sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//     >
//       <Paper
//         sx={{
//           maxWidth: 800,
//           width: '90%',
//           maxHeight: '90vh',
//           overflow: 'auto',
//           p: 4,
//           position: 'relative',
//         }}
//         id="invoice-print-area"
//       >
//         <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
//           <CloseIcon />
//         </IconButton>

//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5" component="h2" id="invoice-modal-title">
//             Tax Invoice
//           </Typography>
//           <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}>
//             Print / Save PDF
//           </Button>
//         </Box>

//         <Divider sx={{ mb: 3 }} />

//         {/* Seller (Pickup Address) & Buyer Info */}
//         <Grid container spacing={2} sx={{ mb: 3 }}>
//           <Grid item xs={6}>
//             <Typography variant="subtitle2" color="text.secondary">Sold By:</Typography>
//             <Typography variant="body2">{sellerName}</Typography>
//             <Typography variant="body2">{sellerAddress}</Typography>
//             <Typography variant="body2">{sellerCityState}</Typography>
//             {sellerPhone && <Typography variant="body2">{sellerPhone}</Typography>}
//             <Typography variant="body2">GST: {sellerProfile?.GSTIN || 'N/A'}</Typography>
//             <Typography variant="body2">Email: {sellerProfile?.email || 'seller@example.com'}</Typography>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography variant="subtitle2" color="text.secondary">Buyer:</Typography>
//             <Typography variant="body2">{order.shippingAddress?.name}</Typography>
//             <Typography variant="body2">{order.shippingAddress?.address}</Typography>
//             <Typography variant="body2">
//               {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
//             </Typography>
//             <Typography variant="body2">Phone: {order.shippingAddress?.phone}</Typography>
//             <Typography variant="body2">Email: {order.customer?.email || 'N/A'}</Typography>
//           </Grid>
//         </Grid>

//         {/* Order Summary */}
//         <Grid container spacing={2} sx={{ mb: 3 }}>
//           <Grid item xs={4}>
//             <Typography variant="subtitle2" color="text.secondary">Order ID:</Typography>
//             <Typography variant="body2">{order._id}</Typography>
//           </Grid>
//           <Grid item xs={4}>
//             <Typography variant="subtitle2" color="text.secondary">Order Date:</Typography>
//             <Typography variant="body2">{formatDate(order.orderDate)}</Typography>
//           </Grid>
//           <Grid item xs={4}>
//             <Typography variant="subtitle2" color="text.secondary">Payment Method:</Typography>
//             <Typography variant="body2">
//               {(order.paymentMethod || order.paymentDetails?.method || '').toUpperCase()}
//             </Typography>
//           </Grid>
//           {order.trackingId && (
//             <Grid item xs={4}>
//               <Typography variant="subtitle2" color="text.secondary">Tracking ID:</Typography>
//               <Typography variant="body2">{order.trackingId}</Typography>
//             </Grid>
//           )}
//         </Grid>

//         {/* Items Table */}
//         <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Order Items</Typography>
//         <TableContainer component={Paper} variant="outlined">
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>#</TableCell>
//                 <TableCell>Product</TableCell>
//                 <TableCell align="right">Qty</TableCell>
//                 <TableCell align="right">Unit Price</TableCell>
//                 <TableCell align="right">Total</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {order.orderItems.map((item, index) => (
//                 <TableRow key={item._id}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>
//                     {item.product.title}
//                     {item.size && <span> (Size: {item.size})</span>}
//                   </TableCell>
//                   <TableCell align="right">{item.quantity}</TableCell>
//                   <TableCell align="right">{formatCurrency(item.sellingPrice)}</TableCell>
//                   <TableCell align="right">{formatCurrency(item.sellingPrice * item.quantity)}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Totals */}
//         <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
//           <Typography variant="body2">Subtotal: {formatCurrency(subtotal)}</Typography>
//           {discount > 0 && <Typography variant="body2">Discount: - {formatCurrency(discount)}</Typography>}
//           <Typography variant="body2">Delivery Charge: {formatCurrency(deliveryCharge)}</Typography>
//           <Typography variant="body2">GST (18%): {formatCurrency(gstAmount)}</Typography>
//           <Typography variant="h6" sx={{ mt: 1 }}>Grand Total: {formatCurrency(grandTotal)}</Typography>
//         </Box>

//         {/* Payment Status */}
//         <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #ccc' }}>
//           <Typography variant="body2" color="text.secondary">
//             Payment Status: <strong>{order.paymentStatus || 'N/A'}</strong>
//           </Typography>
//         </Box>
//       </Paper>
//     </Modal>
//   );
// };

// /* ================== MAIN COMPONENT ================== */

// export default function OrderTable() {
//   const { sellerOrder } = useAppSelector((store) => store);
//   const sellerProfile = useAppSelector((state) => state.sellers?.profile);
//   const dispatch = useAppDispatch();

//   const [invoiceOpen, setInvoiceOpen] = React.useState(false);
//   const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
//   const [pickupAddressModalOpen, setPickupAddressModalOpen] = React.useState(false);

//   React.useEffect(() => {
//     dispatch(fetchSellerOrders(localStorage.getItem("jwt") || ""));
//   }, [dispatch]);

//   const handleAcceptOrder = (orderId: string) => {
//     dispatch(acceptOrder({ jwt: localStorage.getItem("jwt") || "", orderId }));
//   };

//   const handleRejectOrder = (orderId: string) => {
//     const reason = prompt("Enter reason for rejection:");
//     if (reason) {
//       dispatch(rejectOrder({ jwt: localStorage.getItem("jwt") || "", orderId, reason }));
//     }
//   };

//   const handlePackOrder = (orderId: string) => {
//     dispatch(packOrder({ jwt: localStorage.getItem("jwt") || "", orderId }));
//   };

//   const handleRequestPickup = (orderId: string) => {
//     dispatch(requestPickup({ jwt: localStorage.getItem("jwt") || "", orderId }));
//   };

//   const handleDownloadLabel = (orderId: string) => {
//     dispatch(fetchShippingLabel({ jwt: localStorage.getItem("jwt") || "", orderId }));
//   };

//   const handleOpenInvoice = (order: Order) => {
//     setSelectedOrder(order);
//     setInvoiceOpen(true);
//   };

//   const handleCloseInvoice = () => {
//     setInvoiceOpen(false);
//     setSelectedOrder(null);
//   };

//   const handleOpenPickupAddressModal = () => setPickupAddressModalOpen(true);
//   const handleClosePickupAddressModal = () => setPickupAddressModalOpen(false);

//   const generatePDF = (order: Order, seller: typeof sellerProfile) => {
//     const doc = new jsPDF();

//     const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

//     // Calculate totals with GST
//     const subtotal = order.orderItems.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);
//     const deliveryCharge = order.deliveryCharge || 0;
//     const discount = order.discount || 0;
//     const gstRate = 18;
//     const gstAmount = order.tax ?? (subtotal * gstRate) / 100;
//     const grandTotal = subtotal + deliveryCharge + gstAmount - discount;

//     doc.setFontSize(18);
//     doc.text(" SelfySnap Tax Invoice", 14, 22);
//     doc.setFontSize(10);
//     doc.text(`Order ID: ${order._id}`, 14, 30);
//     doc.text(`Date: ${formatDate(order.orderDate)}`, 14, 36);
//     doc.text(`Payment: ${(order.paymentMethod || order.paymentDetails?.method || '').toUpperCase()}`, 14, 42);
//     if (order.trackingId) {
//       doc.text(`Tracking ID: ${order.trackingId}`, 14, 48);
//     }

//     // Seller (pickup address) info
//     const pickup = seller?.pickupAddress;
//     const sellerName = pickup?.name || seller?.businessDetails?.businessName || "Your Store Name";
//     const sellerAddress = pickup
//       ? `${pickup.address}${pickup.locality ? ", " + pickup.locality : ""}`
//       : seller?.address || "Seller Address";
//     const sellerCityState = pickup
//       ? `${pickup.city}, ${pickup.state} - ${pickup.pinCode}`
//       : `${seller?.city || "City"}, ${seller?.state || "State"} - ${seller?.pincode || "PIN"}`;
//     const sellerPhone = pickup?.mobile ? `Phone: ${pickup.mobile}` : "";

//     doc.setFontSize(12);
//     doc.text("Sold By:", 14, 58);
//     doc.setFontSize(10);
//     doc.text(sellerName, 14, 64);
//     doc.text(sellerAddress, 14, 70);
//     doc.text(sellerCityState, 14, 76);
//     if (sellerPhone) doc.text(sellerPhone, 14, 82);
//     doc.text(`GST: ${seller?.GSTIN || 'N/A'}`, 14, sellerPhone ? 88 : 82);
//     doc.text(`Email: ${seller?.email || 'seller@example.com'}`, 14, sellerPhone ? 94 : 88);

//     // Buyer info
//     const buyerY = sellerPhone ? 100 : 94;
//     doc.setFontSize(12);
//     doc.text("Buyer:", 120, 58);
//     doc.setFontSize(10);
//     doc.text(order.shippingAddress?.name || "N/A", 120, 64);
//     doc.text(order.shippingAddress?.address || "", 120, 70);
//     doc.text(`${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} - ${order.shippingAddress?.pincode || ""}`, 120, 76);
//     doc.text(`Phone: ${order.shippingAddress?.phone || ""}`, 120, 82);
//     doc.text(`Email: ${order.customer?.email || "N/A"}`, 120, 88);

//     // Items table
//     const tableColumn = ["#", "Product", "Qty", "Unit Price", "Total"];
//     const tableRows: any[][] = [];

//     order.orderItems.forEach((item, index) => {
//       const productTitle = item.product.title + (item.size ? ` (Size: ${item.size})` : "");
//       tableRows.push([
//         index + 1,
//         productTitle,
//         item.quantity,
//         formatCurrency(item.sellingPrice),
//         formatCurrency(item.sellingPrice * item.quantity),
//       ]);
//     });

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: buyerY + 10,
//       theme: "striped",
//       headStyles: { fillColor: [0, 0, 0] },
//     });

//     const finalY = (doc as any).lastAutoTable.finalY + 10;
//     doc.setFontSize(10);
//     doc.text(`Subtotal: ${formatCurrency(subtotal)}`, 140, finalY);
//     if (discount > 0) doc.text(`Discount: - ${formatCurrency(discount)}`, 140, finalY + 6);
//     doc.text(`Delivery Charge: ${formatCurrency(deliveryCharge)}`, 140, finalY + 12);
//     doc.text(`GST (18%): ${formatCurrency(gstAmount)}`, 140, finalY + 18);
//     doc.setFontSize(12);
//     doc.text(`Grand Total: ${formatCurrency(grandTotal)}`, 140, finalY + 26);

//     doc.setFontSize(10);
//     doc.text(`Payment Status: ${order.paymentStatus || "N/A"}`, 14, finalY + 40);

//     doc.save(`invoice_${order._id}.pdf`);
//   };

//   return (
//     <>
//       {/* Header with Pickup Address Info and Button */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <h1 className="font-bold text-xl">Order Management</h1>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           {sellerProfile?.pickupAddress ? (
//             <Chip
//               label={`Pickup: ${sellerProfile.pickupAddress.address}, ${sellerProfile.pickupAddress.city}`}
//               variant="outlined"
//               size="small"
//               color="success"
//             />
//           ) : (
//             <Chip label="Pickup Address Not Set" color="warning" size="small" />
//           )}
//           <Button
//             variant="contained"
//             size="small"
//             onClick={handleOpenPickupAddressModal}
//           >
//             Update Pickup Address
//           </Button>
//         </Box>
//       </Box>

//       <TableContainer component={Paper} elevation={3}>
//         <Table sx={{ minWidth: 700 }}>
//           <TableHead>
//             <TableRow>
//               <StyledTableCell>Details</StyledTableCell>
//               <StyledTableCell>Items</StyledTableCell>
//               <StyledTableCell>Payment Method</StyledTableCell>
//               <StyledTableCell align="center">Status</StyledTableCell>
//               <StyledTableCell align="center">Actions</StyledTableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {sellerOrder.orders.map((item: Order) => (
//               <StyledTableRow key={item._id}>
//                 {/* Order Meta */}
//                 <StyledTableCell>
//                   <Box className="space-y-1">
//                     <p className="font-bold text-xs">ID: {item._id}</p>
//                     <p className="text-xs text-gray-500">Date: {formatDate(item.orderDate)}</p>
//                     <p className="text-xs font-semibold">Total: ₹{item.totalSellingPrice}</p>
//                     {item.trackingId && (
//                       <Chip size="small" label={`AWB: ${item.trackingId}`} variant="outlined" sx={{ fontSize: '10px' }} />
//                     )}
//                   </Box>
//                 </StyledTableCell>

//                 {/* Items */}
//                 <StyledTableCell>
//                   <Stack spacing={1}>
//                     {item.orderItems.map((orderItem: OrderItem) => (
//                       <Box key={orderItem._id} className="flex gap-2 items-center border-b pb-1 last:border-0">
//                         <img
//                           className="w-12 h-12 rounded object-cover"
//                           src={orderItem.product.images[0]}
//                           alt=""
//                         />
//                         <Box className="text-xs">
//                           <p className="font-medium line-clamp-1">{orderItem.product.title}</p>
//                           <p className="text-gray-500">Qty: {orderItem.quantity} | Size: {orderItem.size}</p>
//                         </Box>
//                       </Box>
//                     ))}
//                   </Stack>
//                 </StyledTableCell>

//                 {/* Payment Method */}
//                 <StyledTableCell>
//                   {(() => {
//                     const pm = (item.paymentMethod || item.paymentDetails?.method || '').toUpperCase();
//                     const isCOD = pm === 'COD' || item.paymentStatus === 'COD_PENDING';
//                     return (
//                       <Chip
//                         label={isCOD ? 'Cash on Delivery' : 'Pre-Paid'}
//                         color={isCOD ? 'warning' : 'success'}
//                         variant="outlined"
//                         size="small"
//                         sx={{ fontWeight: 'bold' }}
//                       />
//                     );
//                   })()}
//                 </StyledTableCell>

//                 {/* Status */}
//                 <StyledTableCell align="center">
//                   <Chip
//                     label={item.orderStatus}
//                     color={orderStatusColor[item.orderStatus] || "default"}
//                     size="small"
//                     sx={{ fontWeight: 'bold' }}
//                   />
//                   {item.deliveryStatus && (
//                     <p className="text-[10px] text-gray-400 mt-1 uppercase">{item.deliveryStatus}</p>
//                   )}
//                 </StyledTableCell>

//                 {/* Actions */}
//                 <StyledTableCell align="center">
//                   <Stack spacing={1} direction="column" alignItems="center">
//                     <Button
//                       variant="text"
//                       size="small"
//                       onClick={() => handleOpenInvoice(item)}
//                       sx={{ textTransform: 'none' }}
//                     >
//                       Preview Invoice
//                     </Button>

//                     <Button
//                       variant="outlined"
//                       size="small"
//                       startIcon={<PictureAsPdfIcon />}
//                       onClick={() => generatePDF(item, sellerProfile)}
//                       sx={{ textTransform: 'none' }}
//                     >
//                       Download PDF
//                     </Button>

//                     {item.orderStatus === 'PLACED' && (
//                       <>
//                         <Button
//                           variant="contained"
//                           color="success"
//                           size="small"
//                           fullWidth
//                           onClick={() => handleAcceptOrder(item._id)}
//                         >
//                           Accept
//                         </Button>
//                         <Button
//                           variant="outlined"
//                           color="error"
//                           size="small"
//                           fullWidth
//                           onClick={() => handleRejectOrder(item._id)}
//                         >
//                           Reject
//                         </Button>
//                       </>
//                     )}

//                     {(item.orderStatus === 'SHIPPED' || item.orderStatus === 'PACKED') && (
//                       <Stack spacing={1} width="100%">
//                         <Button
//                           variant="contained"
//                           color="info"
//                           size="small"
//                           fullWidth
//                           onClick={() => handleDownloadLabel(item._id)}
//                         >
//                           Download Label
//                         </Button>

//                         {!item.pickupRequested ? (
//                           <Button
//                             variant="contained"
//                             color="warning"
//                             size="small"
//                             fullWidth
//                             onClick={() => handleRequestPickup(item._id)}
//                           >
//                             Request Pickup
//                           </Button>
//                         ) : (
//                           <Chip label="Pickup Requested" size="small" color="success" variant="outlined" />
//                         )}

//                         {item.orderStatus === 'SHIPPED' && (
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             size="small"
//                             fullWidth
//                             onClick={() => handlePackOrder(item._id)}
//                           >
//                             Mark Packed
//                           </Button>
//                         )}
//                       </Stack>
//                     )}

//                     {['IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(item.orderStatus) && (
//                       <p className="text-[10px] text-gray-400 italic">Processing...</p>
//                     )}

//                     {item.orderStatus === 'DELIVERED' && (
//                       <p className="text-[10px] text-success-600 font-bold">COMPLETED</p>
//                     )}

//                     {item.orderStatus === 'CANCELLED' && (
//                       <p className="text-[10px] text-error-600 font-bold">CANCELLED</p>
//                     )}
//                   </Stack>
//                 </StyledTableCell>
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pickup Address Modal */}
//       <Dialog
//         open={pickupAddressModalOpen}
//         onClose={handleClosePickupAddressModal}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogContent>
//           <PickupAddressForm onClose={handleClosePickupAddressModal} />
//         </DialogContent>
//       </Dialog>

//       <InvoiceModal
//         open={invoiceOpen}
//         onClose={handleCloseInvoice}
//         order={selectedOrder}
//       />

//       <Snackbar
//         open={!!sellerOrder.error}
//         autoHideDuration={6000}
//         onClose={() => dispatch(clearError())}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => dispatch(clearError())}
//           severity="error"
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {sellerOrder.error}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }


































