// import { Button, Card, Divider, CircularProgress, Snackbar, Alert } from '@mui/material';
// import { useState } from 'react';
// import TransactionTable from './TransactionTable';
// import Payouts from './PayoutsTable';
// import { useAppSelector, useAppDispatch } from '../../../Redux Toolkit/Store';
// import { requestPayout } from '../../../Redux Toolkit/Seller/payoutRequestSlice';

// // Type for tabs
// interface TabType {
//     name: string;
// }

// const tabs: TabType[] = [
//     { name: "Transaction" },
//     // { name: "Payouts" } // you can enable if needed
// ];

// const Payment = () => {
//     const [activeTab, setActiveTab] = useState<TabType["name"]>(tabs[0].name);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);

//     const dispatch = useAppDispatch();
//     const { sellers, payoutRequest } = useAppSelector((store) => store);

//     const handleActiveTab = (item: TabType) => {
//         setActiveTab(item.name);
//     };

//     const handleRequestPayout = () => {
//         const jwt = localStorage.getItem("jwt") || "";
//         dispatch(requestPayout(jwt));
//         setSnackbarOpen(true);
//     };

//     // Safely access pendingPayout and totalEarnings
//     const pendingPayout: number = sellers.report?.pendingPayout ?? 0;
//     const totalEarnings: number = sellers.report?.totalEarnings ?? 0;

//     return (
//         <div>
//             {/* Earnings Card */}
//             <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
//                 <Card className='col-span-1 p-5 rounded-md space-y-4'>
//                     <h1 className='text-gray-600 font-medium'>Total Earning</h1>
//                     <h1 className='font-bold text-xl pb-1'>₹{totalEarnings}</h1>
//                     <Divider />
//                     <p className='text-gray-600 font-medium pt-1'>
//                         Last Payment: <strong>₹0</strong>
//                     </p>

//                     {pendingPayout > 0 && (
//                         <div className='pt-4'>
//                             <Button
//                                 variant='contained'
//                                 color='primary'
//                                 onClick={handleRequestPayout}
//                                 disabled={payoutRequest.loading}
//                             >
//                                 {payoutRequest.loading ? <CircularProgress size={20} color="inherit" /> : "Request Payout"}
//                             </Button>
//                         </div>
//                     )}
//                 </Card>
//             </div>

//             {/* Snackbar for request feedback */}
//             <Snackbar
//                 open={snackbarOpen && (payoutRequest.success || !!payoutRequest.error)}
//                 autoHideDuration={4000}
//                 onClose={() => setSnackbarOpen(false)}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <>
//                     {payoutRequest.success && (
//                         <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
//                             Payout request submitted successfully!
//                         </Alert>
//                     )}
//                     {payoutRequest.error && (
//                         <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
//                             {payoutRequest.error}
//                         </Alert>
//                     )}
//                 </>
//             </Snackbar>


//             {/* Tabs Section */}
//             <div className='mt-10'>
//                 <div className='flex gap-4'>
//                     {tabs.map((item) => (
//                         <Button
//                             key={item.name} // key is mandatory
//                             onClick={() => handleActiveTab(item)}
//                             variant={activeTab === item.name ? "contained" : "outlined"}
//                         >
//                             {item.name}
//                         </Button>
//                     ))}
//                 </div>

//                 <div className='mt-5'>
//                     {activeTab === "Transaction" ? <TransactionTable /> : <Payouts />}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Payment;





import { Button, Card, Divider, CircularProgress, Snackbar, Alert, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import TransactionTable from './TransactionTable';
import PayoutsTable from './PayoutsTable';
import { useAppSelector, useAppDispatch } from '../../../Redux Toolkit/Store';
import { requestPayout, clearRequestState } from '../../../Redux Toolkit/Seller/payoutRequestSlice';
import { fetchSellerPayouts } from '../../../Redux Toolkit/Seller/payoutSlice';

interface TabType {
  name: string;
}

const tabs: TabType[] = [{ name: "Transaction" }, { name: "Payouts" }];

// ✅ localStorage key
const STORAGE_KEY = "seller_available_balance";

const Payment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType["name"]>(tabs[0].name);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [amount, setAmount] = useState<number | ''>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // ✅ local earnings (persistent)
  const [localEarnings, setLocalEarnings] = useState<number>(0);

  const dispatch = useAppDispatch();
  const { sellers, payoutRequest } = useAppSelector((store) => store);

  const totalEarnings = sellers.report?.totalEarnings ?? 0;

  // ✅ Load from localStorage first
  useEffect(() => {
    const savedBalance = localStorage.getItem(STORAGE_KEY);

    if (savedBalance !== null) {
      setLocalEarnings(Number(savedBalance));
    } else {
      setLocalEarnings(totalEarnings);
    }
  }, [totalEarnings]);

  const handleActiveTab = (item: TabType) => {
    setActiveTab(item.name);
  };

  const handleRequestPayout = async () => {
    setValidationError(null);

    if (!amount || amount <= 0) {
      setValidationError("Please enter a valid amount.");
      return;
    }

    if (amount > localEarnings) {
      setValidationError(`Requested amount exceeds total earnings (₹${localEarnings}).`);
      return;
    }

    const jwt = localStorage.getItem("jwt") || "";

    // ✅ optimistic update
    const updatedBalance = localEarnings - Number(amount);
    setLocalEarnings(updatedBalance);
    localStorage.setItem(STORAGE_KEY, String(updatedBalance));

    const result = await dispatch(requestPayout({ jwt, amount: Number(amount) }));

    setSnackbarOpen(true);
    setAmount('');

    if (requestPayout.fulfilled.match(result)) {
      if (activeTab === "Payouts") {
        dispatch(fetchSellerPayouts(jwt));
      }
    } else {
      // ❌ rollback
      const rollbackBalance = updatedBalance + Number(amount);
      setLocalEarnings(rollbackBalance);
      localStorage.setItem(STORAGE_KEY, String(rollbackBalance));
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setValidationError(null);
    dispatch(clearRequestState());
  };

  useEffect(() => {
    if (activeTab === "Payouts") {
      const jwt = localStorage.getItem("jwt");
      if (jwt) dispatch(fetchSellerPayouts(jwt));
    }
  }, [activeTab, dispatch]);

  const isRequestDisabled = () => {
    if (payoutRequest.loading) return true;
    if (localEarnings <= 0) return true;
    if (!amount || amount <= 0) return true;
    if (Number(amount) > localEarnings) return true;
    return false;
  };

  return (
    <div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
        <Card className='col-span-1 p-5 rounded-md space-y-4'>
          <h1 className='text-gray-600 font-medium'>Total Earnings</h1>

          {/* ✅ UPDATED */}
          <h1 className='font-bold text-xl pb-1'>₹{localEarnings}</h1>

          <Divider />

          <p className='text-gray-600 font-medium pt-1'>
            Last Payment: <strong>₹0</strong>
          </p>

          <div className='pt-4 space-y-3'>
            <TextField
              label="Amount to withdraw (₹)"
              type="number"
              fullWidth
              size="small"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value === '' ? '' : Number(e.target.value));
                setValidationError(null);
              }}
              disabled={payoutRequest.loading}
              inputProps={{ min: 1 }}
              error={!!validationError}
              helperText={validationError}
            />

            <Button
              variant='contained'
              color='primary'
              onClick={handleRequestPayout}
              disabled={isRequestDisabled()}
              fullWidth
            >
              {payoutRequest.loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Request Payout"
              )}
            </Button>

            {localEarnings <= 0 && (
              <Alert severity="info" sx={{ mt: 1 }}>
                You have no earnings available.
              </Alert>
            )}
          </div>
        </Card>
      </div>

      <Snackbar
        open={snackbarOpen && (payoutRequest.success || !!payoutRequest.error)}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <div>
          {payoutRequest.success && (
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
              Thank you! Your request has been received. Our team is reviewing it and will process it within 3-5 business days. 
            </Alert>
          )}
          {payoutRequest.error && (
            <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
              {payoutRequest.error}
            </Alert>
          )}
        </div>
      </Snackbar>

      <div className='mt-10'>
        <div className='flex gap-4'>
          {tabs.map((item) => (
            <Button
              key={item.name}
              onClick={() => handleActiveTab(item)}
              variant={activeTab === item.name ? "contained" : "outlined"}
            >
              {item.name}
            </Button>
          ))}
        </div>

        <div className='mt-5'>
          {activeTab === "Transaction" ? <TransactionTable /> : <PayoutsTable />}
        </div>
      </div>
    </div>
  );
};

export default Payment;



