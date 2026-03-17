import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { registerSelfDelhivery } from "../../../Redux Toolkit/Seller/sellerSlice";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Modal,
  Snackbar,
} from "@mui/material";
import ProfileFieldCard from "./ProfileFildCard";
import EditIcon from "@mui/icons-material/Edit";
import PersonalDetailsForm from "./PersionalDetailsForm";
import BusinessDetailsForm from "./BussinessDetailsForm";
import PickupAddressForm from "./PickupAddressForm";
import BankDetailsForm from "./BankDetailsForm";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Profile = () => { // ✅ removed : JSX.Element
  const dispatch = useAppDispatch();
  const { sellers } = useAppSelector((store) => store);
  const [open, setOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState("personalDetails");
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const handleClose = () => setOpen(false);

  const handleOpen = (formName: string) => {
    setOpen(true);
    setSelectedForm(formName);
  };

  const renderSelectedForm = () => {
    switch (selectedForm) {
      case "personalDetails":
        return <PersonalDetailsForm onClose={handleClose} />;
      case "businessDetails":
        return <BusinessDetailsForm onClose={handleClose} />;
      case "pickupAddress":
        return <PickupAddressForm onClose={handleClose} />;
      case "bankDetails":
        return <BankDetailsForm onClose={handleClose} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (sellers.profileUpdated || sellers.error) {
      setOpenSnackbar(true);
    }
  }, [sellers.profileUpdated, sellers.error]);

  return (
    <div className="lg:px-20 pt-5 pb-20 space-y-20">
      {/* PERSONAL DETAILS */}
      <div className="lg:w-[70%]">
        <div className="flex items-center justify-between pb-3">
          <h1 className="text-2xl font-bold text-gray-600">{sellers.profile?.sellerName}</h1>
          <Button
            onClick={() => handleOpen("personalDetails")}
            size="small"
            variant="contained"
            sx={{ borderRadius: "2.9rem" }}
          >
            <EditIcon />
          </Button>
        </div>

        <Avatar
          sx={{ width: "10rem", height: "10rem", bgcolor: "primary.main", fontSize: "4rem" }}
        >
          {sellers.profile?.sellerName?.[0]}
        </Avatar>

        <ProfileFieldCard label="Seller Name" value={sellers.profile?.sellerName} />
        <Divider />
        <ProfileFieldCard label="Seller Email" value={sellers.profile?.email} />
        <Divider />
        <ProfileFieldCard label="Seller Mobile" value={sellers.profile?.mobile} />
      </div>

      {/* BUSINESS DETAILS */}
      <div className="lg:w-[70%]">
        <div className="flex items-center justify-between pb-3">
          <h1 className="text-2xl font-bold text-gray-600">Business Details</h1>
          <Button
            onClick={() => handleOpen("businessDetails")}
            size="small"
            variant="contained"
            sx={{ borderRadius: "2.9rem" }}
          >
            <EditIcon />
          </Button>
        </div>

        <ProfileFieldCard
          label="Business Name / Brand Name"
          value={sellers.profile?.businessDetails?.businessName}
        />
        <Divider />
        <ProfileFieldCard label="GSTIN" value={sellers.profile?.GSTIN} />
        <Divider />
        <ProfileFieldCard
          label="Account Status"
          value={sellers.profile?.accountStatus}
        />
        <Divider />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <ProfileFieldCard
            label="Delhivery Warehouse Code"
            value={sellers.profile?.delhiveryWarehouseCode || "Not Registered"}
          />
          {!sellers.profile?.delhiveryWarehouseCode && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => dispatch(registerSelfDelhivery())}
              disabled={sellers.loading}
            >
              {sellers.loading ? "Registering..." : "Register Logistics"}
            </Button>
          )}
        </Box>
      </div>

      {/* PICKUP ADDRESS */}
      <div className="lg:w-[70%]">
        <div className="flex items-center justify-between pb-3">
          <h1 className="text-2xl font-bold text-gray-600">Pickup Address</h1>
          <Button
            onClick={() => handleOpen("pickupAddress")}
            size="small"
            variant="contained"
            sx={{ borderRadius: "2.9rem" }}
          >
            <EditIcon />
          </Button>
        </div>

        <ProfileFieldCard
          label="Address"
          value={sellers.profile?.pickupAddress?.address}
        />
        <Divider />
        <ProfileFieldCard
          label="City"
          value={sellers.profile?.pickupAddress?.city}
        />
        <Divider />
        <ProfileFieldCard
          label="State"
          value={sellers.profile?.pickupAddress?.state}
        />
        <Divider />
        <ProfileFieldCard
          label="Mobile"
          value={sellers.profile?.pickupAddress?.mobile}
        />
      </div>

      {/* BANK DETAILS */}
      <div className="lg:w-[70%]">
        <div className="flex items-center justify-between pb-3">
          <h1 className="text-2xl font-bold text-gray-600">Bank Details</h1>
          <Button
            onClick={() => handleOpen("bankDetails")}
            size="small"
            variant="contained"
            sx={{ borderRadius: "2.9rem" }}
          >
            <EditIcon />
          </Button>
        </div>

        <ProfileFieldCard
          label="Account Holder Name"
          value={sellers.profile?.bankDetails?.accountHolderName}
        />
        <Divider />
        <ProfileFieldCard
          label="Account Number"
          value={sellers.profile?.bankDetails?.accountNumber}
        />
        <Divider />
        <ProfileFieldCard
          label="IFSC Code"
          value={sellers.profile?.bankDetails?.ifscCode}
        />
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>{renderSelectedForm()}</Box>
      </Modal>

      {/* SNACKBAR */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={sellers.error ? "error" : "success"}
          variant="filled"
        >
          {sellers.error || "Profile Updated Successfully"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
