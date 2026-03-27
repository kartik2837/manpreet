// // src/customer/components/Reward.tsx
// import React, { useState, useEffect } from "react";
// import { Button, Typography, Snackbar, Alert, Box } from "@mui/material";

// interface SharedPlatforms {
//   whatsapp: number;
//   facebook: number;
//   instagram: number;
//   youtube: number;
// }

// const Reward: React.FC = () => {
//   const rewardCoins = 50;
//   const maxCoins = 1000;
//   const maxSharesPerPlatform = 10;

//   // Initialize wallet from localStorage
//   const [wallet, setWallet] = useState<number>(() => {
//     const saved = localStorage.getItem("wallet");
//     return saved ? parseInt(saved) : 0;
//   });

//   // Initialize shared count
//   const [shared, setShared] = useState<SharedPlatforms>(() => {
//     const saved = localStorage.getItem("sharedPlatforms");
//     return saved ? JSON.parse(saved) : { whatsapp:0, facebook:0, instagram:0, youtube:0 };
//   });

//   const [referralUrl, setReferralUrl] = useState<string>("");
//   const [message, setMessage] = useState<string>("");
//   const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

//   // Generate dynamic referral
//   useEffect(() => {
//     let user = localStorage.getItem("user");
//     if (!user) {
//       const newUser = {
//         id: Date.now(),
//         referralCode: `USER${Math.floor(Math.random() * 10000)}`
//       };
//       localStorage.setItem("user", JSON.stringify(newUser));
//       user = JSON.stringify(newUser);
//     }
//     const userObj = JSON.parse(user);
//     setReferralUrl(`https://selfysnap.com/?ref=${userObj.referralCode}`);
//   }, []);

//   // Save wallet & shared state
//   useEffect(() => {
//     localStorage.setItem("wallet", wallet.toString());
//     localStorage.setItem("sharedPlatforms", JSON.stringify(shared));
//   }, [wallet, shared]);

//   const handleShare = (platform: keyof SharedPlatforms) => {
//     if (shared[platform] >= maxSharesPerPlatform) {
//       setMessage(`Maximum ${maxSharesPerPlatform} shares allowed on ${platform}`);
//       setOpenSnackbar(true);
//       return;
//     }

//     switch (platform) {
//       case "whatsapp":
//         window.open(`https://api.whatsapp.com/send?text=Check%20this%20out%20${referralUrl}`, "_blank");
//         break;
//       case "facebook":
//         window.open(`https://www.facebook.com/sharer/sharer.php?u=${referralUrl}`, "_blank");
//         break;
//       case "instagram":
//       case "youtube":
//         navigator.clipboard.writeText(referralUrl);
//         setMessage(`Link copied to clipboard for ${platform}`);
//         setOpenSnackbar(true);
//         break;
//     }

//     // Add coins (limit maxCoins)
//     if (wallet < maxCoins) setWallet(prev => Math.min(prev + rewardCoins, maxCoins));

//     // Increment share count
//     setShared(prev => ({ ...prev, [platform]: prev[platform] + 1 }));

//     // Show coin earned message
//     setMessage(`You earned +${rewardCoins} coins!`);
//     setOpenSnackbar(true);
//   };

//   return (
//     <Box sx={{ textAlign: "center", padding: 4, maxWidth: 500, margin: "50px auto", border: "1px solid #ccc", borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
//       <Typography variant="h4" gutterBottom>Referral Rewards</Typography>
//       <Typography variant="h6" sx={{ margin: "20px 0" }}>
//         Wallet Balance: <span style={{ fontWeight: "bold", color: "#4caf50" }}>{wallet}</span> coins
//       </Typography>
//       <Typography variant="body1" sx={{ marginBottom: "20px" }}>
//         Share your referral link to earn coins! Max coins: {maxCoins}. <br/>
//         Max {maxSharesPerPlatform} shares per platform.
//       </Typography>

//       <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
//         <Button variant="contained" color="success" onClick={() => handleShare("whatsapp")}>
//           WhatsApp ({shared.whatsapp}/{maxSharesPerPlatform})
//         </Button>
//         <Button variant="contained" color="primary" onClick={() => handleShare("facebook")}>
//           Facebook ({shared.facebook}/{maxSharesPerPlatform})
//         </Button>
//         <Button variant="contained" color="secondary" onClick={() => handleShare("instagram")}>
//           Instagram ({shared.instagram}/{maxSharesPerPlatform})
//         </Button>
//         <Button variant="contained" color="error" onClick={() => handleShare("youtube")}>
//           YouTube ({shared.youtube}/{maxSharesPerPlatform})
//         </Button>
//       </Box>

//       {wallet >= maxCoins && (
//         <Button variant="contained" color="warning" sx={{ marginTop: 3 }} onClick={() => alert("Redirect to Shopping page")}>
//           Shop Now 🛒
//         </Button>
//       )}

//       <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
//         <Alert severity="success" sx={{ width: "100%" }}>{message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Reward;
















// src/customer/components/Reward.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  Paper,
  LinearProgress,
  Tooltip,
  Grid,
  Chip,
  Zoom,
} from "@mui/material";
import {
  WhatsApp,
  Facebook,
  Instagram,
  YouTube,
  EmojiEvents,
  ShoppingCart,
} from "@mui/icons-material";

interface SharedPlatforms {
  whatsapp: number;
  facebook: number;
  instagram: number;
  youtube: number;
}

const Reward: React.FC = () => {
  const rewardCoins = 50;
  const maxCoins = 1000;
  const maxSharesPerPlatform = 10;

  // Load initial state from localStorage
  const [wallet, setWallet] = useState<number>(() => {
    const saved = localStorage.getItem("wallet");
    return saved ? parseInt(saved) : 0;
  });

  const [shared, setShared] = useState<SharedPlatforms>(() => {
    const saved = localStorage.getItem("sharedPlatforms");
    return saved
      ? JSON.parse(saved)
      : { whatsapp: 0, facebook: 0, instagram: 0, youtube: 0 };
  });

  const [referralUrl, setReferralUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  // Generate referral URL once
  useEffect(() => {
    let user = localStorage.getItem("user");
    if (!user) {
      const newUser = {
        id: Date.now(),
        referralCode: `USER${Math.floor(Math.random() * 10000)}`,
      };
      localStorage.setItem("user", JSON.stringify(newUser));
      user = JSON.stringify(newUser);
    }
    const userObj = JSON.parse(user);
    setReferralUrl(`https://selfysnap.com/?ref=${userObj.referralCode}`);
  }, []);

  // Persist wallet and shared counts
  useEffect(() => {
    localStorage.setItem("wallet", wallet.toString());
    localStorage.setItem("sharedPlatforms", JSON.stringify(shared));
  }, [wallet, shared]);

  const handleShare = (platform: keyof SharedPlatforms) => {
    if (shared[platform] >= maxSharesPerPlatform) {
      setMessage(
        `Maximum ${maxSharesPerPlatform} shares allowed on ${platform}`
      );
      setOpenSnackbar(true);
      return;
    }

    // Perform share action
    switch (platform) {
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=Check%20this%20out%20${referralUrl}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${referralUrl}`,
          "_blank"
        );
        break;
      case "instagram":
      case "youtube":
        navigator.clipboard.writeText(referralUrl);
        setMessage(`Link copied to clipboard for ${platform}`);
        setOpenSnackbar(true);
        break;
    }

    // Add coins, respecting max limit
    if (wallet < maxCoins) {
      setWallet((prev) => Math.min(prev + rewardCoins, maxCoins));
    }

    // Increment share count
    setShared((prev) => ({
      ...prev,
      [platform]: prev[platform] + 1,
    }));

    // Show reward message
    setMessage(`✨ You earned +${rewardCoins} coins!`);
    setOpenSnackbar(true);
  };

  const walletProgress = (wallet / maxCoins) * 100;

  // Helper to get platform details
  const platformDetails = {
    whatsapp: {
      color: "#25D366",
      icon: <WhatsApp />,
      label: "WhatsApp",
    },
    facebook: {
      color: "#1877F2",
      icon: <Facebook />,
      label: "Facebook",
    },
    instagram: {
      color: "#E4405F",
      icon: <Instagram />,
      label: "Instagram",
    },
    youtube: {
      color: "#FF0000",
      icon: <YouTube />,
      label: "YouTube",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "linear-gradient(135deg, #f5f7fa 0%, #e9edf2 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          transition: "transform 0.2s",
          "&:hover": { transform: "scale(1.01)" },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 3,
            color: "white",
            textAlign: "center",
          }}
        >
          <EmojiEvents sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h4" fontWeight="bold">
            Referral Rewards
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Share your unique link and earn coins for every share!
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 3 }}>
          {/* Wallet Card */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              background: "#fafcff",
              border: "1px solid #e0e7ff",
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" fontWeight="medium">
                🪙 Your Wallet
              </Typography>
              <Chip
                label={`Max ${maxCoins} coins`}
                size="small"
                variant="outlined"
              />
            </Box>
            <Typography variant="h3" fontWeight="bold" sx={{ my: 1, color: "#4caf50" }}>
              {wallet}
              <Typography component="span" variant="body2" sx={{ ml: 0.5 }}>
                coins
              </Typography>
            </Typography>
            <LinearProgress
              variant="determinate"
              value={walletProgress}
              sx={{
                height: 10,
                borderRadius: 5,
                mt: 1,
                backgroundColor: "#e0e7ff",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #4caf50, #8bc34a)",
                  borderRadius: 5,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              {wallet} / {maxCoins} coins earned
            </Typography>
          </Paper>

          {/* Share Buttons Grid */}
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Share on social media
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {Object.keys(platformDetails).map((platform) => {
              const key = platform as keyof SharedPlatforms;
              const details = platformDetails[key];
              const sharesLeft = maxSharesPerPlatform - shared[key];
              const shareProgress = (shared[key] / maxSharesPerPlatform) * 100;

              return (
                <Grid item xs={12} sm={6} key={key}>
                  <Tooltip title={`${sharesLeft} shares remaining`}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={details.icon}
                      onClick={() => handleShare(key)}
                      sx={{
                        backgroundColor: details.color,
                        "&:hover": { backgroundColor: details.color, filter: "brightness(0.9)" },
                        justifyContent: "flex-start",
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ flexGrow: 1, textAlign: "left" }}>
                        {details.label}
                        <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                          {shared[key]} / {maxSharesPerPlatform} shares
                        </Typography>
                      </Box>
                    </Button>
                  </Tooltip>
                  <LinearProgress
                    variant="determinate"
                    value={shareProgress}
                    sx={{
                      mt: 0.5,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "#e0e7ff",
                      "& .MuiLinearProgress-bar": { backgroundColor: details.color },
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>

          {/* Shop Now Button (animated when max coins reached) */}
          {wallet >= maxCoins && (
            <Zoom in={wallet >= maxCoins}>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={() => alert("Redirect to Shopping page")}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: "bold",
                  animation: "bounce 1s infinite",
                  "@keyframes bounce": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                  },
                }}
              >
                Shop Now & Redeem Coins 🛒
              </Button>
            </Zoom>
          )}
        </Box>

        {/* Snackbar Notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{ width: "100%", borderRadius: 2 }}
            onClose={() => setOpenSnackbar(false)}
          >
            {message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Reward;