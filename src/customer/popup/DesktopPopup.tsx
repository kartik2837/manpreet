// import React, { useEffect, useState } from "react";

// interface DesktopPopupProps {
//   initialImageUrl: string;
//   allowedMobile: string; // Only this number can upload
//   delay?: number;
//   width?: string;
//   height?: string;
// }

// const DesktopPopup: React.FC<DesktopPopupProps> = ({
//   initialImageUrl,
//   allowedMobile,
//   delay = 10000,
//   width = "900px",
//   height = "500px",
// }) => {
//   const [visible, setVisible] = useState(false);
//   const [bannerUrl, setBannerUrl] = useState(initialImageUrl);
//   const [showMobileInput, setShowMobileInput] = useState(false);
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);

//   // Load last banner from localStorage
//   useEffect(() => {
//     const savedBanner = localStorage.getItem("bannerUrl");
//     if (savedBanner) setBannerUrl(savedBanner);
//   }, []);

//   // Show popup after delay
//   useEffect(() => {
//     const timer = setTimeout(() => setVisible(true), delay);
//     return () => clearTimeout(timer);
//   }, [delay]);

//   // Banner click
//   const handleBannerClick = () => {
//     setShowMobileInput(true); // Show input for all, validation happens silently on submit
//   };

//   // File select
//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) setUploadedFile(file);
//   };

//   // Submit mobile & file
//   const handleMobileSubmit = () => {
//     const sanitized = mobileNumber.replace(/\D/g, "");
//     if (sanitized === allowedMobile && uploadedFile) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           const newUrl = e.target.result as string;
//           setBannerUrl(newUrl);
//           localStorage.setItem("bannerUrl", newUrl);
//           setShowMobileInput(false);
//           setUploadedFile(null);
//           setMobileNumber("");
//         }
//       };
//       reader.readAsDataURL(uploadedFile);
//     } else {
//       // Do nothing if number is wrong or file not selected
//       setShowMobileInput(false);
//       setUploadedFile(null);
//       setMobileNumber("");
//     }
//   };

//   if (!visible) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         backgroundColor: "rgba(0,0,0,0.5)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 9999,
//       }}
//     >
//       <div
//         style={{
//           position: "relative",
//           width: width,
//           height: height,
//           borderRadius: "10px",
//           overflow: "hidden",
//           backgroundColor: "#fff",
//           boxShadow: "0 5px 30px rgba(0,0,0,0.5)",
//           animation: "fadeIn 0.5s",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//         }}
//       >
//         {/* Banner Image */}
//         <img
//           src={bannerUrl}
//           alt="Popup Banner"
//           style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
//           onClick={handleBannerClick}
//         />

//         {/* Mobile input & file select */}
//         {showMobileInput && (
//           <div
//             style={{
//               position: "absolute",
//               bottom: "15px",
//               left: "50%",
//               transform: "translateX(-50%)",
//               display: "flex",
//               gap: "5px",
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Enter mobile number"
//               value={mobileNumber}
//               onChange={(e) => setMobileNumber(e.target.value)}
//               style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
//             />
//             <label
//               style={{
//                 padding: "8px 15px",
//                 backgroundColor: "#000",
//                 color: "#fff",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//               }}
//             >
//               Choose File
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 style={{ display: "none" }}
//               />
//             </label>
//             <button
//               onClick={handleMobileSubmit}
//               style={{
//                 padding: "8px 15px",
//                 backgroundColor: "#000",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//               }}
//             >
//               Submit
//             </button>
//           </div>
//         )}

//         {/* Close Button */}
//         <button
//           onClick={() => setVisible(false)}
//           style={{
//             position: "absolute",
//             top: "5px",
//             right: "5px",
//             background: "#000",
//             color: "#fff",
//             border: "none",
//             borderRadius: "50%",
//             width: "30px",
//             height: "30px",
//             cursor: "pointer",
//             fontSize: "16px",
//           }}
//         >
//           ✕
//         </button>
//       </div>

//       <style>
//         {`
//           @keyframes fadeIn {
//             from { opacity: 0; transform: scale(0.85);}
//             to { opacity: 1; transform: scale(1);}
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default DesktopPopup;









<<<<<<< HEAD















=======
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
import React, { useEffect, useState } from "react";

interface DesktopPopupProps {
  initialImageUrl: string;
  allowedMobile: string;
  delay?: number;
}

const DesktopPopup: React.FC<DesktopPopupProps> = ({
  initialImageUrl,
  allowedMobile,
  delay = 8000,
}) => {
  const [visible, setVisible] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(initialImageUrl);
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dontShow, setDontShow] = useState(false);

<<<<<<< HEAD
  // Load saved banner + hide check
  useEffect(() => {
    const saved = localStorage.getItem("bannerUrl");
    const hide = localStorage.getItem("hidePopup");

    if (saved) setBannerUrl(saved);
    if (hide === "true") return;
=======
  // Load saved banner
  useEffect(() => {
    const saved = localStorage.getItem("bannerUrl");
    if (saved) setBannerUrl(saved);
  }, []);
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)

    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

<<<<<<< HEAD
  // Disable scroll
=======
  // Disable background scroll
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "auto";
  }, [visible]);

<<<<<<< HEAD
  // ESC close
=======
  // ESC key close
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleBannerClick = () => setShowMobileInput(true);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setUploadedFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    const num = mobileNumber.replace(/\D/g, "");

<<<<<<< HEAD
    if (num.length !== 10) {
      alert("Enter valid 10 digit mobile");
      return;
    }

=======
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
    if (num === allowedMobile && uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setBannerUrl(url);
        localStorage.setItem("bannerUrl", url);
        setShowMobileInput(false);
      };
      reader.readAsDataURL(uploadedFile);
<<<<<<< HEAD
    } else {
      alert("Not allowed");
=======
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
    }

    setMobileNumber("");
    setUploadedFile(null);
<<<<<<< HEAD
  };

  const handleClose = () => {
    if (dontShow) {
      localStorage.setItem("hidePopup", "true");
    }
    setVisible(false);
=======
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
  };

  if (!visible) return null;

  return (
<<<<<<< HEAD
    <div className="overlay" onClick={handleClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        
        {/* Banner */}
=======
    <div className="overlay" onClick={() => setVisible(false)}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        
        {/* Image */}
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
        <img
          src={bannerUrl}
          alt="banner"
          className="banner"
          onClick={handleBannerClick}
        />

        {/* Input */}
        {showMobileInput && (
          <div className="inputBox">
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />

            <label className="upload">
<<<<<<< HEAD
              Upload Banner
=======
              Upload
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
              <input type="file" hidden onChange={handleFileSelect} />
            </label>

            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}

<<<<<<< HEAD
        {/* Bottom options */}
        <div className="bottom">
          <label>
            <input
              type="checkbox"
              checked={dontShow}
              onChange={() => setDontShow(!dontShow)}
            />
            Do not show again
          </label>
        </div>

        {/* Close */}
        <button className="close" onClick={handleClose}>✕</button>
=======
        {/* Close */}
        <button className="close" onClick={() => setVisible(false)}>✕</button>
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
      </div>

      <style>{`
        .overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.7);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:9999;
<<<<<<< HEAD
          backdrop-filter:blur(5px);
=======
          padding:12px;
          backdrop-filter:blur(4px);
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
        }

        .popup{
          width:100%;
          max-width:420px;
          background:#fff;
          border-radius:14px;
          overflow:hidden;
          position:relative;
<<<<<<< HEAD
          animation:zoomIn .3s ease;
=======
          animation:zoomIn .35s ease;
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
        }

        .banner{
          width:100%;
          height:220px;
          object-fit:cover;
          cursor:pointer;
        }

        .inputBox{
          padding:12px;
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        .inputBox input{
          padding:12px;
          border-radius:8px;
          border:1px solid #ccc;
<<<<<<< HEAD
=======
          font-size:14px;
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
        }

        .upload{
          background:#111;
          color:#fff;
          padding:10px;
          border-radius:8px;
          text-align:center;
          cursor:pointer;
        }

        .inputBox button{
          background:#2563eb;
          color:#fff;
          padding:12px;
          border:none;
          border-radius:8px;
          cursor:pointer;
          font-weight:600;
        }

<<<<<<< HEAD
        .bottom{
          padding:10px;
          font-size:13px;
          text-align:center;
        }

=======
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
        .close{
          position:absolute;
          top:10px;
          right:10px;
          background:#000;
          color:#fff;
          border:none;
          width:32px;
          height:32px;
          border-radius:50%;
          cursor:pointer;
        }

        @keyframes zoomIn{
<<<<<<< HEAD
          from{opacity:0;transform:scale(.85)}
=======
          from{opacity:0;transform:scale(.8)}
>>>>>>> 9dae341 (fix: updated code and added react-icons fix)
          to{opacity:1;transform:scale(1)}
        }

        /* Tablet */
        @media(min-width:600px){
          .popup{ max-width:600px; }
          .banner{ height:300px; }
        }

        /* Desktop */
        @media(min-width:900px){
          .popup{ max-width:900px; }
          .banner{ height:450px; }
        }
      `}</style>
    </div>
  );
};

export default DesktopPopup;







