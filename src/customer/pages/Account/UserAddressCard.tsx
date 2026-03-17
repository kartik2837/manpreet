import type { Address } from '../../../types/userTypes';
import { useState } from 'react';
import { Button, Modal, Box } from '@mui/material';
import AddressForm from '../Checkout/AddresssForm';

interface UserAddressCardProps {
  item: Address;
  onDelete: () => void;
}

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

const UserAddressCard = ({ item, onDelete }: UserAddressCardProps) => {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <div className="p-5 border rounded-md space-y-3">
        <h1 className="font-semibold">{item.name}</h1>

        <p className="w-[320px]">
          {item.address}, {item.locality}, {item.city}, {item.state} - {item.pinCode}
        </p>

        <p>
          <strong>Mobile: </strong> {item.mobile}
        </p>

        <div className="flex space-x-2 mt-2">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setOpenEdit(true)}
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={style}>
          <AddressForm
            handleClose={() => setOpenEdit(false)}
            editData={item}
          />
        </Box>
      </Modal>
    </>
  );
};

export default UserAddressCard;
