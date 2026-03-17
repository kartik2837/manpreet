import React from 'react'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderItem } from '../../../types/orderTypes';
import { formatDate } from '../../util/fomateDate';
import { fixTrackingLink } from '../../../util/trackingLinkFixer';

interface OrderItemCardProps {
    item: OrderItem,
    order: Order
}
const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, order }) => {

    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(`/account/orders/${order._id}/item/${item._id}`)} className='text-sm bg-white p-5 space-y-4 border rounded-md cursor-pointer hover:shadow-md transition-shadow'>

            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <Avatar sizes='small' sx={{ bgcolor: "#ee915f" }}>
                        <ElectricBoltIcon />
                    </Avatar>
                    <div>
                        <h1 className='font-bold text-orange-500 uppercase'>{order.orderStatus}</h1>
                        <p className='text-xs text-gray-500'>Arriving by {formatDate(order.deliverDate)}</p>
                    </div>
                </div>
                {order.trackingLink && (
                    <a
                        href={fixTrackingLink(order.trackingLink)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-blue-600 hover:underline text-xs font-semibold'
                        onClick={(e) => e.stopPropagation()} // Prevent navigating to details
                    >
                        Track Shipment
                    </a>
                )}
            </div>
            <div className='p-4 bg-orange-50 flex gap-3 rounded-md'>
                <div className='flex-shrink-0'>
                    <img className='w-16 h-16 object-cover rounded'
                        src={item.product?.images?.[0]} alt={item.product?.title} />
                </div>
                <div className='w-full space-y-1'>
                    <h1 className='font-bold text-gray-800'>{item.product?.title}</h1>
                    <p className='text-xs text-gray-600'>Seller: {order.seller?.businessDetails?.businessName || item.product?.seller?.businessDetails?.businessName || 'SSB'}</p>
                    <p className='text-xs'>
                        <strong>Size: </strong>{item.size || 'FREE'} | <strong>Qty: </strong>{item.quantity}
                    </p>
                    <p className='font-semibold text-gray-900'>₹{item.sellingPrice}</p>
                </div>
            </div>

        </div>
    )
}

export default OrderItemCard