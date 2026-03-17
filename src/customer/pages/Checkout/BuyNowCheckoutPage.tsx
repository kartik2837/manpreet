import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Divider, FormControlLabel, Modal, Radio, RadioGroup } from '@mui/material';
import AddressForm from './AddresssForm';
import AddressCard from './AddressCard';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchAddresses } from '../../../Redux Toolkit/Customer/addressSlice';
import { createBuyNowOrder, clearBuyNow } from '../../../Redux Toolkit/Customer/BuyNowSlice';

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

const BuyNowCheckoutPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { addresses } = useAppSelector((store) => store.address);
    const { product, quantity, size, loading } = useAppSelector((store) => store.buyNow);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [paymentGateway, setPaymentGateway] = useState(paymentGatewayList[0].value);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const jwt = localStorage.getItem('jwt') || '';
        if (jwt) dispatch(fetchAddresses(jwt));
    }, [dispatch]);

    // If no product in buy now state, redirect back
    useEffect(() => {
        if (!product) {
            navigate('/');
        }
    }, [product, navigate]);

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIndex(Number(event.target.value));
    };

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentGateway(event.target.value);
    };

    const handlePlaceOrder = async () => {
        if (!addresses || addresses.length === 0) {
            alert("Please add/select a delivery address.");
            return;
        }

        if (!product?._id) return;

        try {
            const jwt = localStorage.getItem("jwt") || "";

            const res = await dispatch(
                createBuyNowOrder({
                    address: addresses[selectedIndex],
                    paymentGateway,
                    jwt,
                    productId: product._id,
                    quantity,
                    size,
                })
            ).unwrap();

            if (res?.payment_link_url) {
                window.location.href = res.payment_link_url;
            }

            if (res?.orderId) {
                dispatch(clearBuyNow());
                navigate(`/payment-success/${res.orderId}`);
            }
        } catch (error) {
            console.error("Buy Now order failed:", error);
        }
    };

    if (!product) return null;

    const totalMrp = product.mrpPrice * quantity;
    const totalSelling = product.sellingPrice * quantity;
    const discount = totalMrp - totalSelling;

    return (
        <div className="pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen">
            <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">

                {/* Left: Address */}
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

                {/* Right: Product Summary + Payment */}
                <div className="col-span-1 text-sm space-y-3">

                    {/* Product Summary */}
                    <section className="border p-5 rounded-md space-y-3">
                        <h1 className="text-primary-color font-medium pb-2 text-center">Order Summary</h1>
                        <div className="flex gap-3">
                            {product.images?.[0] && (
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-20 h-20 object-cover rounded-md border"
                                />
                            )}
                            <div className="flex-1 space-y-1">
                                <p className="font-semibold text-gray-800 line-clamp-2">{product.title}</p>
                                <p className="text-gray-500 text-xs">
                                    {product.seller?.businessDetails?.businessName}
                                </p>
                                <p className="text-xs text-gray-600">Qty: {quantity}</p>
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="border rounded-md">
                        <div className="space-y-3 p-5">
                            <div className="flex justify-between items-center">
                                <span>Subtotal</span>
                                <span>₹ {totalMrp}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Discount</span>
                                <span className="text-green-600">- ₹ {discount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Shipping</span>
                                <span>₹ 79</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Platform fee</span>
                                <span className="text-orange-500">Free</span>
                            </div>
                        </div>
                        <Divider />
                        <div className="font-medium px-5 py-2 flex justify-between items-center">
                            <span>Total</span>
                            <span>₹ {totalSelling}</span>
                        </div>
                    </section>

                    {/* Payment Gateway */}
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

                    {/* Place Order */}
                    <div className="p-2">
                        <Button
                            onClick={handlePlaceOrder}
                            sx={{ py: '11px' }}
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    </div>
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

export default BuyNowCheckoutPage;
