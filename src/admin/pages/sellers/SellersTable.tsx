import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Button,
  FormControl,
  Menu,
  MenuItem,
  Select,
  styled,
  Chip,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchSellers,
  updateSellerAccountStatus,
  registerDelhivery,
} from "../../../Redux Toolkit/Seller/sellerSlice";

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

const accountStatuses = [
  { status: "PENDING_VERIFICATION", title: "Pending Verification" },
  { status: "ACTIVE", title: "Active" },
  { status: "SUSPENDED", title: "Suspended" },
  { status: "DEACTIVATED", title: "Deactivated" },
  { status: "BANNED", title: "Banned" },
  { status: "CLOSED", title: "Closed" },
];

export default function SellersTable() {
  const [accountStatus, setAccountStatus] = React.useState("ACTIVE");
  const { sellers } = useAppSelector((store) => store.sellers);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchSellers(accountStatus));
  }, [accountStatus, dispatch]);

  const handleAccountStatusChange = (event: any) => {
    setAccountStatus(event.target.value);
  };

  const handleUpdateSellerAccountStatus = (id: string, status: string) => {
    dispatch(updateSellerAccountStatus({ id, status }));
  };

  const handleRegisterDelhivery = (id: string) => {
    dispatch(registerDelhivery(id));
  };

  const [anchorEl, setAnchorEl] = React.useState<
    Record<string, HTMLElement | null>
  >({});

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    sellerId: string
  ) => {
    setAnchorEl((prev) => ({ ...prev, [sellerId]: event.currentTarget }));
  };

  const handleClose = (sellerId: string) => {
    setAnchorEl((prev) => ({ ...prev, [sellerId]: null }));
  };

  return (
    <>
      <div className="pb-5 w-60">
        <FormControl fullWidth>
          <Select value={accountStatus} onChange={handleAccountStatusChange}>
            {accountStatuses.map((status) => (
              <MenuItem key={status.status} value={status.status}>
                {status.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Seller Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile</StyledTableCell>
              <StyledTableCell>GSTIN</StyledTableCell>
              <StyledTableCell>Business Name</StyledTableCell>
              <StyledTableCell>Warehouse Code</StyledTableCell>
<StyledTableCell>Account Number</StyledTableCell>
<StyledTableCell>IFSC Code</StyledTableCell>
              <StyledTableCell align="right">Account Status</StyledTableCell>
              <StyledTableCell align="right">Change Status</StyledTableCell>
              <StyledTableCell align="right">Logistics</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sellers?.map((seller) => (
              <StyledTableRow key={seller._id}>
                <StyledTableCell>{seller.sellerName}</StyledTableCell>
                <StyledTableCell>{seller.email}</StyledTableCell>
                <StyledTableCell>{seller.mobile}</StyledTableCell>
                <StyledTableCell>{seller.GSTIN}</StyledTableCell>
                <StyledTableCell>
                  {seller.businessDetails?.businessName}
                </StyledTableCell>
                <StyledTableCell>
                  {seller.delhiveryWarehouseCode || "-"}
                </StyledTableCell>
<StyledTableCell>{seller.bankDetails?.accountNumber || "-"}</StyledTableCell>
<StyledTableCell>{seller.bankDetails?.ifscCode || "-"}</StyledTableCell>

                <StyledTableCell align="right">
                  {seller.accountStatus}
                </StyledTableCell>

                <StyledTableCell align="right">
                  <Button
                    disabled={!seller._id}
                    onClick={(e) =>
                      seller._id && handleClick(e, seller._id)
                    }
                  >
                    Change Status
                  </Button>

                  {seller._id && (
                    <Menu
                      anchorEl={anchorEl[seller._id]}
                      open={Boolean(anchorEl[seller._id])}
                      onClose={() => seller._id !== undefined && handleClose(seller._id)}
                    >
                      {accountStatuses.map((status) => (
                        <MenuItem
                          key={status.status}
                          onClick={() => {
                            if (seller._id !== undefined) {
                              handleUpdateSellerAccountStatus(seller._id, status.status);
                              handleClose(seller._id);
                            }
                          }}
                        >
                          {status.title}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}

                </StyledTableCell>

                <StyledTableCell align="right">
                  {!seller.delhiveryWarehouseCode ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => seller._id && handleRegisterDelhivery(seller._id)}
                    >
                      Register Delhivery
                    </Button>
                  ) : (
                    <Chip label="Registered" size="small" color="success" />
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}



























