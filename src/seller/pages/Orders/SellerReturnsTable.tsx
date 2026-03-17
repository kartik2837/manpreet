import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    styled,
    tableCellClasses,
    Chip,
} from "@mui/material";
import { api } from "../../../Config/Api";
import { formatDate } from "../../../customer/util/fomateDate";

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

const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    PENDING: "warning",
    APPROVED: "info",
    REJECTED: "error",
    REFUNDED: "success",
};

const SellerReturnsTable = () => {
    const [returns, setReturns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const jwt = localStorage.getItem("jwt") || "";

    useEffect(() => {
        const fetchReturns = async () => {
            try {
                // We use the same 'my' returns endpoint for now, or a backend optimized for sellers if available.
                // Assuming backend Return model has a 'seller' field as seen in returnController.
                const response = await api.get("/api/returns/my", {
                    headers: { Authorization: `Bearer ${jwt}` },
                });
                setReturns(response.data);
            } catch (error) {
                console.error("Failed to fetch returns", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReturns();
    }, [jwt]);

    if (loading) return <Typography sx={{ p: 4 }}>Loading returns...</Typography>;

    return (
        <Box>
            <Typography variant="h6" sx={{ pb: 3, fontWeight: "bold" }}>
                Customer Return Requests
            </Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Return ID</StyledTableCell>
                            <StyledTableCell>Product</StyledTableCell>
                            <StyledTableCell>Order ID</StyledTableCell>
                            <StyledTableCell>Reason</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">Update Date</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {returns.length > 0 ? (
                            returns.map((req) => (
                                <StyledTableRow key={req._id}>
                                    <StyledTableCell sx={{ fontSize: "11px" }}>{req._id}</StyledTableCell>
                                    <StyledTableCell>
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                            {req.order?.orderItems?.[0]?.product?.title || "Product details"}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>{req.order?._id}</StyledTableCell>
                                    <StyledTableCell>
                                        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                                            "{req.reason}"
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Chip
                                            size="small"
                                            label={req.status}
                                            color={statusColors[req.status] || "default"}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Typography variant="caption">
                                            {formatDate(req.createdAt)}
                                        </Typography>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    No return requests found for your products.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SellerReturnsTable;
