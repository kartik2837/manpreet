import { Box, Button, Divider } from '@mui/material';
import { useEffect } from 'react';
import PaymentsIcon from '@mui/icons-material/Payments';
import OrderStepper from './OrderStepper';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import {
  cancelOrder,
  createReturnRequest,
  fetchOrderById,
  fetchOrderItemById,
} from '../../../Redux Toolkit/Customer/OrderSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { fixTrackingLink } from '../../../util/trackingLinkFixer';

const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { auth, orders } = useAppSelector(store => store);

  // Get orderId and orderItemId from URL params
  const { orderItemId, orderId } = useParams<{ orderItemId: string; orderId: string }>();

  // Fetch order and order item data on mount
  useEffect(() => {
    if (!orderItemId || !orderId) return;

    const jwt = auth.jwt || localStorage.getItem('jwt') || '';

    dispatch(fetchOrderItemById({ orderItemId, jwt }));
    dispatch(fetchOrderById({ orderId, jwt }));
  }, [auth.jwt, orderId, orderItemId, dispatch]);

  const handleReturnOrder = () => {
    const reason = prompt("Please enter the reason for return:");
    if (reason && orderId) {
      const jwt = auth.jwt || localStorage.getItem('jwt') || '';
      dispatch(createReturnRequest({ orderId, reason, jwt }));
      alert("Return request submitted successfully!");
    }
  };

  // Handle order cancel
  const handleCancelOrder = () => {
    if (!orderId) return;

    const jwt = auth.jwt || localStorage.getItem('jwt') || '';

    dispatch(cancelOrder({ orderId, jwt }));
  };

  if (orders.loading) {
    return <div className="h-[80vh] flex justify-center items-center">Loading order details...</div>;
  }

  if (!orders.orderItem || !orders.currentOrder) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        No order found
      </div>
    );
  }

  const orderItem = orders.orderItem;
  const currentOrder = orders.currentOrder;

  return (
    <Box className="space-y-5">
      {/* Product Info Section */}
      <section className="flex flex-col gap-5 justify-center items-center">
        <img className="w-[100px] h-[100px] object-cover rounded shadow" src={orderItem.product.images[0]} alt={orderItem.product.title} />
        <div className="text-sm space-y-1 text-center">
          <h1 className="font-bold text-lg">
            {currentOrder.seller?.businessDetails?.businessName || orderItem.product.seller?.businessDetails?.businessName || 'SSB'}
          </h1>
          <p className="text-gray-600">{orderItem.product.title}</p>
          <p>
            <strong>Size:</strong> {orderItem.size} | <strong>Quantity:</strong> {orderItem.quantity}
          </p>
        </div>
        <div className='flex gap-4'>
          <Button variant="outlined" onClick={() => navigate(`/reviews/${orderItem.product._id}/create`)}>
            Write Review
          </Button>
          {currentOrder.orderStatus === 'DELIVERED' && (
            <Button variant="outlined" color="warning" onClick={handleReturnOrder}>
              Return Item
            </Button>
          )}
        </div>
      </section>

      {/* Order Status Section */}
      <section className="border p-5 rounded-md shadow-sm">
        <div className='flex justify-between items-center mb-4'>
          <h1 className='font-bold'>Order Tracking</h1>
          {currentOrder.trackingLink && (
            <Button variant="text" size="small" href={fixTrackingLink(currentOrder.trackingLink)} target="_blank">
              Track on Delhivery
            </Button>
          )}
        </div>
        <OrderStepper orderStatus={currentOrder?.orderStatus} />
        {currentOrder.trackingId && (
          <p className='text-xs text-center text-gray-500 mt-2'>Tracking ID: {currentOrder.trackingId}</p>
        )}
      </section>

      {/* Delivery Address Section */}
      <div className="border p-5 rounded-md shadow-sm">
        <h1 className="font-bold pb-3">Delivery Address</h1>
        <div className="text-sm space-y-2">
          <div className="flex gap-5 font-medium">
            <p>{currentOrder?.shippingAddress.name}</p>
            <Divider flexItem orientation="vertical" />
            <p>{currentOrder?.shippingAddress.mobile}</p>
          </div>
          <p>
            {currentOrder?.shippingAddress.address}, {currentOrder?.shippingAddress.city}, {currentOrder?.shippingAddress.state} - {currentOrder?.shippingAddress.pinCode}
          </p>
        </div>
      </div>

      {/* Payment & Pricing Section */}
      <div className="border space-y-4 rounded-md shadow-sm">
        <div className="flex justify-between text-sm pt-5 px-5">
          <div className="space-y-1">
            <p className="font-bold">Total Item Price</p>
            {orderItem.mrpPrice > orderItem.sellingPrice && (
              <p>
                You saved{' '}
                <span className="text-green-500 font-medium text-xs">
                  ₹{orderItem.mrpPrice - orderItem.sellingPrice}.00
                </span>{' '}
                on this item
              </p>
            )}
          </div>
          <p className="font-medium">₹ {orderItem.sellingPrice * orderItem.quantity}.00</p>
        </div>

        <div className="px-5">
          <div className="bg-orange-50 px-5 py-3 text-xs font-semibold flex items-center justify-between rounded">
            <div className='flex items-center gap-3'>
              <PaymentsIcon />
              <span>Payment Mode: {(
                (currentOrder.parentOrder as any)?.paymentOrder?.paymentMethod?.toUpperCase() === 'COD' ||
                currentOrder.paymentMethod?.toUpperCase() === 'COD' ||
                currentOrder.paymentDetails?.method?.toUpperCase() === 'COD' ||
                currentOrder.paymentStatus === 'COD_PENDING'
              ) ? 'Cash on Delivery' : 'Online'}</span>
            </div>
            {currentOrder?.paymentStatus === 'PAID' || currentOrder?.paymentDetails?.status === 'PAID' ? (
              <p className="text-green-600 font-bold uppercase tracking-wider">PAID</p>
            ) : (
              <div className="flex items-center gap-5">
                {(
                  (currentOrder.parentOrder as any)?.paymentOrder?.paymentMethod?.toUpperCase() === 'COD' ||
                  currentOrder?.paymentMethod === 'COD' ||
                  currentOrder?.paymentDetails?.method === 'COD' ||
                  currentOrder?.paymentStatus === 'COD_PENDING'
                ) && (
                    <p className='text-orange-600 font-bold uppercase tracking-wider'>Cash On Delivery</p>
                  )}
                {currentOrder.paymentLinkUrl && (currentOrder?.paymentStatus === 'PENDING') && (
                  <Button variant="contained" size="small" onClick={() => window.location.href = currentOrder?.paymentLinkUrl || '/'}>
                    Pay Now
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <Divider />

        <div className="px-5 pb-5">
          <p className="text-xs">
            <strong>Sold by: </strong>
            {currentOrder.seller?.businessDetails?.businessName || orderItem.product.seller?.businessDetails?.businessName || 'SSB'}
          </p>
        </div>

        {/* Cancel Order Button */}
        {['PENDING', 'PLACED', 'CONFIRMED'].includes(currentOrder.orderStatus) && (
          <div className="px-5 pb-5">
            <Button
              onClick={handleCancelOrder}
              color="error"
              sx={{ py: '0.7rem' }}
              variant="outlined"
              fullWidth
            >
              Cancel Order
            </Button>
          </div>
        )}
      </div>
    </Box>
  );
};

export default OrderDetails;
