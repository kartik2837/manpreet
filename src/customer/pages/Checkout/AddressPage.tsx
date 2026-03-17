import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControlLabel, Modal, Radio, RadioGroup } from '@mui/material';
import AddressForm from './AddresssForm';
import AddressCard from './AddressCard';
import PricingCard from '../Cart/PricingCard';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchAddresses } from '../../../Redux Toolkit/Customer/addressSlice';
import { createOrder } from '../../../Redux Toolkit/Customer/OrderSlice';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const paymentGatewayList = [
  {
    value: 'RAZORPAY',
    name: 'Online',
    label: 'Razorpay',
    image: "/online.png"
  },
  {
    value: 'COD',
    name: 'COD',
    label: 'Cash on Delivery',
    image: "/cashon.png"
  },
];

const AddressPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { addresses } = useAppSelector((store) => store.address);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paymentGateway, setPaymentGateway] = useState(paymentGatewayList[0].value);
  const [open, setOpen] = useState(false);
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null);
  const [checkingServiceability, setCheckingServiceability] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt') || '';
    if (jwt) dispatch(fetchAddresses(jwt));
  }, [dispatch]);

  const navigate = useNavigate();

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.value);
    setSelectedIndex(index);
    checkPincode(addresses[index].pinCode);
  };

  const checkPincode = async (pincode: string) => {
    if (!pincode) return;
    setCheckingServiceability(true);
    try {
      const { api } = await import('../../../Config/Api');
      const response = await api.get(`/api/delivery-partners/check-serviceability/${pincode}`);
      setIsServiceable(response.data.isServiceable);
    } catch (error) {
      console.error("Serviceability check failed:", error);
      setIsServiceable(true);
    } finally {
      setCheckingServiceability(false);
    }
  };

  useEffect(() => {
    if (addresses.length > 0) {
      checkPincode(addresses[selectedIndex].pinCode);
    }
  }, [addresses]);

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentGateway(event.target.value);
  };

  const handlePlaceOrder = async () => {
    if (!addresses || addresses.length === 0) {
      alert("Please add/select a delivery address.");
      return;
    }

    try {
      const jwt = localStorage.getItem("jwt") || "";

      const res = await dispatch(
        createOrder({
          address: addresses[selectedIndex],
          paymentGateway,
          jwt,
        })
      ).unwrap();

      if (res?.payment_link_url) {
        window.location.href = res.payment_link_url;
      } else {
        const orderId = res?.orderId || res?.parentOrderId || res?.paymentOrderId;
        if (orderId) {
          navigate(`/payment-success/${orderId}`);
        }
      }

    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  return (
    <div className="pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen">
      <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">

        <div className="col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Select Delivery Address</span>
            <Button onClick={() => setOpen(true)} variant="outlined">
              Add New Address
            </Button>
          </div>

          <div className="text-xs font-medium space-y-3">
            {addresses.length ? (
              <RadioGroup value={selectedIndex} onChange={handleAddressChange}>
                {addresses.map((addr, index) => (
                  <AddressCard
                    key={addr._id}
                    value={index}
                    selectedValue={selectedIndex}
                    handleChange={handleAddressChange}
                    item={addr}
                  />
                ))}
              </RadioGroup>
            ) : (
              <p>No saved addresses found.</p>
            )}
          </div>
        </div>

        <div className="col-span-1 text-sm space-y-3">
          <section className="space-y-3 border p-5 rounded-md">
            <h1 className="text-primary-color font-medium pb-2 text-center">
              Choose Payment Gateway
            </h1>

            <RadioGroup
              row
              value={paymentGateway}
              onChange={handlePaymentChange}
              className="flex justify-between pr-0"
            >
              {paymentGatewayList.map((item) => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio />}
                  label={
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-80 h-16 object-contain"
                      />
                    </div>
                  }
                  className={`border w-[45%] flex justify-center rounded-md pr-2 ${paymentGateway === item.value ? 'border-primary-color' : ''
                    }`}
                />
              ))}
            </RadioGroup>
          </section>

          <section className="border rounded-md">
            <PricingCard />
            <div className="p-5 space-y-2">
              {isServiceable === false && (
                <p className="text-red-500 text-xs text-center font-medium">
                  Sorry, we don't deliver to this pincode yet.
                </p>
              )}
              <Button
                onClick={handlePlaceOrder}
                sx={{ py: '11px' }}
                variant="contained"
                fullWidth
                disabled={isServiceable === false || checkingServiceability}
              >
                {checkingServiceability ? 'Checking...' : 'Place Order'}
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <AddressForm handleClose={() => setOpen(false)} />
        </Box>
      </Modal>
    </div>
  );
};

export default AddressPage;
