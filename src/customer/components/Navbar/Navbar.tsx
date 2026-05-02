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
  CircularProgress,
  Fade,
  Paper,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import "./Navbar.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import CategorySheet from "./CategorySheet";
import DrawerList from "./DrawerList";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { FavoriteBorder, Share } from "@mui/icons-material";
import { fetchMainCategories } from "../../../Redux Toolkit/Admin/MainCategorySlice";
import Reward from "../../components/reward";
import { searchProduct } from "../../../Redux Toolkit/Customer/ProductSlice";
import ProductCard from "../../pages/Products/ProductCard/ProductCard";
import type { Product } from "../../../types/productTypes";

const Navbar = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [hideCategory, setHideCategory] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  // Fixed: use ReturnType<typeof setTimeout> for browser compatibility
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useAppDispatch();
  const { user, auth, cart, sellers, mainCategory } = useAppSelector((store) => store);
  const navigate = useNavigate();

  // Fetch categories only if JWT exists
  useEffect(() => {
    if (auth.jwt) {
      dispatch(fetchMainCategories(auth.jwt));
    }
  }, [auth.jwt, dispatch]);

  // Scroll logic for hiding category bar
  useEffect(() => {
    const handleScroll = () => setHideCategory(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Safe category list
  const levelOneCategories = mainCategory?.categories?.filter((cat) => cat.level === 1) || [];

  const toggleDrawer = (newOpen: boolean) => () => setOpenDrawer(newOpen);

  const becomeSellerClick = () => {
    if (sellers?.profile?._id) navigate("/seller");
    else navigate("/become-seller");
  };

  // Search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchedProducts([]);
      setShowResults(false);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    try {
      const data = await dispatch(searchProduct(query)).unwrap();
      setSearchedProducts(Array.isArray(data) ? data : []);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchedProducts([]);
      setShowResults(true);
    } finally {
      setSearchLoading(false);
    }
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (!searchQuery.trim()) {
      setShowResults(false);
      setSearchedProducts([]);
      setSearchLoading(false);
      return;
    }
    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery, performSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      performSearch(searchQuery);
    }
  };

  const handleClearResults = () => {
    setShowResults(false);
    setSearchQuery("");
    setSearchedProducts([]);
  };

  const handleClearInput = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const handleProductClick = (productId: string) => {
    setShowResults(false);
    setShowMobileSearch(false);
    navigate(`/product/${productId}`);
  };

  // Safe cart items count
  const cartItemsCount = cart?.cart?.cartItems?.length ?? 0;

  return (
    <Box sx={{ zIndex: 2 }} className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm">
      {/* ================= NAVBAR TOP ================= */}
      <div className="flex items-center justify-between px-3 lg:px-20 h-[65px] lg:h-[70px] border-b border-gray-100">
        <div className="flex items-center gap-3 lg:gap-9">
          <div className="flex items-center gap-2">
            {!isLarge && (
              <IconButton onClick={toggleDrawer(true)}>
                <MenuIcon className="text-gray-700" sx={{ fontSize: isMobile ? 24 : 29 }} />
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

        <div className="flex items-center gap-1 sm:gap-2 lg:gap-6">
          {/* Desktop search */}
          <div className="hidden md:block relative">
            <TextField
              inputRef={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products..."
              variant="outlined"
              size="small"
              sx={{
                width: { md: "280px", lg: "450px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "40px",
                  backgroundColor: "#f8fafc",
                  "&:hover": { backgroundColor: "#f1f5f9" },
                  "&.Mui-focused": { backgroundColor: "#ffffff", boxShadow: "0 0 0 2px #3b82f6" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearInput} edge="end">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </div>

          <div className="md:hidden">
            <IconButton onClick={() => setShowMobileSearch(true)}>
              <SearchIcon className="text-gray-700" sx={{ fontSize: isMobile ? 22 : 26 }} />
            </IconButton>
          </div>

          <Tooltip title="Referral Rewards">
            <IconButton onClick={() => setRewardOpen(true)} color="primary">
              <Share sx={{ fontSize: isMobile ? 22 : 26 }} />
            </IconButton>
          </Tooltip>

          {user?.user ? (
            <Button onClick={() => navigate("/account/orders")} className="flex items-center gap-2 min-w-0 px-1 sm:px-2">
              <Avatar
                sx={{ width: isMobile ? 24 : 29, height: isMobile ? 24 : 29 }}
                src="https://img.icons8.com/ios7/1200/user-male-circle--v2.jpg"
              />
              {!isMobile && <h1 className="font-semibold hidden lg:block">{user.user?.fullName?.split(" ")[0]}</h1>}
            </Button>
          ) : (
            <Button
              variant="contained"
              size={isMobile ? "small" : "medium"}
              sx={{
                minWidth: "auto",
                px: isMobile ? 1 : 2,
                fontSize: isMobile ? "12px" : "14px",
                borderRadius: "40px",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
              startIcon={!isMobile && <AccountCircleIcon sx={{ fontSize: "16px" }} />}
              onClick={() => navigate("/login")}
            >
              {isMobile ? "Login" : "Login"}
            </Button>
          )}

          <IconButton size={isMobile ? "small" : "medium"} onClick={() => navigate("/wishlist")}>
            <FavoriteBorder sx={{ fontSize: isMobile ? 22 : 29 }} className="text-gray-700" />
          </IconButton>

          <IconButton size={isMobile ? "small" : "medium"} onClick={() => navigate("/cart")}>
            <Badge
              badgeContent={cartItemsCount}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: isMobile ? "10px" : "12px",
                  minWidth: isMobile ? "16px" : "20px",
                  height: isMobile ? "16px" : "20px",
                  borderRadius: "50%",
                },
              }}
            >
              <AddShoppingCartIcon sx={{ fontSize: isMobile ? 22 : 29 }} className="text-gray-700" />
            </Badge>
          </IconButton>

          {isLarge && (
            <Button
              onClick={becomeSellerClick}
              startIcon={<StorefrontIcon />}
              variant="outlined"
              sx={{
                borderRadius: "40px",
                textTransform: "none",
                borderColor: "#e2e8f0",
                "&:hover": { borderColor: "#3b82f6", backgroundColor: "#eff6ff" },
              }}
            >
              Become Seller
            </Button>
          )}
        </div>
      </div>

      {/* Category Bar - only render if categories exist */}
      {isLarge && levelOneCategories.length > 0 && (
        <div className="border-b border-gray-100">
          <ul
            className="flex items-center gap-8 px-20 font-medium text-gray-700 overflow-x-auto scrollbar-hide transition-all duration-300 ease-in-out"
            style={{
              height: hideCategory ? 0 : 55,
              opacity: hideCategory ? 0 : 1,
              transform: hideCategory ? "translateY(-100%)" : "translateY(0%)",
              visibility: hideCategory ? "hidden" : "visible",
            }}
          >
            {levelOneCategories.map((item) => (
              <li
                key={item.categoryId}
                onMouseLeave={() => setShowSheet(false)}
                onMouseEnter={() => {
                  setSelectedCategory(item.categoryId);
                  setShowSheet(true);
                }}
                className="whitespace-nowrap hover:text-blue-600 cursor-pointer hover:border-b-2 border-blue-600 flex items-center h-full transition-all duration-200"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search Results Panel */}
      <Fade in={showResults} timeout={200}>
        <div
          ref={resultsRef}
          className="absolute left-0 right-0 bg-white shadow-2xl z-50 border-t border-gray-100"
          style={{ top: isLarge ? (hideCategory ? 70 : 125) : 65 }}
        >
          <Paper elevation={0} className="rounded-none max-h-[70vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {searchLoading ? (
                  <span className="flex items-center gap-2">
                    <CircularProgress size={20} /> Searching...
                  </span>
                ) : (
                  `Results for "${searchQuery}" (${searchedProducts.length})`
                )}
              </h2>
              <IconButton onClick={handleClearResults} size="small">
                <CloseIcon />
              </IconButton>
            </div>
            <div className="p-6">
              {!searchLoading && (
                <>
                  {searchedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {searchedProducts.map((product) => (
                        <div
  key={product._id}
  className="transform transition-all duration-200 hover:scale-105 cursor-pointer"
  onClick={() => product._id && handleProductClick(product._id)}
>
  <ProductCard item={product} />
</div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <SearchIcon sx={{ fontSize: 60, color: "#cbd5e1" }} />
                      <p className="text-gray-500 mt-4">No products found for "{searchQuery}"</p>
                      <p className="text-sm text-gray-400 mt-2">Try different keywords or check spelling</p>
                    </div>
                  )}
                </>
              )}
              {searchLoading && (
                <div className="flex justify-center py-16">
                  <CircularProgress />
                </div>
              )}
            </div>
          </Paper>
        </div>
      </Fade>

      <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>

      {showSheet && selectedCategory && (
        <div
          onMouseLeave={() => setShowSheet(false)}
          onMouseEnter={() => setShowSheet(true)}
          className="categorySheet absolute top-[125px] left-20 right-20"
        >
          <CategorySheet setShowSheet={setShowSheet} selectedCategory={selectedCategory} />
        </div>
      )}

      <Drawer anchor="right" open={rewardOpen} onClose={() => setRewardOpen(false)}>
        <Box sx={{ width: { xs: 300, sm: 400 }, padding: 3 }}>
          <Reward />
        </Box>
      </Drawer>

      {showMobileSearch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4">
          <Paper elevation={6} className="w-full max-w-md p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <TextField
                autoFocus
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                variant="outlined"
                size="small"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "40px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearInput}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
              <IconButton onClick={() => setShowMobileSearch(false)}>
                <CloseIcon />
              </IconButton>
            </div>
            {searchLoading && (
              <div className="flex justify-center mt-4">
                <CircularProgress size={28} />
              </div>
            )}
          </Paper>
        </div>
      )}
    </Box>
  );
};

export default Navbar;









