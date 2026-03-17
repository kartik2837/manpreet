import React, { useEffect, useState } from "react";

interface DesktopPopupProps {
  initialImageUrl: string;
  allowedMobile: string; // Only this number can upload
  delay?: number;
  width?: string;
  height?: string;
}

const DesktopPopup: React.FC<DesktopPopupProps> = ({
  initialImageUrl,
  allowedMobile,
  delay = 10000,
  width = "900px",
  height = "500px",
}) => {
  const [visible, setVisible] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(initialImageUrl);
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Load last banner from localStorage
  useEffect(() => {
    const savedBanner = localStorage.getItem("bannerUrl");
    if (savedBanner) setBannerUrl(savedBanner);
  }, []);

  // Show popup after delay
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Banner click
  const handleBannerClick = () => {
    setShowMobileInput(true); // Show input for all, validation happens silently on submit
  };

  // File select
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  // Submit mobile & file
  const handleMobileSubmit = () => {
    const sanitized = mobileNumber.replace(/\D/g, "");
    if (sanitized === allowedMobile && uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newUrl = e.target.result as string;
          setBannerUrl(newUrl);
          localStorage.setItem("bannerUrl", newUrl);
          setShowMobileInput(false);
          setUploadedFile(null);
          setMobileNumber("");
        }
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      // Do nothing if number is wrong or file not selected
      setShowMobileInput(false);
      setUploadedFile(null);
      setMobileNumber("");
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "relative",
          width: width,
          height: height,
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#fff",
          boxShadow: "0 5px 30px rgba(0,0,0,0.5)",
          animation: "fadeIn 0.5s",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Banner Image */}
        <img
          src={bannerUrl}
          alt="Popup Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
          onClick={handleBannerClick}
        />

        {/* Mobile input & file select */}
        {showMobileInput && (
          <div
            style={{
              position: "absolute",
              bottom: "15px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "5px",
            }}
          >
            <input
              type="text"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <label
              style={{
                padding: "8px 15px",
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </label>
            <button
              onClick={handleMobileSubmit}
              style={{
                padding: "8px 15px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ✕
        </button>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.85);}
            to { opacity: 1; transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
};

export default DesktopPopup;