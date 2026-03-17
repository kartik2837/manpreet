import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { type UpdateDetailsFormProps } from "./BussinessDetailsForm";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateSeller } from "../../../Redux Toolkit/Seller/sellerSlice";


const PickupAddressForm = ({ onClose }: UpdateDetailsFormProps) => {
  const { sellers } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      locality: "",
      city: "",
      state: "",
      pinCode: "",
      mobile: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      address: Yup.string().required("Address is required"),
      locality: Yup.string().required("Locality is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      pinCode: Yup.string()
        .required("Pincode is required")
        .matches(/^[0-9]{6}$/, "Must be a 6-digit pincode"),
      mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Must be a 10-digit mobile number"),
    }),
    onSubmit: (values) => {
      console.log(values);
      dispatch(
        updateSeller({
          pickupAddress: values,
        })
      );
      onClose();
    },
  });

  useEffect(() => {
    if (sellers.profile?.pickupAddress) {
      formik.setValues({
        name: sellers.profile.pickupAddress?.name || "",
        address: sellers.profile.pickupAddress?.address || "",
        locality: sellers.profile.pickupAddress?.locality || "",
        city: sellers.profile.pickupAddress?.city || "",
        state: sellers.profile.pickupAddress?.state || "",
        pinCode: sellers.profile.pickupAddress?.pinCode || "",
        mobile: sellers.profile.pickupAddress?.mobile || "",
      });
    }
  }, [sellers.profile]);

  return (
    <>
      <h1 className="text-xl pb-5 text-center font-bold text-gray-600">
        Pickup Address
      </h1>
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Contact Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          id="address"
          name="address"
          label="Address (House No, Building, Street)"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        <TextField
          fullWidth
          id="locality"
          name="locality"
          label="Locality / Area / Landmark"
          value={formik.values.locality}
          onChange={formik.handleChange}
          error={formik.touched.locality && Boolean(formik.errors.locality)}
          helperText={formik.touched.locality && formik.errors.locality}
        />
        <div className="flex gap-2">
          <TextField
            fullWidth
            id="city"
            name="city"
            label="City"
            value={formik.values.city}
            onChange={formik.handleChange}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />
          <TextField
            fullWidth
            id="state"
            name="state"
            label="State"
            value={formik.values.state}
            onChange={formik.handleChange}
            error={formik.touched.state && Boolean(formik.errors.state)}
            helperText={formik.touched.state && formik.errors.state}
          />
        </div>
        <div className="flex gap-2">
          <TextField
            fullWidth
            id="pinCode"
            name="pinCode"
            label="Pincode"
            value={formik.values.pinCode}
            onChange={formik.handleChange}
            error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
            helperText={formik.touched.pinCode && formik.errors.pinCode}
          />
          <TextField
            fullWidth
            id="mobile"
            name="mobile"
            label="Mobile"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />
        </div>
        <Button
          sx={{ py: ".9rem" }}
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
        >
          Save
        </Button>
      </form>
    </>
  );
};

export default PickupAddressForm;
