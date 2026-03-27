// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { Box, Button, Chip, Stack, styled, Snackbar, Alert } from "@mui/material";
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

// /* ================== COMPONENT ================== */

// export default function OrderTable() {
//   const { sellerOrder } = useAppSelector((store) => store);
//   const dispatch = useAppDispatch();

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

//   return (
//     <>
//       <h1 className="pb-5 font-bold text-xl">Order Management</h1>

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

//                 {/* Customer */}
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

//                     {/* Actions for Manifested or Packed orders */}
//                     {(item.orderStatus === 'SHIPPED' || item.orderStatus === 'PACKED') && (
//                       <Stack spacing={1}>
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









import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
  Box,
  Button,
  Chip,
  Stack,
  styled,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

// Helper function to convert number to words (Indian numbering system)
const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  const convertToWords = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertToWords(n % 100) : '');
    if (n < 100000) return convertToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convertToWords(n % 1000) : '');
    if (n < 10000000) return convertToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convertToWords(n % 100000) : '');
    return convertToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convertToWords(n % 10000000) : '');
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  let words = convertToWords(rupees);
  if (words) words = words + ' Rupees';
  if (paise > 0) words = words + ' and ' + convertToWords(paise) + ' Paise';
  return words || 'Zero Rupees';
};

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

const orderStatusColor: Record<string, any> = {
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
  const { sellerOrder, sellers } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  /* ================== INVOICE STATE ================== */
  const [openInvoice, setOpenInvoice] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

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

  /* ================== INVOICE ================== */

  const handleOpenInvoice = (order: Order) => {
    setSelectedOrder(order);
    setOpenInvoice(true);
  };

  const handleCloseInvoice = () => {
    setOpenInvoice(false);
    setSelectedOrder(null);
  };

  // Custom print function that opens a new window with invoice content only
  const handlePrintInvoice = () => {
    if (!selectedOrder) return;

    // Clone the invoice content
    const invoiceElement = document.getElementById("invoice-content");
    if (!invoiceElement) return;

    // Create a deep clone of the invoice content (including all styles)
    const clone = invoiceElement.cloneNode(true) as HTMLElement;

    // Build HTML for the new window
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Selfysnap Invoice</title>
          <meta charset="utf-8" />
          <style>
            /* Reset styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background: white;
            }
            /* Basic print styling */
            .invoice-wrapper {
              max-width: 1200px;
              margin: 0 auto;
              position: relative;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .font-bold {
              font-weight: bold;
            }
            .border-b {
              border-bottom: 1px solid #ddd;
            }
            .border-t {
              border-top: 1px solid #ddd;
            }
            .mb-4 {
              margin-bottom: 16px;
            }
            .mt-2 {
              margin-top: 8px;
            }
            .p-6 {
              padding: 24px;
            }
            .grid {
              display: grid;
            }
            .grid-cols-2 {
              grid-template-columns: repeat(2, 1fr);
            }
            .gap-6 {
              gap: 24px;
            }
            .flex {
              display: flex;
            }
            .items-center {
              align-items: center;
            }
            .justify-between {
              justify-content: space-between;
            }
            .justify-end {
              justify-content: flex-end;
            }
            .gap-2 {
              gap: 8px;
            }
            .gap-3 {
              gap: 12px;
            }
            .mt-4 {
              margin-top: 16px;
            }
            .mt-6 {
              margin-top: 24px;
            }
            .pt-4 {
              padding-top: 16px;
            }
            .pb-4 {
              padding-bottom: 16px;
            }
            .text-sm {
              font-size: 14px;
            }
            .text-base {
              font-size: 16px;
            }
            .text-xl {
              font-size: 20px;
            }
            .text-2xl {
              font-size: 24px;
            }
            .text-gray-600 {
              color: #666;
            }
            .text-gray-700 {
              color: #555;
            }
            .bg-gray-50 {
              background-color: #f9f9f9;
            }
            .bg-gray-100 {
              background-color: #f5f5f5;
            }
            .object-cover {
              object-fit: cover;
            }
            .rounded {
              border-radius: 4px;
            }
            .w-12 {
              width: 48px;
            }
            .h-12 {
              height: 48px;
            }
            .flex-col {
              flex-direction: column;
            }
            .items-center {
              align-items: center;
            }
            .justify-center {
              justify-content: center;
            }
            .mt-1 {
              margin-top: 4px;
            }
            /* Watermark */
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-25deg);
              font-size: 5rem;
              font-weight: bold;
              color: rgba(0,0,0,0.1);
              white-space: nowrap;
              pointer-events: none;
              user-select: none;
              font-family: Arial, sans-serif;
              letter-spacing: 6px;
              text-transform: uppercase;
              z-index: 0;
            }
            /* Print styles: hide buttons, keep everything */
            @media print {
              .no-print {
                display: none;
              }
              body {
                padding: 0;
              }
              .invoice-wrapper {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper" style="position: relative; min-height: 500px;">
            ${clone.outerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // PDF download (unchanged)
  const handleDownloadPDF = async () => {
    const element = document.getElementById("invoice-content");
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`invoice_${selectedOrder?._id.slice(-6)}.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
    }
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
                <StyledTableCell>
                  <Box className="space-y-1">
                    <p className="font-bold text-xs">ID: {item._id}</p>
                    <p className="text-xs text-gray-500">Date: {formatDate(item.orderDate)}</p>
                    <p className="text-xs font-semibold">Total: ₹{item.totalSellingPrice}</p>

                    {item.trackingId && (
                      <Chip size="small" label={`AWB: ${item.trackingId}`} variant="outlined" />
                    )}
                  </Box>
                </StyledTableCell>

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
                          <p className="text-gray-500">
                            Qty: {orderItem.quantity} | Size: {orderItem.size}
                          </p>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </StyledTableCell>

                <StyledTableCell>
                  <Chip label={item.paymentMethod === "RAZORPAY" ? "Razorpay" : "COD"} color="success" size="small" />
                </StyledTableCell>

                <StyledTableCell align="center">
                  <Chip label={item.orderStatus} color={orderStatusColor[item.orderStatus]} />
                </StyledTableCell>

                <StyledTableCell align="center">
                  <Stack spacing={1}>

                    {/* ACCEPT / REJECT */}
                    {item.orderStatus === "PLACED" && (
                      <>
                        <Button onClick={() => handleAcceptOrder(item._id)} color="success" variant="contained" size="small">
                          Accept
                        </Button>
                        <Button onClick={() => handleRejectOrder(item._id)} color="error" variant="outlined" size="small">
                          Reject
                        </Button>
                      </>
                    )}

                    {/* SHIPPING ACTIONS */}
                    {(item.orderStatus === "SHIPPED" || item.orderStatus === "PACKED") && (
                      <>
                        <Button variant="contained" color="info" size="small" onClick={() => handleDownloadLabel(item._id)}>
                          Download Label
                        </Button>

                        {!item.pickupRequested ? (
                          <Button variant="contained" color="warning" size="small" onClick={() => handleRequestPickup(item._id)}>
                            Request Pickup
                          </Button>
                        ) : (
                          <Chip label="Pickup Requested" color="success" size="small" />
                        )}

                        {item.orderStatus === "SHIPPED" && (
                          <Button variant="contained" color="primary" size="small" onClick={() => handlePackOrder(item._id)}>
                            Mark Packed
                          </Button>
                        )}
                      </>
                    )}

                    {/* INVOICE BUTTON */}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenInvoice(item)}
                    >
                      Invoice
                    </Button>

                  </Stack>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ================= INVOICE MODAL ================= */}
      <Dialog open={openInvoice} onClose={handleCloseInvoice} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/logo.jpeg" alt="Selfysnap Logo" style={{ height: 50, width: 'auto' }} />
            <Box>
              <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Selfysnap</span>
              <span style={{ marginLeft: 8, fontSize: '1.2rem' }}>Seller Invoice</span>
            </Box>
          </Box>
          <IconButton onClick={handleCloseInvoice} style={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedOrder && (() => {
            // Compute grand total from order (including tax)
            const grandTotal = selectedOrder.totalSellingPrice;

            return (
              <div id="invoice-content" className="p-6" style={{ position: 'relative', minHeight: '500px' }}>
                {/* Watermark */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-25deg)',
                    fontSize: '5rem',
                    fontWeight: 'bold',
                    color: 'rgba(0,0,0,0.1)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    zIndex: 0,
                    fontFamily: 'Arial, sans-serif',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                  }}
                >
                  Selfysnap
                </div>

                {/* Invoice content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="border-b pb-4 mb-4">
                    <h1 className="text-2xl font-bold">Tax Invoice/Bill of Supply/Cash Memo</h1>
                    <p className="text-sm text-gray-600 font-medium">(Triplicate for Supplier)</p>
                  </div>

                  {/* Seller and buyer info grid */}
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <h3 className="font-bold text-base">Sold By:</h3>
                      <p className="text-base font-semibold">{sellers.profile?.businessDetails?.businessName || "Seller Name"}</p>
                      <p className="text-sm text-gray-700">
                        {sellers.profile?.pickupAddress?.address}<br />
                        {sellers.profile?.pickupAddress?.city}, {sellers.profile?.pickupAddress?.state} - {sellers.profile?.pickupAddress?.pinCode}<br />
                        {sellers.profile?.pickupAddress?.mobile && `Mobile: ${sellers.profile.pickupAddress.mobile}`}
                      </p>
                      <p className="text-base">GST Registration No: {sellers.profile?.GSTIN || "Not Registered"}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-base">Billing Address:</h3>
                      <p className="text-base font-semibold">{selectedOrder.user?.fullName || "Customer"}</p>
                      <p className="text-sm text-gray-700">
                        {selectedOrder.shippingAddress?.address}<br />
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pinCode}<br />
                      </p>
                      <h3 className="font-bold text-base mt-2">Shipping Address:</h3>
                      <p className="text-base font-semibold">{selectedOrder.user?.fullName || "Customer"}</p>
                      <p className="text-sm text-gray-700">
                        {selectedOrder.shippingAddress?.address}<br />
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pinCode}<br />
                      </p>
                    </div>
                  </div>

                  {/* Place of supply/delivery */}
                  <div className="grid grid-cols-2 gap-6 mb-4 text-base">
                    <div><span className="font-semibold">Place of supply:</span> {selectedOrder.shippingAddress?.state || "Unknown"}</div>
                    <div><span className="font-semibold">Place of delivery:</span> {selectedOrder.shippingAddress?.state || "Unknown"}</div>
                  </div>

                  {/* Invoice and order details */}
                  <div className="grid grid-cols-2 gap-6 mb-4 text-base">
                    <div>
                      <p><span className="font-semibold">Invoice Number:</span> INV-{selectedOrder._id.slice(-6)}</p>
                      <p><span className="font-semibold">Invoice Details:</span> {selectedOrder._id}</p>
                      <p><span className="font-semibold">Invoice Date:</span> {formatDate(selectedOrder.orderDate)}</p>
                      {selectedOrder.trackingId && (
                        <p><span className="font-semibold">AWB Number:</span> {selectedOrder.trackingId}</p>
                      )}
                    </div>
                    <div>
                      <p><span className="font-semibold">Order Number:</span> {selectedOrder._id}</p>
                      <p><span className="font-semibold">Order Date:</span> {formatDate(selectedOrder.orderDate)}</p>
                      <p><span className="font-semibold">Payment Method:</span> {selectedOrder.paymentMethod === "RAZORPAY" ? "Razorpay (Online)" : "Cash on Delivery (COD)"}</p>
                    </div>
                  </div>

                  {/* Items Table with Images */}
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 font-bold">Sl. No</th>
                          <th className="border p-2 font-bold">Description</th>
                          <th className="border p-2 font-bold">Unit Price (Net)</th>
                          <th className="border p-2 font-bold">Qty</th>
                          <th className="border p-2 font-bold">Net Amount</th>
                          <th className="border p-2 font-bold">Tax Rate</th>
                          <th className="border p-2 font-bold">Tax Type</th>
                          <th className="border p-2 font-bold">Tax Amount</th>
                          <th className="border p-2 font-bold">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.orderItems.map((item, idx) => {
                          // Assume item.sellingPrice is inclusive of tax (customer price)
                          const inclusiveUnitPrice = item.sellingPrice;
                          const netUnitPrice = inclusiveUnitPrice / 1.18; // Back‑calculate net unit price
                          const quantity = item.quantity;
                          const netAmount = netUnitPrice * quantity;
                          const taxRate = 18; // IGST 18%
                          const taxAmount = netAmount * (taxRate / 100);
                          const total = netAmount + taxAmount; // Should equal inclusiveUnitPrice * quantity

                          return (
                            <tr key={item._id}>
                              <td className="border p-2 text-center">{idx + 1}</td>
                              <td className="border p-2">
                                <div className="flex gap-2 items-center">
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.title}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <span>{item.product.title}</span>
                                </div>
                              </td>
                              <td className="border p-2 text-right">₹{netUnitPrice.toFixed(2)}</td>
                              <td className="border p-2 text-center">{quantity}</td>
                              <td className="border p-2 text-right">₹{netAmount.toFixed(2)}</td>
                              <td className="border p-2 text-center">{taxRate}%</td>
                              <td className="border p-2 text-center">IGST</td>
                              <td className="border p-2 text-right">₹{taxAmount.toFixed(2)}</td>
                              <td className="border p-2 text-right">₹{total.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                        <tr className="bg-gray-50 font-bold">
                          <td colSpan={8} className="border p-2 text-right">Grand Total (inclusive of tax)</td>
                          <td className="border p-2 text-right">₹{grandTotal.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Amount in words */}
                  <div className="mb-2 text-base">
                    <span className="font-bold">Amount in Words: </span>
                    {numberToWords(grandTotal)}
                  </div>

                  {/* Reverse charge line */}
                  <div className="mb-4 text-base">
                    Whether tax is payable under reverse charge - <span className="font-semibold">No</span>
                  </div>

                  {/* QR Code with "visit selfysnap.com" text */}
                  <div className="flex flex-col items-center justify-center mb-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://selfysnap.com`}
                      alt="QR Code for selfysnap.com"
                      style={{ width: 100, height: 100 }}
                    />
                    <p className="text-sm text-gray-600 mt-1">visit selfysnap.com</p>
                  </div>

                  {/* Signature */}
                  <div className="text-right border-t pt-4 mt-2 text-base">
                    <p className="font-bold">For {sellers.profile?.businessDetails?.businessName || "Seller"}:</p>
                    <p className="mt-4 font-medium">Authorized Signatory</p>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-6 flex gap-3 justify-end no-print">
                    <Button variant="contained" onClick={handlePrintInvoice}>
                      Print Invoice
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
                      Download PDF
                    </Button>
                    <Button variant="outlined" onClick={handleCloseInvoice}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ERROR */}
      <Snackbar
        open={!!sellerOrder.error}
        autoHideDuration={6000}
        onClose={() => dispatch(clearError())}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="error" variant="filled">
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












































