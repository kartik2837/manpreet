// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0); // instant scroll
//   }, [pathname]);

//   return null;
// };

// export default ScrollToTop;






// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// const ScrollToTop = () => {
//   const { pathname } = useLocation();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });

//     const timer = setTimeout(() => setLoading(false), 800); // loader duration
//     return () => clearTimeout(timer);
//   }, [pathname]);

//   if (!loading) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         background: "linear-gradient(135deg, #fff5e6, #ffe6cc, #e0f7ff)", // white → soft orange → light blue
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 9999,
//         gap: "25px",
//       }}
//     >
//       {/* Spinner */}
//       <div className="loader-circle"></div>

//       {/* Glowing Text */}
//       <div className="loader-text">SelfySnap</div>

//       <style>{`
//         .loader-circle {
//           width: 60px;
//           height: 60px;
//           border: 6px solid rgba(0,0,0,0.1);
//           border-top-color: #ff8c42; /* orange */
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         .loader-text {
//           font-size: 36px;
//           font-weight: 900;
//           color: #333;
//           text-shadow:
//             0 0 8px rgba(255,140,66,0.6),
//             0 0 12px rgba(66,165,255,0.5),
//             0 0 20px rgba(255,140,66,0.4);
//           animation: glow 1.5s ease-in-out infinite alternate;
//         }

//         @keyframes glow {
//           from { text-shadow: 0 0 8px rgba(255,140,66,0.6), 0 0 12px rgba(66,165,255,0.5); }
//           to { text-shadow: 0 0 12px rgba(255,140,66,0.8), 0 0 16px rgba(66,165,255,0.7); }
//         }

//         @media (max-width: 480px) {
//           .loader-text { font-size: 28px; }
//           .loader-circle { width: 45px; height: 45px; border-width: 5px; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ScrollToTop;










// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// interface Props {
//   logo?: string;
//   brand?: string;
// }

// const ScrollToTop = ({ logo = "/logo.png", brand = "SelfySnap" }: Props) => {
//   const { pathname } = useLocation();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });

//     const timer = setTimeout(() => setLoading(false), 800);
//     return () => clearTimeout(timer);
//   }, [pathname]);

//   if (!loading) return null;

//   return (
//     <div className="loader-wrapper">
      
//       {/* Logo */}
//       <img src={logo} alt="logo" className="loader-logo" />

//       {/* Spinner */}
//       <div className="loader-circle"></div>

//       {/* Brand Text */}
//       <div className="loader-text">{brand}</div>

//       <style>{`
//         .loader-wrapper {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100vw;
//           height: 100vh;
//           background: linear-gradient(135deg,#fff5e6,#ffe6cc,#e0f7ff);
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//           gap: 20px;
//           z-index: 9999;
//         }

//         .loader-logo {
//           width: 80px;
//           height: 80px;
//           object-fit: contain;
//           animation: float 2s ease-in-out infinite;
//         }

//         .loader-circle {
//           width: 60px;
//           height: 60px;
//           border: 6px solid rgba(0,0,0,0.1);
//           border-top-color: #ff8c42;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         .loader-text {
//           font-size: 34px;
//           font-weight: 900;
//           color: #333;
//           text-shadow:
//             0 0 8px rgba(255,140,66,0.6),
//             0 0 12px rgba(66,165,255,0.5),
//             0 0 20px rgba(255,140,66,0.4);
//           animation: glow 1.5s ease-in-out infinite alternate;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         @keyframes glow {
//           from {
//             text-shadow: 0 0 8px rgba(255,140,66,0.6),
//                          0 0 12px rgba(66,165,255,0.5);
//           }
//           to {
//             text-shadow: 0 0 12px rgba(255,140,66,0.8),
//                          0 0 16px rgba(66,165,255,0.7);
//           }
//         }

//         @keyframes float {
//           0% { transform: translateY(0px); }
//           50% { transform: translateY(-8px); }
//           100% { transform: translateY(0px); }
//         }

//         @media (max-width: 480px) {
//           .loader-logo { width: 60px; height: 60px; }
//           .loader-text { font-size: 26px; }
//           .loader-circle { width: 45px; height: 45px; border-width: 5px; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ScrollToTop;

















<<<<<<< HEAD
=======
// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// /** Loader Component */
// interface SelfysnapLoaderProps {
//   duration?: number;
//   onComplete?: () => void;
//   centerLogo?: string; // Logo inside camera shutter
//   brandLogo?: string;  // Brand logo below
// }

// const SelfysnapLoader: React.FC<SelfysnapLoaderProps> = ({
//   duration = 2000,
//   onComplete,
//   centerLogo,
//   brandLogo,
// }) => {
//   const [progress, setProgress] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (progress >= 100) {
//       setIsLoading(false);
//       onComplete?.();
//       return;
//     }

//     const stepTime = 30;
//     const totalSteps = duration / stepTime;
//     const increment = 100 / totalSteps;

//     const interval = setInterval(() => {
//       setProgress((prev) => (prev + increment >= 100 ? 100 : prev + increment));
//     }, stepTime);

//     return () => clearInterval(interval);
//   }, [progress, duration, onComplete]);

//   if (!isLoading) return null;

//   return (
//     <div className="selfysnap-loader">
//       <div className="camera">
//         <div className="shutter">
//           <div className="aperture">
//             {centerLogo ? (
//               <img src={centerLogo} alt="logo" />
//             ) : (
//               <span style={{ fontSize: "36px" }}>📸</span>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="brand">
//         {brandLogo ? (
//           <img src={brandLogo} alt="Brand" style={{ height: "80px", objectFit: "contain" }} />
//         ) : (
//           "SELFYSNAP"
//         )}
//       </div>

//       <div className="progress-bar">
//         <div className="progress-fill" style={{ width: `${progress}%` }} />
//       </div>

//       <p className="loading-text">Loading marketplace... {Math.round(progress)}%</p>

//       <style>{`
//         :root {
//           /* Change these colors to match your logo */
//           --bg-color: #0f172a;              /* dark background */
//           --shutter-gradient: conic-gradient(#3b82f6, #06b6d4, #3b82f6);  /* blue‑cyan */
//           --progress-gradient: linear-gradient(90deg, #3b82f6, #06b6d4);
//           --text-color: white;
//         }

//         .selfysnap-loader{
//           position:fixed;
//           top:0;
//           left:0;
//           width:100%;
//           height:100%;
//           background:var(--bg-color);
//           display:flex;
//           flex-direction:column;
//           justify-content:center;
//           align-items:center;
//           z-index:9999;
//           color:var(--text-color);
//         }

//         .camera{
//           width:150px;
//           height:150px;
//           border-radius:50%;
//           background:rgba(255,255,255,0.05);
//           display:flex;
//           align-items:center;
//           justify-content:center;
//           margin-bottom:20px;
//         }

//         .shutter{
//           width:100px;
//           height:100px;
//           border-radius:50%;
//           background:var(--shutter-gradient);
//           display:flex;
//           align-items:center;
//           justify-content:center;
//           animation:spin 2s linear infinite;
//         }

//         .aperture{
//           width:70px;
//           height:70px;
//           border-radius:50%;
//           background:#000;
//           display:flex;
//           align-items:center;
//           justify-content:center;
//         }

//         .aperture img{
//           width:60px;
//           height:60px;
//           border-radius:50%;
//         }

//         .brand{
//           font-size:28px;
//           font-weight:700;
//           margin-bottom:20px;
//         }

//         .progress-bar{
//           width:250px;
//           height:6px;
//           background:rgba(255,255,255,0.2);
//           border-radius:10px;
//           overflow:hidden;
//         }

//         .progress-fill{
//           height:100%;
//           background:var(--progress-gradient);
//           transition:width 0.2s;
//         }

//         .loading-text{
//           margin-top:15px;
//           font-size:14px;
//           opacity:0.8;
//         }

//         @keyframes spin{
//           to{transform:rotate(360deg)}
//         }
//       `}</style>
//     </div>
//   );
// };

// /** ScrollToTop Component */
// const ScrollToTop: React.FC<{ duration?: number }> = ({ duration = 2000 }) => {
//   const { pathname } = useLocation();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });

//     const timer = setTimeout(() => setLoading(false), duration);
//     return () => clearTimeout(timer);
//   }, [pathname, duration]);

//   if (loading) {
//     return (
//       <SelfysnapLoader
//         duration={duration}
//         centerLogo="/logo34.png"
//         brandLogo="/logo34.png"
//         onComplete={() => setLoading(false)}
//       />
//     );
//   }

//   return null;
// };

// export default ScrollToTop;







>>>>>>> 9dae341 (fix: updated code and added react-icons fix)


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/** Loader */
interface Props {
  duration?: number;
  onComplete?: () => void;
  centerLogo?: string;
  brandLogo?: string;
}

const SelfysnapLoader: React.FC<Props> = ({
  duration = 2000,
  onComplete,
  centerLogo,
  brandLogo,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const step = 20;
    const total = duration / step;
    const inc = 100 / total;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onComplete?.();
          return 100;
        }
        return prev + inc;
      });
    }, step);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div className="loader">
      <div className="bg-glow"></div>

      {/* CAMERA */}
      <div className="camera">
        <div className="shutter">
          <div className="aperture">
            {centerLogo ? (
              <img src={centerLogo} alt="logo" />
            ) : (
              <span>📸</span>
            )}
          </div>
        </div>
      </div>

      {/* BRAND */}
      <div className="brand">
        {brandLogo ? <img src={brandLogo} alt="brand" /> : "SELFYSNAP"}
      </div>

      {/* SLOGAN */}
      <div className="slogan">
        <span>SNAP IT</span>
        <span>SHOP IT</span>
        <span>SMILE</span>
      </div>

      {/* PROGRESS */}
      <div className="progress">
        <div className="fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="text">Loading... {Math.round(progress)}%</p>

      <style>{`
        .loader{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          background:linear-gradient(135deg,#f8fafc,#e2e8f0);
          z-index:9999;
        }

        .bg-glow{
          position:absolute;
          width:400px;
          height:400px;
          background:radial-gradient(circle, rgba(99,102,241,0.2), transparent);
          filter:blur(120px);
          animation:pulse 4s infinite;
        }

        @keyframes pulse{
          0%{transform:scale(1);opacity:.5}
          50%{transform:scale(1.3);opacity:1}
          100%{transform:scale(1);opacity:.5}
        }

        /* CAMERA SMALL */
        .camera{
          width:220px;
          height:220px;
          border-radius:50%;
          background:rgba(255,255,255,0.6);
          backdrop-filter:blur(20px);
          display:flex;
          justify-content:center;
          align-items:center;
          box-shadow:0 10px 40px rgba(0,0,0,0.15);
          margin-bottom:20px;
        }

        .shutter{
          width:160px;
          height:160px;
          border-radius:50%;
          background:conic-gradient(#6366f1,#06b6d4,#6366f1);
          display:flex;
          justify-content:center;
          align-items:center;
          animation:spin 2s linear infinite;
        }

        .aperture{
          width:110px;
          height:110px;
          border-radius:50%;
          background:#fff;
          display:flex;
          justify-content:center;
          align-items:center;
        }

        .aperture img{
          width:90px;
          height:90px;
          border-radius:50%;
        }

        @keyframes spin{
          to{transform:rotate(360deg)}
        }

        /* BRAND */
        .brand img{
          height:90px;
          margin-bottom:10px;
        }

        /* SLOGAN ANIMATION */
        .slogan{
          display:flex;
          gap:12px;
          font-weight:700;
          color:#334155;
          margin-bottom:15px;
        }

        .slogan span{
          opacity:0;
          transform:translateY(10px);
          animation:fadeUp 1s forwards;
        }

        .slogan span:nth-child(1){animation-delay:0.2s;}
        .slogan span:nth-child(2){animation-delay:0.5s;}
        .slogan span:nth-child(3){animation-delay:0.8s;}

        @keyframes fadeUp{
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        /* PROGRESS */
        .progress{
          width:320px;
          height:8px;
          background:#e2e8f0;
          border-radius:50px;
          overflow:hidden;
        }

        .fill{
          height:100%;
          background:linear-gradient(90deg,#6366f1,#06b6d4);
          transition:0.2s;
        }

        .text{
          margin-top:10px;
          font-size:14px;
          color:#475569;
        }
      `}</style>
    </div>
  );
};

/** ScrollToTop */
const ScrollToTop: React.FC<Props> = ({
  duration = 2000,
  centerLogo,
  brandLogo,
}) => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, [pathname, duration]);

  if (!loading) return null;

  return (
    <SelfysnapLoader
      duration={duration}
      centerLogo={centerLogo}
      brandLogo={brandLogo}
      onComplete={() => setLoading(false)}
    />
  );
};

export default ScrollToTop;
