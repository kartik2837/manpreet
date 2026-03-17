import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import UserAddressCard from './UserAddressCard';
import { fetchAddresses, deleteAddress } from '../../../Redux Toolkit/Customer/addressSlice';

const Addresses = () => {
  const dispatch = useAppDispatch();
  const { addresses, loading, error } = useAppSelector((store) => store.address);

  // 🔹 Fetch addresses on mount
  useEffect(() => {
    const jwt = localStorage.getItem('jwt') || '';
    if (jwt) dispatch(fetchAddresses(jwt));
  }, [dispatch]);

  const handleDelete = (id: string) => {
    const jwt = localStorage.getItem('jwt') || '';
    if (window.confirm('Are you sure you want to delete this address?')) {
      dispatch(deleteAddress({ id, jwt }));
    }
  };

  return (
    <div className="space-y-3">
      {loading && <p>Loading addresses...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {addresses.length === 0 && !loading && <p>No addresses found.</p>}

      {addresses.map((item) => (
        <UserAddressCard
          key={item._id}
          item={item}
          onDelete={() => handleDelete(item._id!)}
        />
      ))}
    </div>
  );
};

export default Addresses;
