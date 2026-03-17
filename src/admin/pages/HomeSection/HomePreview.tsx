import { useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchHomeSections } from "../../../Redux Toolkit/Customer/HomeSectionSlice";

interface Product {
  _id: string;
  title: string;
  brand?: string;
  images?: string[];
  categoryId?: string;
  mrpPrice?: number;
  sellingPrice?: number;
  discountPercent?: number;
  unitValue?: number;
  unitType?: string;
  shippingCharges?: number;
}

interface Section {
  _id: string;
  title: string;
  layout: "slider" | "grid";
  products?: Product[];
}

export default function HomePreview() {
  const dispatch = useAppDispatch();
  const sections: Section[] = useAppSelector(
    (state) => state.homepreview.sections ?? []
  );

  const sliderRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchHomeSections());
  }, [dispatch]);

  const scroll = (id: string, dir: "left" | "right") => {
    const slider = sliderRefs.current[id];
    if (!slider) return;
    slider.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const sliderSections = sections.filter((s) => s.layout === "slider");
  const gridSections = sections.filter((s) => s.layout === "grid");

  // ✅ Added thin orange border
  const cardClasses =
    "flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] bg-white rounded-2xl border-2 border-orange-400 overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer";

  const ProductCard = ({ item }: { item: Product }) => (
    <div
      key={item._id}
      className={cardClasses}
      onClick={() =>
        navigate(
          `/product-details/${item.categoryId}/${item.title}/${item._id}`
        )
      }
    >
      {/* ✅ Image Section with Padding */}
      <div className="p-3">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={item.images?.[0] ?? "/placeholder.png"}
            alt={item.title}
            className="w-full h-[240px] object-cover rounded-xl"
          />

          {/* Discount Badge */}

        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 space-y-2">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
          {item.title}
        </h3>

        {/* Brand */}
        <p className="text-sm text-blue-600 font-medium">
          {item.brand}
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2 pt-2 flex-wrap">
          {/* MRP Price */}
          {item.mrpPrice && item.discountPercent && (
            <span className="text-gray-400 text-sm line-through">
              ₹{item.mrpPrice?.toFixed(0)}
            </span>
          )}

          {/* Selling Price */}
          <span className="text-lg font-bold text-gray-900">
            ₹{item.sellingPrice?.toFixed(0)}
          </span>

          {/* Discount */}
          {item.discountPercent && (
            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {item.discountPercent}% OFF
            </span>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm text-gray-600 ml-auto">
            ⭐ {4.5} {/* default 4.5 if rating missing */}
            <span className="text-gray-400 text-xs">({50})</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 space-y-12">
      {/* ===== SLIDER SECTIONS ===== */}
      {sliderSections.map((sec) => (
        <div key={sec._id}>
          <h2 className="text-2xl lg:text-3xl font-semibold mb-6">
            {sec.title ?? "Untitled"}
          </h2>

          <div className="relative">
            <IconButton
              onClick={() => scroll(sec._id, "left")}
              className="!absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <div
              ref={(el) => {
                sliderRefs.current[sec._id] = el;
              }}

              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            >
              {sec.products?.map((item) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>

            <IconButton
              onClick={() => scroll(sec._id, "right")}
              className="!absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      ))}

      {/* ===== GRID SECTIONS ===== */}
      {gridSections.map((sec) => (
        <div key={sec._id}>
          <h2 className="text-2xl lg:text-3xl font-semibold mb-6">
            {sec.title ?? "Untitled"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sec.products?.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
