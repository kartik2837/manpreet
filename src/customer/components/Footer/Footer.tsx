import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchFooters } from "../../../Redux Toolkit/Admin/FooterSlice";


/* ---------- Types ---------- */
interface FooterLink {
  label: string;
  url: string; // "/facebook-policy" for internal, "https://instagram.com" for external
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

/* ---------- Component ---------- */
const Footer = () => {
  const dispatch = useAppDispatch();

  const list = useAppSelector((state) => state.footer.list as FooterData[]);

  useEffect(() => {
    dispatch(fetchFooters());
  }, [dispatch]);

  if (!list.length) return null;

  const footer = list[0]; // latest footer

  // Helper to determine if a URL is external
  const isExternal = (url: string) => url.startsWith("http");

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {footer.sections.map((section, i) => (
          <div key={`${section.title}-${i}`}>
            <h4 className="text-white font-semibold mb-4">{section.title}</h4>
            <ul className="space-y-2 text-sm">
              {section.links.map((link, j) => (
                <li key={`${link.label}-${j}`}>
                  {isExternal(link.url) ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.url.startsWith("/") ? link.url : `/${link.url}`}
                      className="hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
         
          <h4 className="text-white font-semibold mb-4">Mail Us:</h4>
          <Link to="/contact">Contact</Link>
          <p className="text-sm leading-6">
            
            {footer.address.company}
            <br />
            {footer.address.line1}
            <br />
            {footer.address.line2}
            <br />
            {footer.address.country}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700" />

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
        <div className="flex gap-6 flex-wrap">
          {footer.bottomLinks.map((l, i) => {
            const absoluteUrl = isExternal(l.url) ? l.url : (l.url.startsWith("/") ? l.url : `/${l.url}`);
            return isExternal(l.url) ? (
              <a
                key={`${l.label}-${i}`}
                href={absoluteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {l.label}
              </a>
            ) : (
              <Link key={`${l.label}-${i}`} to={absoluteUrl} className="hover:text-white">
                {l.label}
              </Link>
            );
          })}
        </div>

        <p>© {new Date().getFullYear()} SelfySnap.com</p>
      </div>
    </footer>
  );
};

export default Footer;














