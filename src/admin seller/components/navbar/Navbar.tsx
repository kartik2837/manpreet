import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Box, Drawer, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useAppSelector } from '../../../Redux Toolkit/Store';

const Navbar = ({ DrawerList }: any) => {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { user, sellers } = useAppSelector((store) => store);

  const isAdmin = user.user?.role === 'ROLE_ADMIN';
  const isSeller = !!sellers.profile?._id;

  const displayName = isAdmin
    ? user.user?.fullName || "Admin"
    : isSeller
      ? sellers.profile?.sellerName || "Seller"
      : "User";

  const accountRoute = isAdmin
    ? "/admin/account"
    : isSeller
      ? "/seller/account"
      : "/account";

  const toggleDrawer = (newOpen: any) => () => {
    setOpen(newOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    handleMenuClose();
  };

  return (
    <div className='h-[10vh] flex items-center justify-between px-5 border-b bg-white'>
      <div className='flex items-center gap-3 '>
        <IconButton onClick={toggleDrawer(true)} color='primary'>
          <MenuIcon color='primary' />
        </IconButton>

        <h1 onClick={() => navigate("/")} className='logo text-xl cursor-pointer font-bold text-primary'>Selfy Snap</h1>
      </div>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
            {displayName}
          </Typography>
          <IconButton onClick={handleMenuOpen} color="primary">
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => { navigate(accountRoute); handleMenuClose(); }}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>
    </div>
  )
}

export default Navbar