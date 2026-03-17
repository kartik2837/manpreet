import { Button, Divider, IconButton } from '@mui/material';
import React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { CartItem } from '../../../types/cartTypes';
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import { deleteCartItem, updateCartItem } from '../../../Redux Toolkit/Customer/CartSlice';

interface CartItemProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleUpdateQuantity = (value: number) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    dispatch(
      updateCartItem({
        jwt,
        cartItemId: item._id,
        cartItem: { quantity: item.quantity + value }
      })
    );
  };

  const handleRemoveCartItem = () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    dispatch(
      deleteCartItem({
        jwt,
        cartItemId: item._id
      })
    );
  };

  return (
    <div className='border rounded-md relative bg-white'>

      {/* ===== PRODUCT INFO ===== */}
      <div className='p-5 flex gap-3'>

        <div>
          <img
            className='w-[90px] rounded-md object-contain'
            src={item.product?.images?.[0] || "/placeholder.png"}
            alt={item.product?.title || "product"}
          />
        </div>

        <div className='space-y-2'>

          {/* Product Title */}
          <p className='text-gray-600 font-medium text-sm'>
            {item.product?.title || "Unnamed Product"}
          </p>

          {/* Sold By */}
          <p className='text-gray-400 text-xs'>
            <strong>Sold by:</strong>{" "}
            {item.product?.seller?.businessDetails?.businessName || "Unknown"}
          </p>

          <p className='text-xs'>
            <strong>7 days replacement</strong> available
          </p>

          <p className='text-sm text-gray-500'>
            <strong>Quantity :</strong> {item.quantity}
          </p>
        </div>
      </div>

      <Divider />

      {/* ===== QUANTITY + PRICE ===== */}
      <div className='px-5 py-2 flex justify-between items-center'>

        <div className='flex items-center gap-2 w-[140px] justify-between'>

          <Button
            size='small'
            disabled={item.quantity <= 1}
            onClick={() => handleUpdateQuantity(-1)}
          >
            <RemoveIcon />
          </Button>

          <span className='px-3 font-semibold'>
            {item.quantity}
          </span>

          <Button
            size='small'
            onClick={() => handleUpdateQuantity(1)}
          >
            <AddIcon />
          </Button>

        </div>

        <div>
          <p className='text-gray-700 font-medium'>
            ₹{item.sellingPrice}
          </p>
        </div>

      </div>

      {/* ===== REMOVE BUTTON ===== */}
      <div className='absolute top-1 right-1'>
        <IconButton onClick={handleRemoveCartItem} color='primary'>
          <CloseIcon />
        </IconButton>
      </div>

    </div>
  );
};

export default CartItemCard;
