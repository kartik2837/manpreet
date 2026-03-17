import { useNavigate, useParams } from "react-router-dom";

interface SimilarProductCardProps {
  product: any; // agar type hai to Product use kar sakte ho
}

const SimilarProductCard: React.FC<SimilarProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const resolvedCategoryId = product?.category?.categoryId || categoryId;

  const handleNavigate = () => {
    if (!product?._id || !resolvedCategoryId) return;

    navigate(
      `/product-details/${resolvedCategoryId}/${product.title}/${product._id}`
    );
  };

  return (
    <div
      onClick={handleNavigate}
      className="group cursor-pointer border-2 border-orange-400 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-[250px] p-2 bg-gray-100">
        {product?.images?.length > 0 ? (
          <img
            className="h-full w-full object-cover rounded-md"
            src={product.images[0]}
            alt="product-similar"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 space-y-1 bg-white">
        {/* Product Title */}
        <p className="text-gray-800 font-semibold text-sm truncate" title={product?.title}>
          {product?.title}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-gray-800">₹{product?.sellingPrice}</span>
          {product?.mrpPrice && (
            <span className="line-through text-gray-400 text-sm">
              ₹{product.mrpPrice}
            </span>
          )}
          {product?.discountPercent && (
            <span className="text-[#ff9644] font-semibold text-sm">
              {product.discountPercent}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimilarProductCard;