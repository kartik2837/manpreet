// import { useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { fetchFooters } from "../../../Redux Toolkit/Admin/FooterSlice";


// /* ---------- Types ---------- */
// interface FooterLink {
//   label: string;
//   url: string; // "/facebook-policy" for internal, "https://instagram.com" for external
// }

// interface FooterSection {
//   title: string;
//   links: FooterLink[];
// }

// interface FooterAddress {
//   company: string;
//   line1: string;
//   line2: string;
//   country: string;
// }

// interface FooterData {
//   _id: string;
//   sections: FooterSection[];
//   address: FooterAddress;
//   bottomLinks: FooterLink[];
// }

// /* ---------- Component ---------- */
// const Footer = () => {
//   const dispatch = useAppDispatch();

//   const list = useAppSelector((state) => state.footer.list as FooterData[]);

//   useEffect(() => {
//     dispatch(fetchFooters());
//   }, [dispatch]);

//   if (!list.length) return null;

//   const footer = list[0]; // latest footer

//   // Helper to determine if a URL is external
//   const isExternal = (url: string) => url.startsWith("http");

//   return (
//     <footer className="bg-gray-900 text-gray-300 mt-20">
//       <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
//         {footer.sections.map((section, i) => (
//           <div key={`${section.title}-${i}`}>
//             <h4 className="text-white font-semibold mb-4">{section.title}</h4>
//             <ul className="space-y-2 text-sm">
//               {section.links.map((link, j) => (
//                 <li key={`${link.label}-${j}`}>
//                   {isExternal(link.url) ? (
//                     <a
//                       href={link.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="hover:text-white"
//                     >
//                       {link.label}
//                     </a>
//                   ) : (
//                     <Link
//                       to={link.url.startsWith("/") ? link.url : `/${link.url}`}
//                       className="hover:text-white"
//                     >
//                       {link.label}
//                     </Link>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         <div>
         
//           <h4 className="text-white font-semibold mb-4">Mail Us:</h4>
//           <Link to="/contact">Contact</Link>
//           <p className="text-sm leading-6">
            
//             {footer.address.company}
//             <br />
//             {footer.address.line1}
//             <br />
//             {footer.address.line2}
//             <br />
//             {footer.address.country}
//           </p>
//         </div>
//       </div>

//       <div className="border-t border-gray-700" />

//       <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
//         <div className="flex gap-6 flex-wrap">
//           {footer.bottomLinks.map((l, i) => {
//             const absoluteUrl = isExternal(l.url) ? l.url : (l.url.startsWith("/") ? l.url : `/${l.url}`);
//             return isExternal(l.url) ? (
//               <a
//                 key={`${l.label}-${i}`}
//                 href={absoluteUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="hover:text-white"
//               >
//                 {l.label}
//               </a>
//             ) : (
//               <Link key={`${l.label}-${i}`} to={absoluteUrl} className="hover:text-white">
//                 {l.label}
//               </Link>
//             );
//           })}
//         </div>

//         <p>© {new Date().getFullYear()} SelfySnap.com</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


















// import { useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
//   FaYoutube,
//   FaGooglePlay,
//   FaApple,
// } from "react-icons/fa";
// import { SiVisa, SiMastercard, SiPaypal } from "react-icons/si";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { fetchFooters } from "../../../Redux Toolkit/Admin/FooterSlice";

// /* ---------- Types ---------- */
// interface FooterLink {
//   label: string;
//   url: string;
// }

// interface FooterSection {
//   title: string;
//   links: FooterLink[];
// }

// interface FooterAddress {
//   company: string;
//   line1: string;
//   line2: string;
//   country: string;
// }

// interface FooterData {
//   _id: string;
//   sections: FooterSection[];
//   address: FooterAddress;
//   bottomLinks: FooterLink[];
// }

// /* ---------- Component ---------- */
// const Footer = () => {
//   const dispatch = useAppDispatch();
//   const list = useAppSelector((state) => state.footer.list as FooterData[]);

//   useEffect(() => {
//     dispatch(fetchFooters());
//   }, [dispatch]);

//   if (!list.length) return null;

//   const footer = list[0];
//   const isExternal = (url: string) => url.startsWith("http");

//   // Social media links – replace URLs with your actual ones
//   const socialLinks = [
//     { label: "Facebook", url: "https://facebook.com/selfysnap", icon: FaFacebook },
//     { label: "Instagram", url: "https://instagram.com/selfysnap", icon: FaInstagram },
//     { label: "Twitter", url: "https://twitter.com/selfysnap", icon: FaTwitter },
//     { label: "YouTube", url: "https://youtube.com/selfysnap", icon: FaYoutube },
//   ];

//   // Payment methods – using react-icons for Visa, Mastercard, PayPal
//   // For UPI, a custom SVG is provided (since no standard UPI icon exists in react-icons)
//   const paymentMethods = [
//     {
//       name: "UPI",
//       icon: () => (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="28"
//           height="28"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className="w-8 h-8"
//         >
//           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
//         </svg>
//       ),
//     },
//     { name: "Visa", icon: SiVisa },
//     { name: "Mastercard", icon: SiMastercard },
//     { name: "PayPal", icon: SiPaypal },
//   ];

//   // Helper to render payment icons
//   const renderPaymentIcon = (method: { name: string; icon: any }) => {
//     // If it's a React component (from react-icons)
//     if (typeof method.icon === "function" && method.icon.name) {
//       const IconComponent = method.icon;
//       return <IconComponent className="w-8 h-8" />;
//     }
//     // Otherwise, it's a function returning JSX (like UPI)
//     return method.icon();
//   };

//   return (
//     <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
//       <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
//         {/* Dynamic Sections */}
//         {footer.sections.map((section, i) => (
//           <div key={`${section.title}-${i}`} className="break-words">
//             <h4 className="text-white font-bold text-lg mb-4">{section.title}</h4>
//             <ul className="space-y-2 text-sm">
//               {section.links.map((link, j) => (
//                 <li key={`${link.label}-${j}`}>
//                   {isExternal(link.url) ? (
//                     <a
//                       href={link.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="hover:text-white transition-colors duration-200"
//                     >
//                       {link.label}
//                     </a>
//                   ) : (
//                     <Link
//                       to={link.url.startsWith("/") ? link.url : `/${link.url}`}
//                       className="hover:text-white transition-colors duration-200"
//                     >
//                       {link.label}
//                     </Link>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         {/* Logo & Social Media */}
//         <div className="flex flex-col space-y-6">
//           {/* Logo */}
//           <div>
//             <img
//               src="/path-to-your-logo.png" // Replace with your actual logo path
//               alt="SelfySnap Logo"
//               className="h-12 w-auto object-contain brightness-0 invert"
//             />
//           </div>

//           {/* Social Media */}
//           <div>
//             <h4 className="text-white font-bold text-lg mb-4">Follow Us</h4>
//             <div className="flex gap-5">
//               {socialLinks.map((social) => {
//                 const Icon = social.icon;
//                 return (
//                   <a
//                     key={social.label}
//                     href={social.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="hover:text-white transition-colors duration-200 text-gray-400"
//                     aria-label={social.label}
//                   >
//                     <Icon className="w-6 h-6" />
//                   </a>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Payment & App Stores */}
//         <div className="flex flex-col space-y-6">
//           {/* Payment Methods */}
//           <div>
//             <h4 className="text-white font-bold text-lg mb-4">We Accept</h4>
//             <div className="flex gap-5 items-center flex-wrap">
//               {paymentMethods.map((method) => (
//                 <span key={method.name} title={method.name} className="text-gray-300">
//                   {renderPaymentIcon(method)}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* App Stores */}
//           <div>
//             <h4 className="text-white font-bold text-lg mb-4">Download App</h4>
//             <div className="flex flex-col sm:flex-row gap-3">
//               <a
//                 href="https://play.google.com/store/apps/details?id=your.app.id"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
//               >
//                 <FaGooglePlay className="w-5 h-5" />
//                 Google Play
//               </a>
//               <a
//                 href="https://apps.apple.com/app/your-app-id"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
//               >
//                 <FaApple className="w-5 h-5" />
//                 App Store
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Mail Us / Address */}
//         <div className="break-words">
//           <h4 className="text-white font-bold text-lg mb-4">Mail Us:</h4>
//           <Link to="/contact" className="hover:text-white block mb-3 transition-colors">
//             Contact
//           </Link>
//           <p className="text-sm leading-relaxed">
//             {footer.address.company}
//             <br />
//             {footer.address.line1}
//             <br />
//             {footer.address.line2}
//             <br />
//             {footer.address.country}
//           </p>
//         </div>
//       </div>

//       <div className="border-t border-gray-800" />

//       <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
//         <div className="flex gap-6 flex-wrap justify-center">
//           {footer.bottomLinks.map((l, i) => {
//             const absoluteUrl = isExternal(l.url)
//               ? l.url
//               : l.url.startsWith("/")
//               ? l.url
//               : `/${l.url}`;
//             return isExternal(l.url) ? (
//               <a
//                 key={`${l.label}-${i}`}
//                 href={absoluteUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="hover:text-white transition-colors duration-200"
//               >
//                 {l.label}
//               </a>
//             ) : (
//               <Link
//                 key={`${l.label}-${i}`}
//                 to={absoluteUrl}
//                 className="hover:text-white transition-colors duration-200"
//               >
//                 {l.label}
//               </Link>
//             );
//           })}
//         </div>
//         <p>© {new Date().getFullYear()} SelfySnap.com</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;





import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaGooglePlay,
  FaApple,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMobileAlt,
  FaStore,
  FaShoppingBag,
  FaHeadset,
  FaInfoCircle,
  FaCog,
  FaBoxOpen,
  FaTag,
} from "react-icons/fa";
import { SiVisa, SiMastercard, SiPaypal } from "react-icons/si";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchFooters } from "../../../Redux Toolkit/Admin/FooterSlice";

/* ---------- Types ---------- */
interface FooterLink {
  label: string;
  url: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterAddress {
  company: string;
  line1: string;
  line2: string;
  country: string;
}

interface FooterData {
  _id: string;
  sections: FooterSection[];
  address: FooterAddress;
  bottomLinks: FooterLink[];
}

// Section icons
const sectionIcons: Record<string, React.ReactNode> = {
  Shop: <FaShoppingBag className="inline mr-2" />,
  Help: <FaHeadset className="inline mr-2" />,
  About: <FaInfoCircle className="inline mr-2" />,
  Policy: <FaCog className="inline mr-2" />,
  Categories: <FaBoxOpen className="inline mr-2" />,
  Deals: <FaTag className="inline mr-2" />,
};

const defaultSectionIcon = <FaStore className="inline mr-2" />;

/* ---------- Component ---------- */
const Footer = () => {
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.footer.list as FooterData[]);

  useEffect(() => {
    dispatch(fetchFooters());
  }, [dispatch]);

  if (!list.length) return null;

  const footer = list[0];
  const isExternal = (url: string) => url.startsWith("http");

  // Social links
  const socialLinks = [
    { label: "Facebook", url: "https://www.facebook.com/share/1CynTqYXxd/?mibextid=wwXIfr", icon: FaFacebook },
    { label: "Instagram", url: "https://www.instagram.com/selfysnapcom?igsh=MWFnaXBseGh5a2FleA%3D%3D&utm_source=qr", icon: FaInstagram },
    { label: "Twitter", url: "#", icon: FaTwitter },
    { label: "YouTube", url: "https://youtube.com/@selfysnap?si=QMoHmaQaIDiiI2XO", icon: FaYoutube },
  ];

  // Payment methods
  const paymentMethods = [
    {
      name: "UPI",
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
        </svg>
      ),
    },
    { name: "Visa", icon: SiVisa },
    { name: "Mastercard", icon: SiMastercard },
    { name: "PayPal", icon: SiPaypal },
  ];

  const renderPaymentIcon = (method: { name: string; icon: any }) => {
    if (typeof method.icon === "function" && method.icon.name) {
      const IconComponent = method.icon;
      return <IconComponent className="w-8 h-8 transition-all duration-200 hover:scale-110 hover:text-blue-400" />;
    }
    return method.icon();
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {/* Dynamic Sections */}
        {footer.sections.map((section, i) => {
          const icon = sectionIcons[section.title] || defaultSectionIcon;
          return (
            <div key={`${section.title}-${i}`} className="break-words">
              <h4 className="text-white font-bold text-lg mb-4 flex items-center border-l-4 border-blue-500 pl-2 transition-all duration-200 hover:tracking-wide">
                {icon}
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, j) => (
                  <li key={`${link.label}-${j}`}>
                    {isExternal(link.url) ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block transition-all duration-200 hover:text-blue-400 hover:font-bold hover:translate-x-1 hover:drop-shadow-[0_2px_2px_rgba(59,130,246,0.3)]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.url.startsWith("/") ? link.url : `/${link.url}`}
                        className="inline-block transition-all duration-200 hover:text-blue-400 hover:font-bold hover:translate-x-1 hover:drop-shadow-[0_2px_2px_rgba(59,130,246,0.3)]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}



         <div className="break-words">
          <h4 className="text-white font-bold text-lg mb-4 flex items-center border-l-4 border-blue-500 pl-2 transition-all duration-200 hover:tracking-wide">
            <FaEnvelope className="inline mr-2 text-blue-400" /> Mail Us:
          </h4>
          <Link
            to="/contact"
            className="inline-block transition-all duration-200 hover:text-blue-400 hover:font-bold hover:translate-x-1 hover:drop-shadow-[0_2px_2px_rgba(59,130,246,0.3)] mb-3"
          >
            Contact
          </Link>
          <div className="text-sm leading-relaxed">
            <p className="flex items-start gap-2 transition-all duration-200 hover:text-blue-300 hover:translate-x-1">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-blue-400" />
              <span>
                {footer.address.company}
                <br />
                {footer.address.line1}
                <br />
                {footer.address.line2}
                <br />
                {footer.address.country}
              </span>
            </p>
          </div>
        </div>

        {/* Logo & Social Media */}
        <div className="flex flex-col space-y-6">
          <div>
            <img
              src="/logo.jpeg" // Replace with your actual logo path
              alt="SelfySnap Logo"
              className="h-12 w-auto object-contain brightness-0 invert transition-all duration-200 hover:scale-105 hover:drop-shadow-lg"
            />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center border-l-4 border-blue-500 pl-2 transition-all duration-200 hover:tracking-wide">
              <FaEnvelope className="inline mr-2 text-blue-400" /> Follow Us
            </h4>
            <div className="flex gap-5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-all duration-200 hover:scale-110 text-gray-400"
                    aria-label={social.label}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment & App Stores */}
        <div className="flex flex-col space-y-6">
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center border-l-4 border-blue-500 pl-2 transition-all duration-200 hover:tracking-wide">
              <FaCreditCard className="inline mr-2 text-blue-400" /> We Accept
            </h4>
            <div className="flex gap-5 items-center flex-wrap">
              {paymentMethods.map((method) => (
                <span key={method.name} title={method.name} className="text-gray-300 transition-all duration-200 hover:scale-110">
                  {renderPaymentIcon(method)}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center border-l-4 border-blue-500 pl-2 transition-all duration-200 hover:tracking-wide">
              <FaMobileAlt className="inline mr-2 text-blue-400" /> Download App
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=your.app.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-blue-600 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <FaGooglePlay className="w-5 h-5" />
                Google Play
              </a>
              <a
                href="https://apps.apple.com/app/your-app-id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-blue-600 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <FaApple className="w-5 h-5" />
                App Store
              </a>
            </div>
          </div>
        </div>

        {/* Mail Us / Address */}
       
      </div>

      <div className="border-t border-gray-800" />

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
        <div className="flex gap-6 flex-wrap justify-center">
          {footer.bottomLinks.map((l, i) => {
            const absoluteUrl = isExternal(l.url)
              ? l.url
              : l.url.startsWith("/")
              ? l.url
              : `/${l.url}`;
            return isExternal(l.url) ? (
              <a
                key={`${l.label}-${i}`}
                href={absoluteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-200 hover:text-blue-400 hover:font-bold hover:translate-x-1 hover:drop-shadow-[0_2px_2px_rgba(59,130,246,0.3)]"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={`${l.label}-${i}`}
                to={absoluteUrl}
                className="transition-all duration-200 hover:text-blue-400 hover:font-bold hover:translate-x-1 hover:drop-shadow-[0_2px_2px_rgba(59,130,246,0.3)]"
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <p className="transition-all duration-200 hover:text-blue-400 hover:font-bold hover:drop-shadow-[0_2px_2px_rgba(59,130,246,0.3)]">
          © {new Date().getFullYear()} SelfySnap.com
        </p>
      </div>
    </footer>
  );
};

export default Footer;













