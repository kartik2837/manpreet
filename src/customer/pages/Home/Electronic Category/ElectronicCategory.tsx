import { useRef } from "react";
import ElectronicCategoryCard from "./ElectronicCategoryCard";
import { useAppSelector } from "../../../../Redux Toolkit/Store";
import { IconButton } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const ElectronicCategory = () => {
  const { homePage } = useAppSelector((store) => store);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group border-b py-2 px-2 lg:px-20">
      {/* Scroll Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 lg:left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <IconButton
          onClick={() => handleScroll("left")}
          sx={{
            bgcolor: "white",
            boxShadow: 4,
            "&:hover": { bgcolor: "white", transform: "scale(1.2)" },
          }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <IconButton
          onClick={() => handleScroll("right")}
          sx={{
            bgcolor: "white",
            boxShadow: 4,
            "&:hover": { bgcolor: "white", transform: "scale(1.2)" },
          }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex flex-nowrap gap-2 md:gap-5 overflow-x-auto scrollbar-hide px-8 lg:px-0"
      >
        {homePage.homePageData?.electricCategories?.map((item: any) => (
          <ElectronicCategoryCard key={item.categoryId} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ElectronicCategory;
