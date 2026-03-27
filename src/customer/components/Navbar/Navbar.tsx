// import {
//   Avatar,
//   Badge,
//   Box,
//   Button,
//   Drawer,
//   IconButton,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import React, { useState, useEffect } from "react";
// import "./Navbar.css";
// import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import SearchIcon from "@mui/icons-material/Search";
// import MenuIcon from "@mui/icons-material/Menu";
// import CategorySheet from "./CategorySheet";
// import DrawerList from "./DrawerList";
// import { useNavigate } from "react-router-dom";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { FavoriteBorder } from "@mui/icons-material";
// import { fetchMainCategories } from "../../../Redux Toolkit/Admin/MainCategorySlice";

// const Navbar = () => {
//   const [showSheet, setShowSheet] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("men");
//   const [hideCategory, setHideCategory] = useState(false); // <- NEW

//   const theme = useTheme();
//   const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const dispatch = useAppDispatch();
//   const { user, auth, cart, sellers, mainCategory } = useAppSelector(
//     (store) => store
//   );
//   const navigate = useNavigate();
//   const [open, setOpen] = React.useState(false);

//   // Fetch categories
//   useEffect(() => {
//     dispatch(fetchMainCategories(auth.jwt || ""));
//   }, [auth.jwt, dispatch]);

//   // Scroll logic for hiding category bar
//   useEffect(() => {
//     const handleScroll = () => {
//       setHideCategory(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const levelOneCategories = mainCategory.categories?.filter(
//     (cat) => cat.level === 1
//   );

//   const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

//   const becomeSellerClick = () => {
//     if (sellers.profile?._id) navigate("/seller");
//     else navigate("/become-seller");
//   };

//   return (
//     <Box
//       sx={{ zIndex: 2 }}
//       className="sticky top-0 left-0 right-0 bg-white blur-bg bg-opacity-80"
//     >
//       {/* ================= NAVBAR TOP ================= */}
//       <div className="flex items-center justify-between px-3 lg:px-20 h-[65px] lg:h-[70px] border-b">
//         {/* LEFT SECTION */}
//         <div className="flex items-center gap-3 lg:gap-9">
//           <div className="flex items-center gap-2">
//             {!isLarge && (
//               <IconButton onClick={toggleDrawer(true)}>
//                 <MenuIcon
//                   className="text-gray-700"
//                   sx={{ fontSize: isMobile ? 24 : 29 }}
//                 />
//               </IconButton>
//             )}

//             <img
//               src="/logo.jpeg"
//               alt="Selfy Snap"
//               onClick={() => navigate("/")}
//               className="h-7 md:h-10 lg:h-14 cursor-pointer"
//             />
//           </div>
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="flex items-center gap-1 sm:gap-2 lg:gap-6">
//           {/* Desktop/Tablet Search Bar */}
//           <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full w-[300px] lg:w-[500px]">
//             <SearchIcon className="text-gray-500 mr-2" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="bg-transparent outline-none w-full text-sm"
//               onFocus={() => navigate("/search-products")}
//             />
//           </div>







          

//           {/* Mobile Search Icon */}
//           <div className="md:hidden">
//             <IconButton onClick={() => navigate("/search-products")}>
//               <SearchIcon
//                 className="text-gray-700"
//                 sx={{ fontSize: isMobile ? 22 : 26 }}
//               />
//             </IconButton>
//           </div>

//           {/* USER */}
//           {user.user ? (
//             <Button
//               onClick={() => navigate("/account/orders")}
//               className="flex items-center gap-2 min-w-0 px-1 sm:px-2"
//             >
//               <Avatar
//                 sx={{
//                   width: isMobile ? 24 : 29,
//                   height: isMobile ? 24 : 29,
//                 }}
//                 src="https://img.icons8.com/ios7/1200/user-male-circle--v2.jpg"
//               />
//               {!isMobile && (
//                 <h1 className="font-semibold hidden lg:block">
//                   {user.user?.fullName?.split(" ")[0]}
//                 </h1>
//               )}
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               size={isMobile ? "small" : "medium"}
//               sx={{
//                 minWidth: isMobile ? "auto" : "auto",
//                 px: isMobile ? 1 : 2,
//                 fontSize: isMobile ? "12px" : "14px",
//               }}
//               startIcon={
//                 !isMobile && <AccountCircleIcon sx={{ fontSize: "16px" }} />
//               }
//               onClick={() => navigate("/login")}
//             >
//               {isMobile ? "Login" : "Login"}
//             </Button>
//           )}

//           {/* WISHLIST */}
//           <IconButton
//             size={isMobile ? "small" : "medium"}
//             onClick={() => navigate("/wishlist")}
//           >
//             <FavoriteBorder
//               sx={{ fontSize: isMobile ? 22 : 29 }}
//               className="text-gray-700"
//             />
//           </IconButton>

//           {/* CART */}
//           <IconButton
//             size={isMobile ? "small" : "medium"}
//             onClick={() => navigate("/cart")}
//           >
//             <Badge
//               badgeContent={cart.cart?.cartItems.length}
//               color="primary"
//               sx={{
//                 "& .MuiBadge-badge": {
//                   fontSize: isMobile ? "10px" : "12px",
//                   minWidth: isMobile ? "16px" : "20px",
//                   height: isMobile ? "16px" : "20px",
//                 },
//               }}
//             >
              
//               <AddShoppingCartIcon
//                 sx={{ fontSize: isMobile ? 22 : 29 }}
//                 className="text-gray-700"
//               />
//             </Badge>
//           </IconButton>

//           {/* SELLER BUTTON DESKTOP ONLY */}
//           {isLarge && (
//             <Button
//               onClick={becomeSellerClick}
//               startIcon={<StorefrontIcon />}
//               variant="outlined"
//             >
//               Become Seller
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* ================= CATEGORY BAR ================= */}
//       {isLarge && (
//         <div className="border-b">
//           <ul
//             className="flex items-center gap-8 px-20 font-medium text-gray-800 overflow-x-auto scrollbar-hide transition-all duration-200 ease-in-out"
//             style={{
//               height: hideCategory ? 0 : 55,           // smooth shrink
//               opacity: hideCategory ? 0 : 1,           // fade effect
//               transform: hideCategory ? "translateY(-100%)" : "translateY(0%)", // slide
//             }}
//           >
//             {levelOneCategories?.map((item) => (
//               <li
//                 key={item.categoryId}
//                 onMouseLeave={() => setShowSheet(false)}
//                 onMouseEnter={() => {
//                   setSelectedCategory(item.categoryId);
//                   setShowSheet(true);
//                 }}
//                 className="whitespace-nowrap hover:text-[#df6b3c] cursor-pointer hover:border-b-2 border-[#df6b3c] flex items-center h-full"
//               >
//                 {item.name}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* DRAWER */}
//       <Drawer open={open} onClose={toggleDrawer(false)}>
//         <DrawerList toggleDrawer={toggleDrawer} />
//       </Drawer>

//       {/* CATEGORY SHEET */}
//       {showSheet && selectedCategory && (
//         <div
//           onMouseLeave={() => setShowSheet(false)}
//           onMouseEnter={() => setShowSheet(true)}
//           className="categorySheet absolute top-[125px] left-20 right-20"
//         >
//           <CategorySheet
//             setShowSheet={setShowSheet}
//             selectedCategory={selectedCategory}
//           />
//         </div>
//       )}
//     </Box>
//   );
// };

// export default Navbar;










import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CategorySheet from "./CategorySheet";
import DrawerList from "./DrawerList";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { FavoriteBorder, Share } from "@mui/icons-material";
import { fetchMainCategories } from "../../../Redux Toolkit/Admin/MainCategorySlice";
import Reward from "../../components/reward"; // Import the Reward component

const Navbar = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [hideCategory, setHideCategory] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false); // Drawer for reward

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useAppDispatch();
  const { user, auth, cart, sellers, mainCategory } = useAppSelector(
    (store) => store
  );
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    dispatch(fetchMainCategories(auth.jwt || ""));
  }, [auth.jwt, dispatch]);

  // Scroll logic for hiding category bar
  useEffect(() => {
    const handleScroll = () => {
      setHideCategory(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const levelOneCategories = mainCategory.categories?.filter(
    (cat) => cat.level === 1
  );

  const toggleDrawer = (newOpen: boolean) => () => setOpenDrawer(newOpen);

  const becomeSellerClick = () => {
    if (sellers.profile?._id) navigate("/seller");
    else navigate("/become-seller");
  };

  return (
    <Box
      sx={{ zIndex: 2 }}
      className="sticky top-0 left-0 right-0 bg-white blur-bg bg-opacity-80"
    >
      {/* ================= NAVBAR TOP ================= */}
      <div className="flex items-center justify-between px-3 lg:px-20 h-[65px] lg:h-[70px] border-b">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 lg:gap-9">
          <div className="flex items-center gap-2">
            {!isLarge && (
              <IconButton onClick={toggleDrawer(true)}>
                <MenuIcon
                  className="text-gray-700"
                  sx={{ fontSize: isMobile ? 24 : 29 }}
                />
              </IconButton>
            )}
            <img
              src="/logo.jpeg"
              alt="Selfy Snap"
              onClick={() => navigate("/")}
              className="h-7 md:h-10 lg:h-14 cursor-pointer"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-6">
          {/* Desktop/Tablet Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full w-[300px] lg:w-[500px]">
            <SearchIcon className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none w-full text-sm"
              onFocus={() => navigate("/search-products")}
            />
          </div>

          {/* Mobile Search Icon */}
          <div className="md:hidden">
            <IconButton onClick={() => navigate("/search-products")}>
              <SearchIcon
                className="text-gray-700"
                sx={{ fontSize: isMobile ? 22 : 26 }}
              />
            </IconButton>
          </div>

          {/* Reward / Referral Button */}
          <Tooltip title="Referral Rewards">
            <IconButton
              onClick={() => setRewardOpen(true)}
              color="primary"
              sx={{ fontSize: isMobile ? 20 : 26 }}
            >
              <Share sx={{ fontSize: isMobile ? 22 : 26 }} />
            </IconButton>
          </Tooltip>

          {/* USER */}
          {user.user ? (
            <Button
              onClick={() => navigate("/account/orders")}
              className="flex items-center gap-2 min-w-0 px-1 sm:px-2"
            >
              <Avatar
                sx={{
                  width: isMobile ? 24 : 29,
                  height: isMobile ? 24 : 29,
                }}
                src="https://img.icons8.com/ios7/1200/user-male-circle--v2.jpg"
              />
              {!isMobile && (
                <h1 className="font-semibold hidden lg:block">
                  {user.user?.fullName?.split(" ")[0]}
                </h1>
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              size={isMobile ? "small" : "medium"}
              sx={{
                minWidth: isMobile ? "auto" : "auto",
                px: isMobile ? 1 : 2,
                fontSize: isMobile ? "12px" : "14px",
              }}
              startIcon={
                !isMobile && <AccountCircleIcon sx={{ fontSize: "16px" }} />
              }
              onClick={() => navigate("/login")}
            >
              {isMobile ? "Login" : "Login"}
            </Button>
          )}

          {/* WISHLIST */}
          <IconButton
            size={isMobile ? "small" : "medium"}
            onClick={() => navigate("/wishlist")}
          >
            <FavoriteBorder
              sx={{ fontSize: isMobile ? 22 : 29 }}
              className="text-gray-700"
            />
          </IconButton>

          {/* CART */}
          <IconButton
            size={isMobile ? "small" : "medium"}
            onClick={() => navigate("/cart")}
          >
            <Badge
              badgeContent={cart.cart?.cartItems.length}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: isMobile ? "10px" : "12px",
                  minWidth: isMobile ? "16px" : "20px",
                  height: isMobile ? "16px" : "20px",
                },
              }}
            >
              <AddShoppingCartIcon
                sx={{ fontSize: isMobile ? 22 : 29 }}
                className="text-gray-700"
              />
            </Badge>
          </IconButton>

          {/* SELLER BUTTON DESKTOP ONLY */}
          {isLarge && (
            <Button
              onClick={becomeSellerClick}
              startIcon={<StorefrontIcon />}
              variant="outlined"
            >
              Become Seller
            </Button>
          )}
        </div>
      </div>

      {/* ================= CATEGORY BAR ================= */}
      {isLarge && (
        <div className="border-b">
          <ul
            className="flex items-center gap-8 px-20 font-medium text-gray-800 overflow-x-auto scrollbar-hide transition-all duration-200 ease-in-out"
            style={{
              height: hideCategory ? 0 : 55,
              opacity: hideCategory ? 0 : 1,
              transform: hideCategory ? "translateY(-100%)" : "translateY(0%)",
            }}
          >
            {levelOneCategories?.map((item) => (
              <li
                key={item.categoryId}
                onMouseLeave={() => setShowSheet(false)}
                onMouseEnter={() => {
                  setSelectedCategory(item.categoryId);
                  setShowSheet(true);
                }}
                className="whitespace-nowrap hover:text-[#df6b3c] cursor-pointer hover:border-b-2 border-[#df6b3c] flex items-center h-full"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* DRAWER */}
      <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>

      {/* CATEGORY SHEET */}
      {showSheet && selectedCategory && (
        <div
          onMouseLeave={() => setShowSheet(false)}
          onMouseEnter={() => setShowSheet(true)}
          className="categorySheet absolute top-[125px] left-20 right-20"
        >
          <CategorySheet
            setShowSheet={setShowSheet}
            selectedCategory={selectedCategory}
          />
        </div>
      )}

      {/* ================= REWARD DRAWER ================= */}
      <Drawer
        anchor="right"
        open={rewardOpen}
        onClose={() => setRewardOpen(false)}
      >
        <Box sx={{ width: { xs: 300, sm: 400 }, padding: 3 }}>
          <Reward />
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
















