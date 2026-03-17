import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import {
  createAddress,
  updateAddress,
} from '../../../Redux Toolkit/Customer/addressSlice';
import type { Address } from '../../../types/userTypes';

const ContactSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    .required('Required'),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, 'Invalid pincode')
    .required('Required'),
  address: Yup.string().required('Required'),
  locality: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
});

interface AddressFormProp {
  handleClose: () => void;
  editData?: Address;
}

type AddressFormValues = {
  name: string;
  mobile: string;
  pinCode: string;
  address: string;
  locality: string;
  city: string;
  state: string;
};

const AddressForm: React.FC<AddressFormProp> = ({
  handleClose,
  editData,
}) => {
  const dispatch = useAppDispatch();

  const formik = useFormik<AddressFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: editData?.name || '',
      mobile: editData?.mobile || '',
      pinCode: editData?.pinCode || '',
      address: editData?.address || '',
      locality: editData?.locality || '',
      city: editData?.city || '',
      state: editData?.state || '',
    },
    validationSchema: ContactSchema,
    onSubmit: async (values) => {
      try {
        const jwt = localStorage.getItem('jwt') || '';

        if (editData?._id) {
          await dispatch(
            updateAddress({
              id: editData._id,
              data: values,
              jwt,
            })
          ).unwrap();
        } else {
          await dispatch(
            createAddress({
              data: values,
              jwt,
            })
          ).unwrap();
        }

        handleClose();
      } catch (err: any) {
        alert(err.message || 'Failed to save address');
      }
    },
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        mb={3}
      >
        {editData ? 'Edit Address' : 'Add Delivery Address'}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          {Object.keys(formik.values).map((key) => (
            <TextField
              key={key}
              fullWidth
              size="small"
              name={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={(formik.values as any)[key]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                (formik.touched as any)[key] &&
                Boolean((formik.errors as any)[key])
              }
              helperText={
                (formik.touched as any)[key] &&
                (formik.errors as any)[key]
              }
            />
          ))}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: '12px',
              fontWeight: 'bold',
              borderRadius: 2,
              mt: 1,
            }}
          >
            {editData ? 'Update Address' : 'Save Address'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddressForm;
