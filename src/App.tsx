import './App.css';
import { ThemeProvider } from '@emotion/react';
import customeTheme from './Theme/customeTheme';

import { Route, Routes, useNavigate } from 'react-router-dom';

import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
import CustomerRoutes from './routes/CustomerRoutes';
import AdminDashboard from './admin/pages/Dashboard/Dashboard';
import SellerAccountVerification from './seller/pages/SellerAccountVerification';
import SellerAccountVerified from './seller/pages/SellerAccountVerified';
import { useAppDispatch, useAppSelector } from './Redux Toolkit/Store';
import { useEffect } from 'react';
import { fetchSellerProfile } from './Redux Toolkit/Seller/sellerSlice';
import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
import AdminAuth from './admin/pages/Auth/AdminAuth';
import { fetchUserProfile } from './Redux Toolkit/Customer/UserSlice';
import { fetchHomePageData } from './Redux Toolkit/Customer/Customer/AsyncThunk';
import ScrollToTop from './customer/components/TopScroll/ScrollToTop';
import { ToastContainer } from 'react-toastify';



function App() {
  const dispatch = useAppDispatch()
  const { auth, sellerAuth, sellers, user } = useAppSelector(store => store)
const navigate=useNavigate();

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(fetchUserProfile({jwt:localStorage.getItem("jwt") || auth.jwt || "",navigate}));
      dispatch(fetchSellerProfile(localStorage.getItem("jwt") || sellerAuth.jwt))
    }

  }, [auth.jwt, sellerAuth.jwt])

  useEffect(() => {
    // Fetch home page data from database instead of posting static data
    dispatch(fetchHomePageData() as any)
  }, [dispatch])

  return (
    
    
    <ThemeProvider theme={customeTheme}>
      
      <div className='App' >
     <ScrollToTop centerLogo="/logo34.png" brandLogo="/logo34.png" />


        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {sellers.profile && <Route path='/seller/*' element={<SellerDashboard />} />}
          {user.user?.role === "ROLE_ADMIN" && <Route path='/admin/*' element={<AdminDashboard />} />}
          <Route path='/verify-seller/:otp' element={<SellerAccountVerification />} />
          <Route path='/seller-account-verified' element={<SellerAccountVerified />} />
          <Route path='/become-seller' element={<BecomeSeller />} />
          <Route path='/admin-login' element={<AdminAuth />} />

          <Route path='*' element={<CustomerRoutes />} />

        </Routes>
        {/* <Footer/> */}
      </div>



    </ThemeProvider>
  );
}

export default App;





















// import './App.css';
// import { ThemeProvider } from '@emotion/react';
// import customeTheme from './Theme/customeTheme';

// import { Route, Routes, useNavigate } from 'react-router-dom';

// import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
// import CustomerRoutes from './routes/CustomerRoutes';
// import AdminDashboard from './admin/pages/Dashboard/Dashboard';
// import SellerAccountVerification from './seller/pages/SellerAccountVerification';
// import SellerAccountVerified from './seller/pages/SellerAccountVerified';
// import { useAppDispatch, useAppSelector } from './Redux Toolkit/Store';
// import { useEffect, useState } from 'react';
// import { fetchSellerProfile } from './Redux Toolkit/Seller/sellerSlice';
// import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
// import AdminAuth from './admin/pages/Auth/AdminAuth';
// import { fetchUserProfile } from './Redux Toolkit/Customer/UserSlice';
// import { fetchHomePageData } from './Redux Toolkit/Customer/Customer/AsyncThunk';
// import ScrollToTop from './customer/components/TopScroll/ScrollToTop';




// function App() {
//   const dispatch = useAppDispatch();
//   const { auth, sellerAuth, sellers, user } = useAppSelector(store => store);
//   const navigate = useNavigate();

//   // Right-click alert state
//   const [showAlert, setShowAlert] = useState(false);

//   // Fetch profiles
//   useEffect(() => {
//     const jwt = localStorage.getItem("jwt") || auth.jwt || sellerAuth.jwt || "";
//     if (jwt) {
//       dispatch(fetchUserProfile({ jwt, navigate }));
//       dispatch(fetchSellerProfile(jwt));
//     }
//   }, [auth.jwt, sellerAuth.jwt]);

//   // Fetch homepage data
//   useEffect(() => {
//     dispatch(fetchHomePageData() as any);
//   }, [dispatch]);

//   // Disable inspect / right-click / view-source / F12
//   useEffect(() => {
//     // Right-click alert
//     const handleContextMenu = (e: MouseEvent) => {
//       e.preventDefault();
//       setShowAlert(true);
//       setTimeout(() => setShowAlert(false), 2000); // auto-hide after 2 sec
//     };
//     document.addEventListener("contextmenu", handleContextMenu);

//     // Disable keyboard shortcuts
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "F12") e.preventDefault();
//       if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) e.preventDefault();
//       if (e.ctrlKey && e.key.toUpperCase() === "U") e.preventDefault();
//     };
//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("contextmenu", handleContextMenu);
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   return (
//     <ThemeProvider theme={customeTheme}>
//       <div className='App'>
     
//         {/* Loader / Scroll to top */}
//         <ScrollToTop centerLogo="/logos.png" brandLogo="/logo34.png" duration={4000} />

//         {/* Custom Right-click Alert */}
//         {showAlert && (
//           <div style={{
//             position: "fixed",
//             top: "20px",
//             right: "20px",
//             backgroundColor: "#f44336", // red
//             color: "white",
//             padding: "15px 20px",
//             borderRadius: "8px",
//             boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
//             zIndex: 99999,
//             fontWeight: "bold",
//             fontFamily: "sans-serif",
//             animation: "slideIn 0.3s ease-in-out"
//           }}>
//             ⚠ Website Security: Right-click is disabled!
//             <style>{`
//               @keyframes slideIn {
//                 0% { transform: translateX(100%); opacity: 0; }
//                 100% { transform: translateX(0); opacity: 1; }
//               }
//             `}</style>
//           </div>
//         )}

//         <Routes>
//           {sellers.profile && <Route path='/seller/*' element={<SellerDashboard />} />}
//           {user.user?.role === "ROLE_ADMIN" && <Route path='/admin/*' element={<AdminDashboard />} />}
//           <Route path='/verify-seller/:otp' element={<SellerAccountVerification />} />
//           <Route path='/seller-account-verified' element={<SellerAccountVerified />} />
//           <Route path='/become-seller' element={<BecomeSeller />} />
          
//           <Route path='/admin-login' element={<AdminAuth />} />
//           <Route path='*' element={<CustomerRoutes />} />
//         </Routes>
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App; 









// import './App.css';
// import { ThemeProvider } from '@emotion/react';
// import customeTheme from './Theme/customeTheme';
// import { Route, Routes, useNavigate } from 'react-router-dom';
// import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
// import CustomerRoutes from './routes/CustomerRoutes';
// import AdminDashboard from './admin/pages/Dashboard/Dashboard';
// import SellerAccountVerification from './seller/pages/SellerAccountVerification';
// import SellerAccountVerified from './seller/pages/SellerAccountVerified';
// import { useAppDispatch, useAppSelector } from './Redux Toolkit/Store';
// import { useEffect, useState } from 'react';
// import { fetchSellerProfile } from './Redux Toolkit/Seller/sellerSlice';
// import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
// import AdminAuth from './admin/pages/Auth/AdminAuth';
// import { fetchUserProfile } from './Redux Toolkit/Customer/UserSlice';
// import { fetchHomePageData } from './Redux Toolkit/Customer/Customer/AsyncThunk';
// import ScrollToTop from './customer/components/TopScroll/ScrollToTop';

// function App() {
//   const dispatch = useAppDispatch();
//   const { auth, sellerAuth, sellers, user } = useAppSelector(store => store);
//   const navigate = useNavigate();

//   const [showAlert, setShowAlert] = useState(false);

//   const triggerAlert = () => {
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 2000);
//   };

//   // Fetch profiles
//   useEffect(() => {
//     const jwt = localStorage.getItem("jwt") || auth.jwt || sellerAuth.jwt || "";
//     if (jwt) {
//       dispatch(fetchUserProfile({ jwt, navigate }));
//       dispatch(fetchSellerProfile(jwt));
//     }
//   }, [auth.jwt, sellerAuth.jwt]);

//   // Fetch homepage data
//   useEffect(() => {
//     dispatch(fetchHomePageData() as any);
//   }, [dispatch]);

//   // 🔒 Block COPY only (allow selection)
//   useEffect(() => {
//     // Block right-click (context menu)
//     const handleContextMenu = (e: MouseEvent) => {
//       e.preventDefault();
//       triggerAlert();
//     };

//     // Block copy
//     const handleCopy = (e: ClipboardEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//       try {
//         e.clipboardData?.setData("text/plain", "");
//       } catch {}
//       triggerAlert();
//       return false;
//     };

//     // Block cut
//     const handleCut = (e: ClipboardEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//       triggerAlert();
//       return false;
//     };

//     // Block keyboard shortcuts (Ctrl+C, Ctrl+U, F12, etc.)
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.ctrlKey && e.key.toLowerCase() === "c") {
//         e.preventDefault();
//         e.stopPropagation();
//         window.getSelection()?.removeAllRanges(); // clear any selection
//         triggerAlert();
//         return false;
//       }
//       if (e.key === "F12") {
//         e.preventDefault();
//         triggerAlert();
//       }
//       if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) {
//         e.preventDefault();
//         triggerAlert();
//       }
//       if (e.ctrlKey && e.key.toUpperCase() === "U") {
//         e.preventDefault();
//         triggerAlert();
//       }
//     };

//     // Block image dragging (prevents saving via drag)
//     const handleDragStart = (e: DragEvent) => {
//       const target = e.target as HTMLElement;
//       if (target.tagName === 'IMG') {
//         e.preventDefault();
//         triggerAlert();
//         return false;
//       }
//     };

//     // Add event listeners
//     document.addEventListener("contextmenu", handleContextMenu, true);
//     document.addEventListener("copy", handleCopy, true);
//     document.addEventListener("cut", handleCut, true);
//     document.addEventListener("keydown", handleKeyDown, true);
//     document.addEventListener("dragstart", handleDragStart, true);

//     // Cleanup
//     return () => {
//       document.removeEventListener("contextmenu", handleContextMenu, true);
//       document.removeEventListener("copy", handleCopy, true);
//       document.removeEventListener("cut", handleCut, true);
//       document.removeEventListener("keydown", handleKeyDown, true);
//       document.removeEventListener("dragstart", handleDragStart, true);
//     };
//   }, []);

//   return (
//     <ThemeProvider theme={customeTheme}>
//       <div className='App'>
//         <ScrollToTop centerLogo="/logos.png" brandLogo="/logo34.png" duration={4000} />

//         {showAlert && (
//           <div style={{
//             position: "fixed",
//             top: "20px",
//             right: "20px",
//             backgroundColor: "#f44336",
//             color: "white",
//             padding: "15px 20px",
//             borderRadius: "8px",
//             boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
//             zIndex: 99999,
//             fontWeight: "bold",
//             fontFamily: "sans-serif",
//             animation: "slideIn 0.3s ease-in-out"
//           }}>
//            Selfysnap copy not content is Warning
//             <style>{`
//               @keyframes slideIn {
//                 0% { transform: translateX(100%); opacity: 0; }
//                 100% { transform: translateX(0); opacity: 1; }
//               }
//             `}</style>
//           </div>
//         )}

//         <Routes>
//           {sellers.profile && <Route path='/seller/*' element={<SellerDashboard />} />}
//           {user.user?.role === "ROLE_ADMIN" && <Route path='/admin/*' element={<AdminDashboard />} />}
//           <Route path='/verify-seller/:otp' element={<SellerAccountVerification />} />
//           <Route path='/seller-account-verified' element={<SellerAccountVerified />} />
//           <Route path='/become-seller' element={<BecomeSeller />} />
//           <Route path='/admin-login' element={<AdminAuth />} />
//           <Route path='*' element={<CustomerRoutes />} />
//         </Routes>
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App;

