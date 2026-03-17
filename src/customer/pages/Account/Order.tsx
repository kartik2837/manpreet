import { useEffect } from 'react'
import OrderItemCard from './OrderItemCard'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchUserOrderHistory } from '../../../Redux Toolkit/Customer/OrderSlice';

const Order = () => {
  const dispatch = useAppDispatch()
  const { auth, orders } = useAppSelector(store => store);

  useEffect(() => {
    dispatch(fetchUserOrderHistory(localStorage.getItem("jwt") || ""))
  }, [auth.jwt])
  return (
    <div className='text-sm min-h-screen'>
      <div className='pb-5'>
        <h1 className='font-semibold'>All orders</h1>
        <p>from anytime</p>
      </div>
      <div className='space-y-4'>
        {orders?.parentOrders?.length > 0 ? (
          orders.parentOrders.map((parent: any) =>
            parent.subOrders.map((sub: any) =>
              sub.orderItems.map((item: any) => (
                <OrderItemCard
                  key={`${parent._id}-${sub._id}-${item._id}`}
                  item={item}
                  order={sub}
                />
              ))
            )
          )
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  )
}

export default Order