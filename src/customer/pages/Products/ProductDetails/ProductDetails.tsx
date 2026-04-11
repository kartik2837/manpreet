import StarIcon from '@mui/icons-material/Star';
import { Box, Button, Divider, IconButton, Modal } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Wallet } from '@mui/icons-material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SmilarProduct from '../SimilarProduct/SmilarProduct';
import ZoomableImage from './ZoomableImage';
import { useAppDispatch, useAppSelector } from '../../../../Redux Toolkit/Store';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, getAllProducts } from '../../../../Redux Toolkit/Customer/ProductSlice';
import { addItemToCart } from '../../../../Redux Toolkit/Customer/CartSlice';
import { addProductToWishlist } from '../../../../Redux Toolkit/Customer/WishlistSlice';
import { setBuyNowProduct } from '../../../../Redux Toolkit/Customer/BuyNowSlice';
import { isWishlisted } from '../../../../util/isWishlisted';
import ProductReviewCard from '../../Review/ProductReviewCard';
import RatingCard from '../../Review/RatingCard';
import { fetchReviewsByProductId } from '../../../../Redux Toolkit/Customer/ReviewSlice';
import { useState, useEffect } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    height: "100%",
    // bgcolor: 'background.paper',
    boxShadow: 24,
    outline: "none",
};


const ProductDetails = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useAppDispatch();
    const { products, review, wishlist } = useAppSelector(store => store)
    const navigate = useNavigate()
    const { productId, categoryId } = useParams()
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string>("");

    useEffect(() => {
        if (products.product?.sizes) {
            const sizes = products.product.sizes;
            const sizeArray = Array.isArray(sizes)
                ? sizes
                : (typeof sizes === 'string' ? (sizes as string).split(',').map((s: string) => s.trim()) : []);

            if (sizeArray.length > 0) {
                setSelectedSize(sizeArray[0]);
            } else {
                setSelectedSize("FREE");
            }
        } else {
            setSelectedSize("FREE");
        }
    }, [products.product]);


    useEffect(() => {

        if (productId) {
            dispatch(fetchProductById(productId))
            dispatch(fetchReviewsByProductId({ productId }))
        }
        dispatch(getAllProducts({ category: categoryId }));

    }, [productId])

    const handleAddCart = () => {
        dispatch(addItemToCart({
            jwt: localStorage.getItem('jwt'),
            request: { productId, size: selectedSize || "FREE", quantity }

        }))
    }

    return (
        <div className='px-5 lg:px-20 pt-10 '>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

                <section className='flex flex-col lg:flex-row gap-5'>
                    {/* Image Thumbnails - Scrollable */}
                    <div className='w-full lg:w-[15%] flex gap-3 overflow-x-auto lg:overflow-x-visible lg:flex-col py-2'>
                        {products.product?.images?.map((item, index) => (
                            <img
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className='w-[60px] lg:w-full cursor-pointer rounded-md border-2 border-transparent hover:border-orange-500'
                                src={item}
                                alt=""
                            />
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className='w-full lg:w-[85%] relative'>
                        <img
                            onClick={handleOpen}
                            className='w-full rounded-md cursor-zoom-in'
                            src={products.product?.images?.[selectedImage]}
                            alt=""
                        />

                        {/* Wishlist Heart Icon - Top Right of Image */}
                        <IconButton
                            onClick={() => {
                                if (!localStorage.getItem('jwt')) {
                                    navigate('/login');
                                    return;
                                }
                                if (products.product?._id) {
                                    dispatch(addProductToWishlist({ productId: products.product._id }));
                                }
                            }}
                            sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                bgcolor: 'rgba(255,255,255,0.85)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                                boxShadow: 2,
                            }}
                        >
                            {products.product && wishlist.wishlist && isWishlisted(wishlist.wishlist, products.product) ? (
                                <FavoriteIcon sx={{ color: '#ff4081' }} />
                            ) : (
                                <FavoriteBorderIcon sx={{ color: '#ff4081' }} />
                            )}
                        </IconButton>

                        {/* Description below main image */}
                        <div className='mt-20 p-4'>
                            <h2 className='text-lg font-semibold mb-2'>Product Description</h2>
                            <p className='text-gray-700 border-2 border-gray-50 whitespace-pre-line leading-relaxed rounded p-4'>
                                {products.product?.description}
                            </p>
                        </div>

                        {/* Modal for Zoomable Image */}
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={{ ...style, maxWidth: "90%", maxHeight: "90%" }}>
                                <ZoomableImage src={products.product?.images?.[selectedImage]|| ""} alt="" />
                            </Box>
                        </Modal>
                    </div>
                </section>

                <section>
                    <h1 className='font-bold text-lg text-orange-600'>{products.product?.seller?.businessDetails?.businessName}</h1>
                    <p className='text-gray-500 font-semibold'>{products.product?.title}</p>

                    <div className='flex justify-between items-center py-2 border w-[180px] px-3 mt-5'>
                        <div className='flex gap-1 items-center'>
                            <span>4</span>
                            <StarIcon sx={{ color: "#ff9644", fontSize: "17px" }} />
                        </div>
                        <Divider orientation="vertical" flexItem />
                        <span>
                            358 Ratings
                        </span>
                    </div>

                    <div className='space-y-2'>
                        <div className='price flex items-center gap-3 mt-5 text-lg'>
                            <span className='font-semibold text-gray-800' > ₹{products.product?.sellingPrice}</span>
                            <span className='text thin-line-through text-gray-400 '>₹{products.product?.mrpPrice}</span>
                            <span className='text-[#ff9644] font-semibold'>{products.product?.discountPercent}% off</span>
                        </div>
                        <p className='text-sm'>Inclusive of all taxes. Free Shipping above ₹799.</p>
                    </div>

                    <div className='mt-7 space-y-3'>

                        <div className='flex items-center gap-4'>
                            <ShieldIcon sx={{ color: "#ff9644" }} />
                            <p>Authentic & Quality Assured</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            <WorkspacePremiumIcon sx={{ color: "#ff9644" }} />
                            <p>100% money back guarantee</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            <LocalShippingIcon sx={{ color: "#ff9644" }} />
                            <p>Free Shipping & Returns</p>
                        </div>



                        <div className='flex items-center gap-4'>
                            <Wallet sx={{ color: "#ff9644" }} />
                            <p>Pay on delivery might be available</p>
                        </div>



                    </div>

                    <div className='mt-7 space-y-3'>
                        <h1 className='font-semibold'>SELECT SIZE:</h1>
                        <Box className='flex flex-wrap gap-3'>
                            {(() => {
                                const sizes = products.product?.sizes;
                                const sizeArray = Array.isArray(sizes)
                                    ? sizes
                                    : (typeof sizes === 'string' && sizes ? (sizes as string).split(',').map((s: string) => s.trim()) : []);

                                if (sizeArray.length > 0) {
                                    return sizeArray.map((size: string) => (
                                        <Button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            variant={selectedSize === size ? 'contained' : 'outlined'}
                                            sx={{ minWidth: "60px", borderRadius: "20px" }}
                                        >
                                            {size}
                                        </Button>
                                    ));
                                } else {
                                    return (
                                        <Button
                                            onClick={() => setSelectedSize("FREE")}
                                            variant={selectedSize === "FREE" ? 'contained' : 'outlined'}
                                            sx={{ minWidth: "60px", borderRadius: "20px" }}
                                        >
                                            FREE
                                        </Button>
                                    );
                                }
                            })()}
                        </Box>
                    </div>

                    <div className='mt-7 space-y-2'>
                        <h1 className='font-semibold'>QUANTITY:</h1>
                        <div className=' flex items-center gap-2  w-[140px] justify-between'>

                            <Button disabled={quantity == 1} onClick={() => setQuantity(quantity - 1)} variant='outlined'>
                                <RemoveIcon />
                            </Button>
                            <span className='px-3 text-lg font-semibold'>
                                {quantity}
                            </span>
                            <Button onClick={() => setQuantity(quantity + 1)} variant='outlined'>
                                <AddIcon />
                            </Button>

                        </div>
                    </div>

                    <div className="mt-12 flex items-center gap-5">
                        <Button
                            onClick={handleAddCart}
                            sx={{ py: "1rem" }}
                            variant='contained' fullWidth startIcon={<AddShoppingCartIcon />}>
                            Add To Bag
                        </Button>
                        <Button
                            onClick={() => {
                                if (!localStorage.getItem('jwt')) {
                                    navigate('/login');
                                    return;
                                }
                                if (products.product) {
                                    dispatch(setBuyNowProduct({
                                        product: products.product,
                                        quantity,
                                        size: selectedSize || 'FREE',
                                    }));
                                    navigate('/checkout/buy-now');
                                }
                            }}
                            sx={{ py: "1rem" }}
                            color='warning'
                            variant='contained' fullWidth startIcon={<FlashOnIcon />}>
                            Buy Now
                        </Button>
                    </div>

                    <div className="ratings w-full mt-10">
                        <h1 className="font-semibold text-lg pb-4">
                            Review & Ratings
                        </h1>

                        <RatingCard totalReview={review.reviews.length} />
                        <div className='mt-10'>
                            <div className="space-y-5">
                                {review.reviews.map((item) => (
                                    <div className='space-y-5'>
                                        <ProductReviewCard item={item} />
                                        <Divider />
                                    </div>
                                ))}
                                <Button onClick={() => navigate(`/reviews/${productId}`)}>View All {review.reviews.length} Reviews</Button>
                            </div>
                        </div>



                    </div>
                </section>



            </div>
            <section className='mt-20'>
                <h1 className='text-lg font-bold'>Similar Product</h1>

                <div className='pt-5'>
                    <SmilarProduct />
                </div>

            </section>
        </div>
    )
}

export default ProductDetails
