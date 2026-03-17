import { useNavigate } from "react-router-dom";

const ElectronicCategoryCard = ({ item }: any) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${item.categoryId}`)}
      className="flex flex-col items-center cursor-pointer min-w-[80px] md:min-w-[100px] shrink-0 gap-1 hover:scale-110 transition-transform duration-300"
    >
      <img
        className="object-contain h-10 md:h-14"
        src={item.image}
        alt={item.name}
      />

      <h2 className="font-semibold text-center text-xs md:text-sm">
        {item.name}
      </h2>
    </div>
  );
};

export default ElectronicCategoryCard;
