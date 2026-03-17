import { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    Box,
    Typography,
    styled,
    tableCellClasses,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
    fetchAdminReturns,
    approveReturn,
    rejectReturn,
    markRefunded,
} from "../../../Redux Toolkit/Admin/AdminReturnSlice";
import { formatDate } from "../../../customer/util/fomateDate";

/* ================== STYLES ================== */

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

/* ================== RETURN STATUS COLORS ================== */

const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    PENDING: "warning",
    APPROVED: "info",
    REJECTED: "error",
    REFUNDED: "success",
};

const AdminReturnsTable = () => {
    const dispatch = useAppDispatch();
    const { returns, loading, error } = useAppSelector((state) => state.adminReturns);
    const jwt = localStorage.getItem("jwt") || "";

    useEffect(() => {
        dispatch(fetchAdminReturns(jwt));
    }, [dispatch, jwt]);

    const handleApprove = (returnId: string) => {
        dispatch(approveReturn({ returnId, jwt }));
    };

    const handleReject = (returnId: string) => {
        dispatch(rejectReturn({ returnId, jwt }));
    };

    const handleRefunded = (returnId: string) => {
        dispatch(markRefunded({ returnId, jwt }));
    };

    if (loading) return <Typography sx={{ p: 4 }}>Loading returns...</Typography>;
    if (error) return <Typography color="error" sx={{ p: 4 }}>{error}</Typography>;

    return (
        <Box>
            <Typography variant="h6" sx={{ pb: 3, fontWeight: "bold" }}>
                Return Requests Management
            </Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Return ID</StyledTableCell>
                            <StyledTableCell>Product Details</StyledTableCell>
                            <StyledTableCell>Customer</StyledTableCell>
                            <StyledTableCell>Reason</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">Date</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {returns.length > 0 ? (
                            returns.map((req) => (
                                <StyledTableRow key={req._id}>
                                    <StyledTableCell sx={{ fontSize: "11px", fontWeight: "bold" }}>
                                        {req._id}
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <img
                                                src={req.order?.orderItems?.[0]?.product?.images?.[0]}
                                                alt="Product"
                                                style={{ width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover" }}
                                            />
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "12px" }}>
                                                    {req.order?.orderItems?.[0]?.product?.title || "Product details unavailable"}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Order ID: {req.order?._id}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        <Typography variant="body2">{req.user?.fullName}</Typography>
                                        <Typography variant="caption" color="textSecondary">{req.user?.email}</Typography>
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        <Typography variant="body2" sx={{ fontStyle: "italic", color: "textSecondary" }}>
                                            "{req.reason}"
                                        </Typography>
                                    </StyledTableCell>

                                    <StyledTableCell align="center">
                                        <Chip
                                            size="small"
                                            label={req.status}
                                            color={statusColors[req.status] || "default"}
                                            sx={{ fontWeight: "bold", fontSize: "10px" }}
                                        />
                                    </StyledTableCell>

                                    <StyledTableCell align="center">
                                        <Typography variant="caption">
                                            {formatDate(req.createdAt)}
                                        </Typography>
                                    </StyledTableCell>

                                    <StyledTableCell align="center">
                                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                            {req.status === "PENDING" && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => handleApprove(req._id)}
                                                        sx={{ fontSize: "10px" }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleReject(req._id)}
                                                        sx={{ fontSize: "10px" }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {req.status === "APPROVED" && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleRefunded(req._id)}
                                                    sx={{ fontSize: "10px" }}
                                                >
                                                    Mark Refunded
                                                </Button>
                                            )}
                                            {(req.status === "REFUNDED" || req.status === "REJECTED") && (
                                                <Typography variant="caption" sx={{ fontWeight: "bold", color: "gray" }}>
                                                    COMPLETED
                                                </Typography>
                                            )}
                                        </Box>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    No return requests found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminReturnsTable;
