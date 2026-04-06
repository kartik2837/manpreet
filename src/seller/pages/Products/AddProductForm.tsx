import { useFormik } from "formik";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import "tailwindcss/tailwind.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { colors } from "../../../data/Filter/color";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createProduct, updateProduct } from "../../../Redux Toolkit/Seller/sellerProductSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { api } from "../../../Config/Api";
import React, { useState, useEffect } from "react";

interface AddProductFormProps {
  initialValues?: any;
  mode?: "add" | "edit";
  onSubmit?: (values: any) => void;
  onClose?: () => void;
}

const defaultInitialValues = {
  title: "",
  description: "",
  mrpPrice: "",
  sellingPrice: "",
  quantity: "",
  color: "",
  images: [],
  category: "",
  category2: "",
  category3: "",
  sizes: "",

  // 🔥 NEW FIELDS
  brand: "",
  slug: "",
  sku: "",
  hsnCode: "",
  gstPercent: "",
  countryOfOrigin: "India",
  unitValue: "",
  unitType: "piece",
  weightValue: "",
  weightUnit: "kg",
  length: "",
  width: "",
  height: "",
  dimensionUnit: "cm",
  shippingCharges: "",
  estimatedDeliveryDays: 3,
  isFeatured: false,
  metaTitle: "",
  metaDescription: "",
  keywords: "",
};


const AddProductForm: React.FC<AddProductFormProps> = ({
  initialValues = defaultInitialValues,
  mode = "add",
  onSubmit,
  onClose,
}) => {
  const [uploadImage, setUploadingImage] = useState(false);
  const dispatch = useAppDispatch();
  const { sellerProduct } = useAppSelector((store) => store);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  // Category hierarchy states
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInitialValues = () => {
    if (mode === "edit" && initialValues._id) {
      return {
        ...defaultInitialValues,
        ...initialValues,
        mrpPrice: initialValues.mrpPrice || "",
        sellingPrice: initialValues.sellingPrice || "",
        quantity: initialValues.quantity || "",
        weightValue: initialValues.weight?.value || "",
        weightUnit: initialValues.weight?.unit || "kg",
        length: initialValues.dimensions?.length || "",
        width: initialValues.dimensions?.width || "",
        height: initialValues.dimensions?.height || "",
        dimensionUnit: initialValues.dimensions?.unit || "cm",
        keywords: Array.isArray(initialValues.keywords)
          ? initialValues.keywords.join(", ")
          : initialValues.keywords || "",
        category: initialValues.category?.level === 1
          ? initialValues.category.categoryId
          : initialValues.category?.parentCategory?.level === 1
            ? initialValues.category.parentCategory.categoryId
            : initialValues.category?.parentCategory?.parentCategory?.categoryId || "",
        category2: initialValues.category?.level === 2
          ? initialValues.category.categoryId
          : initialValues.category?.level === 3
            ? initialValues.category.parentCategory?.categoryId || ""
            : "",
        category3: initialValues.category?.level === 3
          ? initialValues.category.categoryId
          : "",
      };
    }
    return initialValues;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    onSubmit: (values) => {

      const finalData = {
        ...values,

        mrpPrice: Number(values.mrpPrice),
        sellingPrice: Number(values.sellingPrice),
        quantity: Number(values.quantity),
        discountPercent: Math.round(
          ((values.mrpPrice - values.sellingPrice) / values.mrpPrice) * 100
        ),

        gstPercent: Number(values.gstPercent),
        unitValue: Number(values.unitValue),
        shippingCharges: Number(values.shippingCharges),
        estimatedDeliveryDays: Number(values.estimatedDeliveryDays),

        weight: {
          value: Number(values.weightValue),
          unit: values.weightUnit,
        },

        dimensions: {
          length: Number(values.length),
          width: Number(values.width),
          height: Number(values.height),
          unit: values.dimensionUnit,
        },

        keywords: values.keywords
          ? Array.isArray(values.keywords)
            ? values.keywords
            : values.keywords.split(",").map((k: string) => k.trim())
          : [],
      };

      if (mode === "edit") {
        // Sanitize data for update: remove internal fields that should not be sent
        const {
          _id,
          id,
          __v,
          createdAt,
          updatedAt,
          seller,
          category,
          category2,
          category3,
          ...updateData
        } = finalData;

        if (onSubmit) {
          onSubmit(updateData);
        } else {
          dispatch(
            updateProduct({
              productId: initialValues._id,
              product: updateData as any,
            })
          );
        }
      } else {
        if (onSubmit) {
          onSubmit(finalData);
        } else {
          dispatch(
            createProduct({
              request: finalData,
              jwt: localStorage.getItem("jwt"),
            })
          );
        }
      }
    },
  });

  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    // const image = URL.createObjectURL(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  // Fetch main categories on component mount
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get("/api/admin/main-categories");
        // Filter for level 1 categories (main categories)
        const mainCats = response.data.filter(
          (cat: any) => cat.level === 1
        );
        setMainCategories(mainCats);
        setError(null);
      } catch (err: any) {
        setError("Failed to load categories");
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchMainCategories();
  }, []);

  // Fetch sub categories when main category is selected
  const handleMainCategoryChange = async (mainCategoryId: string) => {
    formik.setFieldValue("category", mainCategoryId);
    formik.setFieldValue("category2", "");
    formik.setFieldValue("category3", "");

    if (!mainCategoryId) {
      setSubCategories([]);
      setChildCategories([]);
      return;
    }

    try {
      setLoadingCategories(true);
      const response = await api.get("/api/admin/main-categories");
      // Filter for level 2 categories that have this as parent
      const subCats = response.data.filter(
        (cat: any) =>
          cat.level === 2 && cat.parentCategoryId === mainCategoryId
      );
      setSubCategories(subCats);
      setChildCategories([]);
      setError(null);
    } catch (err: any) {
      setError("Failed to load sub categories");
      console.error("Error fetching sub categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch child categories when sub category is selected
  const handleSubCategoryChange = async (subCategoryId: string) => {
    formik.setFieldValue("category2", subCategoryId);
    formik.setFieldValue("category3", "");

    if (!subCategoryId) {
      setChildCategories([]);
      return;
    }

    try {
      setLoadingCategories(true);
      const response = await api.get("/api/admin/main-categories");
      // Filter for level 3 categories that have this as parent
      const childCats = response.data.filter(
        (cat: any) =>
          cat.level === 3 && cat.parentCategoryId === subCategoryId
      );
      setChildCategories(childCats);
      setError(null);
    } catch (err: any) {
      setError("Failed to load child categories");
      console.error("Error fetching child categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Handle child category selection
  const handleChildCategoryChange = (childCategoryId: string) => {
    formik.setFieldValue("category3", childCategoryId);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (sellerProduct.productCreated || sellerProduct.error) {
      setOpenSnackbar(true);
    }
  }, [sellerProduct.productCreated, sellerProduct.error]);

  // Handle category initialization in edit mode
  useEffect(() => {
    const initializeCategories = async () => {
      if (mode === "edit" && formik.values.category) {
        // Fetch sub-categories if main category exists
        try {
          const response = await api.get("/api/admin/main-categories");
          const subCats = response.data.filter(
            (cat: any) =>
              cat.level === 2 && cat.parentCategoryId === formik.values.category
          );
          setSubCategories(subCats);

          // Fetch child categories if sub-category exists
          if (formik.values.category2) {
            const childCats = response.data.filter(
              (cat: any) =>
                cat.level === 3 && cat.parentCategoryId === formik.values.category2
            );
            setChildCategories(childCats);
          }
        } catch (err) {
          console.error("Error initializing categories:", err);
        }
      }
    };

    if (mode === "edit" && formik.values.category) {
      initializeCategories();
    }
  }, [formik.values.category, formik.values.category2, mode]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <Grid container spacing={2}>
          <Grid className="flex flex-wrap gap-5" size={{ xs: 12 }}>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <label className="relative" htmlFor="fileInput">
              <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
                <AddPhotoAlternateIcon className="text-gray-700" />
              </span>
              {uploadImage && (
                <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                  <CircularProgress />
                </div>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              {formik.values.images.map((image: any, index: any) => (
                <div className="relative">
                  <img
                    className="w-24 h-24 object-cover"
                    key={index}
                    src={image}
                    alt={`ProductImage ${index + 1}`}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    className=""
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      outline: "none",
                    }}
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title ? (formik.errors.title as string) : ""}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              multiline
              rows={4}
              fullWidth
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={formik.touched.description ? (formik.errors.description as string) : ""}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="mrp_price"
              name="mrpPrice"
              label="MRP Price"
              type="number"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
              error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
              helperText={formik.touched.mrpPrice ? (formik.errors.mrpPrice as string) : ""}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="sellingPrice"
              name="sellingPrice"
              label="Selling Price"
              type="number"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              error={
                formik.touched.sellingPrice &&
                Boolean(formik.errors.sellingPrice)
              }
              helperText={
                formik.touched.sellingPrice ? (formik.errors.sellingPrice as string) : ""
              }
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl
              fullWidth
              error={formik.touched.color && Boolean(formik.errors.color)}
              required
            >
              <InputLabel id="color-label">Color</InputLabel>
              <Select
                labelId="color-label"
                id="color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                label="Color"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {colors.map((color) => (
                  <MenuItem value={color.name}>
                    <div className="flex gap-3">
                      <span
                        style={{ backgroundColor: color.hex }}
                        className={`h-5 w-5 rounded-full ${color.name === "White" ? "border" : ""
                          }`}
                      ></span>
                      <p>{color.name}</p>
                    </div>
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.color && formik.errors.color && (
                <FormHelperText>
                  {typeof formik.errors.color === "string"
                    ? formik.errors.color
                    : undefined}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl
              fullWidth
              error={formik.touched.sizes && Boolean(formik.errors.sizes)}
              required
            >
              <InputLabel id="sizes-label">Sizes</InputLabel>
              <Select
                labelId="sizes-label"
                id="sizes"
                name="sizes"
                value={formik.values.sizes}
                onChange={formik.handleChange}
                label="Sizes"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="FREE">FREE</MenuItem>
                <MenuItem value="S">S</MenuItem>
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="XL">XL</MenuItem>
              </Select>

            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              label="Stock / Inventory"
              type="number"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity ? (formik.errors.quantity as string) : ""}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl
              fullWidth
              error={
                formik.touched.category && Boolean(formik.errors.category)
              }
              required
              disabled={loadingCategories || mode === "edit"}
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                onChange={(e) => handleMainCategoryChange(e.target.value)}
                label="Category"
              >
                {mainCategories.map((item) => (
                  <MenuItem key={item.categoryId} value={item.categoryId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText error>{error}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl
              fullWidth
              error={
                formik.touched.category && Boolean(formik.errors.category)
              }
              required
              disabled={!formik.values.category || mode === "edit"}
            >
              <InputLabel id="category2-label">Second Category</InputLabel>
              <Select
                labelId="category2-label"
                id="category2"
                name="category2"
                value={formik.values.category2}
                onChange={(e) => handleSubCategoryChange(e.target.value)}
                label="Second Category"
              >
                {subCategories.map((item) => (
                  <MenuItem key={item.categoryId} value={item.categoryId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl
              fullWidth
              error={
                formik.touched.category && Boolean(formik.errors.category)
              }
              required
              disabled={!formik.values.category2 || mode === "edit"}
            >
              <InputLabel id="category3-label">Third Category</InputLabel>
              <Select
                labelId="category3-label"
                id="category3"
                name="category3"
                value={formik.values.category3}
                onChange={(e) => handleChildCategoryChange(e.target.value)}
                label="Third Category"
              >
                {childCategories.map((item) => (
                  <MenuItem key={item.categoryId} value={item.categoryId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Slug"
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="SKU"
              name="sku"
              value={formik.values.sku}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              label="HSN Code"
              name="hsnCode"
              value={formik.values.hsnCode}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="GST %"
              name="gstPercent"
              value={formik.values.gstPercent}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Unit Value"
              name="unitValue"
              value={formik.values.unitValue}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Unit Type</InputLabel>
              <Select
                name="unitType"
                value={formik.values.unitType}
                onChange={formik.handleChange}
              >
                <MenuItem value="g">Gram</MenuItem>
                <MenuItem value="kg">Kg</MenuItem>
                <MenuItem value="ml">ML</MenuItem>
                <MenuItem value="liter">Liter</MenuItem>
                <MenuItem value="piece">Piece</MenuItem>
                <MenuItem value="pack">Pack</MenuItem>
                <MenuItem value="meter">Meter</MenuItem>
                <MenuItem value="cm">CM</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Weight"
              name="weightValue"
              value={formik.values.weightValue}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Weight Unit</InputLabel>
              <Select
                name="weightUnit"
                value={formik.values.weightUnit}
                onChange={formik.handleChange}
              >
                <MenuItem value="g">Gram</MenuItem>
                <MenuItem value="kg">Kg</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <TextField fullWidth label="Length" name="length" value={formik.values.length} onChange={formik.handleChange} />
          </Grid>

          <Grid size={{ xs: 4 }}>
            <TextField fullWidth label="Width" name="width" value={formik.values.width} onChange={formik.handleChange} />
          </Grid>

          <Grid size={{ xs: 4 }}>
            <TextField fullWidth label="Height" name="height" value={formik.values.height} onChange={formik.handleChange} />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Shipping Charges"
              name="shippingCharges"
              value={formik.values.shippingCharges}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Delivery Days"
              name="estimatedDeliveryDays"
              value={formik.values.estimatedDeliveryDays}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Meta Title"
              name="metaTitle"
              value={formik.values.metaTitle}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Meta Description"
              name="metaDescription"
              value={formik.values.metaDescription}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Keywords (comma separated)"
              name="keywords"
              value={formik.values.keywords}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={12}>
            <Button
              sx={{ p: "14px" }}
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disabled={sellerProduct.loading}
            >
              {sellerProduct.loading ? (
                <CircularProgress
                  size="small"
                  sx={{ width: "27px", height: "27px" }}
                />
              ) : mode === "edit" ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </Grid>
          {onClose && (
            <Grid size={12}>
              <Button onClick={onClose} color="secondary" fullWidth>
                Cancel
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={sellerProduct.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {sellerProduct.error
            ? sellerProduct.error
            : "Product created successfully"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddProductForm;














// import { useFormik } from "formik";
// import {
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   FormHelperText,
//   Grid,
//   CircularProgress,
//   IconButton,
//   Snackbar,
//   Alert,
//   Autocomplete,
//   Checkbox,
//   Typography,
// } from "@mui/material";
// import "tailwindcss/tailwind.css";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import CloseIcon from "@mui/icons-material/Close";
// import { colors } from "../../../data/Filter/color";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { createProduct, updateProduct } from "../../../Redux Toolkit/Seller/sellerProductSlice";
// import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
// import { api } from "../../../Config/Api";
// import React, { useState, useEffect } from "react";

// interface AddProductFormProps {
//   initialValues?: any;
//   mode?: "add" | "edit";
//   onSubmit?: (values: any) => void;
//   onClose?: () => void;
// }

// const defaultInitialValues = {
//   title: "",
//   description: "",
//   mrpPrice: "",
//   sellingPrice: "",
//   quantity: "",
//   color: "",
//   images: [],
//   category: "",
//   category2: "",
//   category3: "",
//   sizes: [],

//   brand: "",
//   slug: "",
//   sku: "",
//   hsnCode: "",
//   gstPercent: "",
//   countryOfOrigin: "India",
//   unitValue: "",
//   unitType: "piece",
//   weightValue: "",
//   weightUnit: "kg",
//   length: "",
//   width: "",
//   height: "",
//   dimensionUnit: "cm",
//   shippingCharges: "",
//   estimatedDeliveryDays: 3,
//   isFeatured: false,
//   metaTitle: "",
//   metaDescription: "",
//   keywords: "",
// };

// const AddProductForm: React.FC<AddProductFormProps> = ({
//   initialValues = defaultInitialValues,
//   mode = "add",
//   onSubmit,
//   onClose,
// }) => {
//   const [uploadImage, setUploadingImage] = useState(false);
//   const dispatch = useAppDispatch();
//   const { sellerProduct } = useAppSelector((store) => store);
//   const [snackbarOpen, setOpenSnackbar] = useState(false);

//   // Category states
//   const [mainCategories, setMainCategories] = useState<any[]>([]);
//   const [subCategories, setSubCategories] = useState<any[]>([]);
//   const [childCategories, setChildCategories] = useState<any[]>([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Convert initial sizes to array (if stored as string)
//   const getInitialValues = () => {
//     if (mode === "edit" && initialValues._id) {
//       let sizesArray = initialValues.sizes;
//       if (typeof initialValues.sizes === "string") {
//         sizesArray = initialValues.sizes.split(",").map((s: string) => s.trim());
//       } else if (!Array.isArray(initialValues.sizes)) {
//         sizesArray = [];
//       }

//       return {
//         ...defaultInitialValues,
//         ...initialValues,
//         mrpPrice: initialValues.mrpPrice || "",
//         sellingPrice: initialValues.sellingPrice || "",
//         quantity: initialValues.quantity || "",
//         weightValue: initialValues.weight?.value || "",
//         weightUnit: initialValues.weight?.unit || "kg",
//         length: initialValues.dimensions?.length || "",
//         width: initialValues.dimensions?.width || "",
//         height: initialValues.dimensions?.height || "",
//         dimensionUnit: initialValues.dimensions?.unit || "cm",
//         keywords: Array.isArray(initialValues.keywords)
//           ? initialValues.keywords.join(", ")
//           : initialValues.keywords || "",
//         sizes: sizesArray,
//         category: initialValues.category?.level === 1
//           ? initialValues.category.categoryId
//           : initialValues.category?.parentCategory?.level === 1
//             ? initialValues.category.parentCategory.categoryId
//             : initialValues.category?.parentCategory?.parentCategory?.categoryId || "",
//         category2: initialValues.category?.level === 2
//           ? initialValues.category.categoryId
//           : initialValues.category?.level === 3
//             ? initialValues.category.parentCategory?.categoryId || ""
//             : "",
//         category3: initialValues.category?.level === 3
//           ? initialValues.category.categoryId
//           : "",
//       };
//     }
//     return initialValues;
//   };

//   // Form validation (categories are optional)
//   const validate = (values: any) => {
//     const errors: any = {};

//     if (!values.title) errors.title = "Title is required";
//     if (!values.description) errors.description = "Description is required";
//     if (!values.mrpPrice) errors.mrpPrice = "MRP Price is required";
//     if (!values.sellingPrice) errors.sellingPrice = "Selling Price is required";
//     if (!values.color) errors.color = "Color is required";
//     if (!values.sizes || values.sizes.length === 0) {
//       errors.sizes = "Please select at least one size";
//     }
//     if (!values.quantity) errors.quantity = "Stock is required";
//     // Categories are optional – no validation
//     if (!values.brand) errors.brand = "Brand is required";
//     if (!values.slug) errors.slug = "Slug is required";
//     if (!values.sku) errors.sku = "SKU is required";
//     if (!values.hsnCode) errors.hsnCode = "HSN Code is required";
//     if (!values.gstPercent) errors.gstPercent = "GST % is required";
//     if (!values.unitValue) errors.unitValue = "Unit Value is required";

//     return errors;
//   };

//   const formik = useFormik({
//     initialValues: getInitialValues(),
//     enableReinitialize: true,
//     validate,
//     onSubmit: (values) => {
//       // Convert sizes array to comma-separated string (change to `values.sizes` if backend expects array)
//       const sizesToSend = Array.isArray(values.sizes) ? values.sizes.join(',') : values.sizes;

//       const finalData = {
//         ...values,
//         mrpPrice: Number(values.mrpPrice),
//         sellingPrice: Number(values.sellingPrice),
//         quantity: Number(values.quantity),
//         discountPercent: Math.round(
//           ((values.mrpPrice - values.sellingPrice) / values.mrpPrice) * 100
//         ),
//         gstPercent: Number(values.gstPercent),
//         unitValue: Number(values.unitValue),
//         shippingCharges: Number(values.shippingCharges),
//         estimatedDeliveryDays: Number(values.estimatedDeliveryDays),
//         weight: {
//           value: Number(values.weightValue),
//           unit: values.weightUnit,
//         },
//         dimensions: {
//           length: Number(values.length),
//           width: Number(values.width),
//           height: Number(values.height),
//           unit: values.dimensionUnit,
//         },
//         keywords: values.keywords
//           ? Array.isArray(values.keywords)
//             ? values.keywords
//             : values.keywords.split(",").map((k: string) => k.trim())
//           : [],
//         sizes: sizesToSend,
//       };

//       console.log("Final data before send:", finalData);

//       if (mode === "edit") {
//         const {
//           _id,
//           id,
//           __v,
//           createdAt,
//           updatedAt,
//           seller,
//           category,
//           category2,
//           category3,
//           ...updateData
//         } = finalData;

//         console.log("Update data being sent:", updateData);

//         if (onSubmit) {
//           onSubmit(updateData);
//         } else {
//           dispatch(
//             updateProduct({
//               productId: initialValues._id,
//               product: updateData as any,
//             })
//           );
//         }
//       } else {
//         if (onSubmit) {
//           onSubmit(finalData);
//         } else {
//           dispatch(
//             createProduct({
//               request: finalData,
//               jwt: localStorage.getItem("jwt"),
//             })
//           );
//         }
//       }
//     },
//   });

//   // Image handling
//   const handleImageChange = async (event: any) => {
//     const file = event.target.files[0];
//     setUploadingImage(true);
//     const image = await uploadToCloudinary(file);
//     formik.setFieldValue("images", [...formik.values.images, image]);
//     setUploadingImage(false);
//   };

//   const handleRemoveImage = (index: number) => {
//     const updatedImages = [...formik.values.images];
//     updatedImages.splice(index, 1);
//     formik.setFieldValue("images", updatedImages);
//   };

//   // Categories fetching
//   useEffect(() => {
//     const fetchMainCategories = async () => {
//       try {
//         setLoadingCategories(true);
//         const response = await api.get("/api/admin/main-categories");
//         const mainCats = response.data.filter((cat: any) => cat.level === 1);
//         setMainCategories(mainCats);
//         setError(null);
//       } catch (err: any) {
//         setError("Failed to load categories");
//         console.error("Error fetching categories:", err);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchMainCategories();
//   }, []);

//   const handleMainCategoryChange = async (mainCategoryId: string) => {
//     formik.setFieldValue("category", mainCategoryId);
//     formik.setFieldValue("category2", "");
//     formik.setFieldValue("category3", "");

//     if (!mainCategoryId) {
//       setSubCategories([]);
//       setChildCategories([]);
//       return;
//     }

//     try {
//       setLoadingCategories(true);
//       const response = await api.get("/api/admin/main-categories");
//       const subCats = response.data.filter(
//         (cat: any) => cat.level === 2 && cat.parentCategoryId === mainCategoryId
//       );
//       setSubCategories(subCats);
//       setChildCategories([]);
//       setError(null);
//     } catch (err: any) {
//       setError("Failed to load sub categories");
//       console.error("Error fetching sub categories:", err);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   const handleSubCategoryChange = async (subCategoryId: string) => {
//     formik.setFieldValue("category2", subCategoryId);
//     formik.setFieldValue("category3", "");

//     if (!subCategoryId) {
//       setChildCategories([]);
//       return;
//     }

//     try {
//       setLoadingCategories(true);
//       const response = await api.get("/api/admin/main-categories");
//       const childCats = response.data.filter(
//         (cat: any) => cat.level === 3 && cat.parentCategoryId === subCategoryId
//       );
//       setChildCategories(childCats);
//       setError(null);
//     } catch (err: any) {
//       setError("Failed to load child categories");
//       console.error("Error fetching child categories:", err);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   const handleChildCategoryChange = (childCategoryId: string) => {
//     formik.setFieldValue("category3", childCategoryId);
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   useEffect(() => {
//     if (sellerProduct.productCreated || sellerProduct.error) {
//       setOpenSnackbar(true);
//     }
//   }, [sellerProduct.productCreated, sellerProduct.error]);

//   useEffect(() => {
//     const initializeCategories = async () => {
//       if (mode === "edit" && formik.values.category) {
//         try {
//           const response = await api.get("/api/admin/main-categories");
//           const subCats = response.data.filter(
//             (cat: any) =>
//               cat.level === 2 && cat.parentCategoryId === formik.values.category
//           );
//           setSubCategories(subCats);

//           if (formik.values.category2) {
//             const childCats = response.data.filter(
//               (cat: any) =>
//                 cat.level === 3 && cat.parentCategoryId === formik.values.category2
//             );
//             setChildCategories(childCats);
//           }
//         } catch (err) {
//           console.error("Error initializing categories:", err);
//         }
//       }
//     };

//     if (mode === "edit" && formik.values.category) {
//       initializeCategories();
//     }
//   }, [formik.values.category, formik.values.category2, mode]);

//   return (
//     <div>
//       <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
//         <Grid container spacing={2}>
//           {/* Image upload */}
//           <Grid className="flex flex-wrap gap-5" size={{ xs: 12 }}>
//             <input
//               type="file"
//               accept="image/*"
//               id="fileInput"
//               style={{ display: "none" }}
//               onChange={handleImageChange}
//             />
//             <label className="relative" htmlFor="fileInput">
//               <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
//                 <AddPhotoAlternateIcon className="text-gray-700" />
//               </span>
//               {uploadImage && (
//                 <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
//                   <CircularProgress />
//                 </div>
//               )}
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {formik.values.images.map((image: any, index: any) => (
//                 <div key={index} className="relative">
//                   <img
//                     className="w-24 h-24 object-cover"
//                     src={image}
//                     alt={`ProductImage ${index + 1}`}
//                   />
//                   <IconButton
//                     onClick={() => handleRemoveImage(index)}
//                     size="small"
//                     color="error"
//                     sx={{
//                       position: "absolute",
//                       top: 0,
//                       right: 0,
//                       outline: "none",
//                     }}
//                   >
//                     <CloseIcon sx={{ fontSize: "1rem" }} />
//                   </IconButton>
//                 </div>
//               ))}
//             </div>
//           </Grid>

//           {/* Title */}
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               fullWidth
//               id="title"
//               name="title"
//               label="Title"
//               value={formik.values.title}
//               onChange={formik.handleChange}
//               error={formik.touched.title && Boolean(formik.errors.title)}
//               // helperText={formik.touched.title ? formik.errors.title : ""}
//               helperText={
//   formik.touched.title
//     ? (formik.errors.title as string)
//     : ""
// }
//               required
//             />
//           </Grid>

//           {/* Description */}
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               multiline
//               rows={4}
//               fullWidth
//               id="description"
//               name="description"
//               label="Description"
//               value={formik.values.description}
//               onChange={formik.handleChange}
//               error={formik.touched.description && Boolean(formik.errors.description)}
//               // helperText={formik.touched.description ? formik.errors.description : ""}
//               helperText={
//   formik.touched.description
//     ? (formik.errors.description as string)
//     : ""
// }
//               required
//             />
//           </Grid>

//           {/* Prices */}
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <TextField
//               fullWidth
//               id="mrp_price"
//               name="mrpPrice"
//               label="MRP Price"
//               type="number"
//               value={formik.values.mrpPrice}
//               onChange={formik.handleChange}
//               error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
//               // helperText={formik.touched.mrpPrice ? formik.errors.mrpPrice : ""}
//               helperText={
//   formik.touched.mrpPrice
//     ? (formik.errors.mrpPrice as string)
//     : ""
// }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <TextField
//               fullWidth
//               id="sellingPrice"
//               name="sellingPrice"
//               label="Selling Price"
//               type="number"
//               value={formik.values.sellingPrice}
//               onChange={formik.handleChange}
//               error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
//               // helperText={formik.touched.sellingPrice ? formik.errors.sellingPrice : ""}
//               helperText={
//   formik.touched.sellingPrice
//     ? (formik.errors.sellingPrice as string)
//     : ""
// }
//               required
//             />
//           </Grid>

//           {/* Color */}
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <FormControl
//               fullWidth
//               error={formik.touched.color && Boolean(formik.errors.color)}
//               required
//             >
//               <InputLabel id="color-label">Color</InputLabel>
//               <Select
//                 labelId="color-label"
//                 id="color"
//                 name="color"
//                 value={formik.values.color}
//                 onChange={formik.handleChange}
//                 label="Color"
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {colors.map((color) => (
//                   <MenuItem key={color.name} value={color.name}>
//                     <div className="flex gap-3">
//                       <span
//                         style={{ backgroundColor: color.hex }}
//                         className={`h-5 w-5 rounded-full ${color.name === "White" ? "border" : ""}`}
//                       ></span>
//                       <p>{color.name}</p>
//                     </div>
//                   </MenuItem>
//                 ))}
//               </Select>
//               {formik.touched.color && formik.errors.color && (
//                 // <FormHelperText>{formik.errors.color}</FormHelperText>
//                 <FormHelperText>
//   {formik.touched.color
//     ? (formik.errors.color as string)
//     : ""}
// </FormHelperText>
//               )}
//             </FormControl>
//           </Grid>

//           {/* Sizes - Required field */}
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <FormControl
//               fullWidth
//               error={formik.touched.sizes && Boolean(formik.errors.sizes)}
//             >
//               <Autocomplete
//                 multiple
//                 id="sizes"
//                 options={["FREE", "S", "M", "L", "XL","XXL"]}
//                 value={formik.values.sizes}
//                 onChange={(event, newValue) => {
//                   console.log("Sizes selected:", newValue);
//                   formik.setFieldValue("sizes", newValue);
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Sizes"
//                     error={formik.touched.sizes && Boolean(formik.errors.sizes)}
//                     // helperText={formik.touched.sizes ? formik.errors.sizes : ""}

//                     helperText={
//   formik.touched.sizes && formik.errors.sizes
//     ? (formik.errors.sizes as string)
//     : ""
// }
//                   />
//                 )}
//                 renderOption={(props, option, { selected }) => (
//                   <li {...props}>
//                     <Checkbox checked={selected} />
//                     {option}
//                   </li>
//                 )}
//               />
//               {formik.values.sizes.length > 0 && (
//                 <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
//                   Selected: {formik.values.sizes.join(', ')}
//                 </Typography>
//               )}
//             </FormControl>
//           </Grid>

//           {/* Quantity */}
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <TextField
//               fullWidth
//               id="quantity"
//               name="quantity"
//               label="Stock / Inventory"
//               type="number"
//               value={formik.values.quantity}
//               onChange={formik.handleChange}
//               error={formik.touched.quantity && Boolean(formik.errors.quantity)}
//               // helperText={formik.touched.quantity ? formik.errors.quantity : ""}

//               helperText={
//   formik.touched.quantity
//     ? (formik.errors.quantity as string)
//     : ""
// }
//               required
//             />
//           </Grid>

//           {/* Categories - Optional */}
//           <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
//             <FormControl
//               fullWidth
//               error={formik.touched.category && Boolean(formik.errors.category)}
//               disabled={loadingCategories}
//             >
//               <InputLabel id="category-label">Category (Optional)</InputLabel>
//               <Select
//                 labelId="category-label"
//                 id="category"
//                 name="category"
//                 value={formik.values.category}
//                 onChange={(e) => handleMainCategoryChange(e.target.value)}
//                 label="Category (Optional)"
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {mainCategories.map((item) => (
//                   <MenuItem key={item.categoryId} value={item.categoryId}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//               {error && <FormHelperText error>{error}</FormHelperText>}
//             </FormControl>
//           </Grid>

//           <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
//             <FormControl
//               fullWidth
//               error={formik.touched.category2 && Boolean(formik.errors.category2)}
//               disabled={!formik.values.category}
//             >
//               <InputLabel id="category2-label">Second Category (Optional)</InputLabel>
//               <Select
//                 labelId="category2-label"
//                 id="category2"
//                 name="category2"
//                 value={formik.values.category2}
//                 onChange={(e) => handleSubCategoryChange(e.target.value)}
//                 label="Second Category (Optional)"
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {subCategories.map((item) => (
//                   <MenuItem key={item.categoryId} value={item.categoryId}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
//             <FormControl
//               fullWidth
//               error={formik.touched.category3 && Boolean(formik.errors.category3)}
//               disabled={!formik.values.category2}
//             >
//               <InputLabel id="category3-label">Third Category (Optional)</InputLabel>
//               <Select
//                 labelId="category3-label"
//                 id="category3"
//                 name="category3"
//                 value={formik.values.category3}
//                 onChange={(e) => handleChildCategoryChange(e.target.value)}
//                 label="Third Category (Optional)"
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {childCategories.map((item) => (
//                   <MenuItem key={item.categoryId} value={item.categoryId}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* Brand, Slug, SKU, etc. */}
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <TextField
//               fullWidth
//               label="Brand"
//               name="brand"
//               value={formik.values.brand}
//               onChange={formik.handleChange}
//               error={formik.touched.brand && Boolean(formik.errors.brand)}
//               // helperText={formik.touched.brand ? formik.errors.brand : ""}

//               helperText={
//   formik.touched.brand
//     ? (formik.errors.brand as string)
//     : ""
// }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <TextField
//               fullWidth
//               label="Slug"
//               name="slug"
//               value={formik.values.slug}
//               onChange={formik.handleChange}
//               error={formik.touched.slug && Boolean(formik.errors.slug)}
//               // helperText={formik.touched.slug ? formik.errors.slug : ""}

//               helperText={
//   formik.touched.slug
//     ? (formik.errors.slug as string)
//     : ""
// }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <TextField
//               fullWidth
//               label="SKU"
//               name="sku"
//               value={formik.values.sku}
//               onChange={formik.handleChange}
//               error={formik.touched.sku && Boolean(formik.errors.sku)}
//               // helperText={formik.touched.sku ? formik.errors.sku : ""}

//               helperText={
//   formik.touched.sku
//     ? (formik.errors.sku as string)
//     : ""
// }


//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="HSN Code"
//               name="hsnCode"
//               value={formik.values.hsnCode}
//               onChange={formik.handleChange}
//               error={formik.touched.hsnCode && Boolean(formik.errors.hsnCode)}
//               // helperText={formik.touched.hsnCode ? formik.errors.hsnCode : ""}
//               helperText={
//   formik.touched.hsnCode
//     ? (formik.errors.hsnCode as string)
//     : ""
// }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="number"
//               label="GST %"
//               name="gstPercent"
//               value={formik.values.gstPercent}
//               onChange={formik.handleChange}
//               error={formik.touched.gstPercent && Boolean(formik.errors.gstPercent)}
//               // helperText={formik.touched.gstPercent ? formik.errors.gstPercent : ""}
//               helperText={
//   formik.touched.gstPercent
//     ? (formik.errors.gstPercent as string)
//     : ""
// }



              
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="number"
//               label="Unit Value"
//               name="unitValue"
//               value={formik.values.unitValue}
//               onChange={formik.handleChange}
//               error={formik.touched.unitValue && Boolean(formik.errors.unitValue)}
//               // helperText={formik.touched.unitValue ? formik.errors.unitValue : ""}

// helperText={
//   formik.touched.unitValue
//     ? (formik.errors.unitValue as string)
//     : ""
// }



//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <FormControl fullWidth>
//               <InputLabel>Unit Type</InputLabel>
//               <Select
//                 name="unitType"
//                 value={formik.values.unitType}
//                 onChange={formik.handleChange}
//               >
//                 <MenuItem value="g">Gram</MenuItem>
//                 <MenuItem value="kg">Kg</MenuItem>
//                 <MenuItem value="ml">ML</MenuItem>
//                 <MenuItem value="liter">Liter</MenuItem>
//                 <MenuItem value="piece">Piece</MenuItem>
//                 <MenuItem value="pack">Pack</MenuItem>
//                 <MenuItem value="meter">Meter</MenuItem>
//                 <MenuItem value="cm">CM</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="number"
//               label="Weight"
//               name="weightValue"
//               value={formik.values.weightValue}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <FormControl fullWidth>
//               <InputLabel>Weight Unit</InputLabel>
//               <Select
//                 name="weightUnit"
//                 value={formik.values.weightUnit}
//                 onChange={formik.handleChange}
//               >
//                 <MenuItem value="g">Gram</MenuItem>
//                 <MenuItem value="kg">Kg</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid size={{ xs: 4 }}>
//             <TextField fullWidth label="Length" name="length" value={formik.values.length} onChange={formik.handleChange} />
//           </Grid>
//           <Grid size={{ xs: 4 }}>
//             <TextField fullWidth label="Width" name="width" value={formik.values.width} onChange={formik.handleChange} />
//           </Grid>
//           <Grid size={{ xs: 4 }}>
//             <TextField fullWidth label="Height" name="height" value={formik.values.height} onChange={formik.handleChange} />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="number"
//               label="Shipping Charges"
//               name="shippingCharges"
//               value={formik.values.shippingCharges}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="number"
//               label="Delivery Days"
//               name="estimatedDeliveryDays"
//               value={formik.values.estimatedDeliveryDays}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               fullWidth
//               label="Meta Title"
//               name="metaTitle"
//               value={formik.values.metaTitle}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               fullWidth
//               multiline
//               rows={2}
//               label="Meta Description"
//               name="metaDescription"
//               value={formik.values.metaDescription}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               fullWidth
//               label="Keywords (comma separated)"
//               name="keywords"
//               value={formik.values.keywords}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={12}>
//             <Button
//               sx={{ p: "14px" }}
//               color="primary"
//               variant="contained"
//               fullWidth
//               type="submit"
//               disabled={sellerProduct.loading}
//             >
//               {sellerProduct.loading ? (
//                 <CircularProgress size="small" sx={{ width: "27px", height: "27px" }} />
//               ) : mode === "edit" ? (
//                 "Update Product"
//               ) : (
//                 "Add Product"
//               )}
//             </Button>
//           </Grid>
//           {onClose && (
//             <Grid size={12}>
//               <Button onClick={onClose} color="secondary" fullWidth>
//                 Cancel
//               </Button>
//             </Grid>
//           )}
//         </Grid>
//       </form>
//       <Snackbar
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={sellerProduct.error ? "error" : "success"}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {sellerProduct.error
//             ? sellerProduct.error
//             : mode === "edit"
//             ? "Product updated successfully"
//             : "Product created successfully"}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default AddProductForm;





















// import { useFormik } from "formik";
// import {
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   FormHelperText,
//   Grid,
//   CircularProgress,
//   IconButton,
//   Snackbar,
//   Alert,
//   Autocomplete,
//   Checkbox,
//   Typography,
// } from "@mui/material";
// import "tailwindcss/tailwind.css";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import CloseIcon from "@mui/icons-material/Close";
// import { colors } from "../../../data/filter/color";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { createProduct, updateProduct } from "../../../Redux Toolkit/Seller/sellerProductSlice";
// import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
// import { api } from "../../../Config/Api";
// import React, { useState, useEffect } from "react";

// interface AddProductFormProps {
//   initialValues?: any;
//   mode?: "add" | "edit";
//   onSubmit?: (values: any) => void;
//   onClose?: () => void;
// }

// const defaultInitialValues = {
//   title: "",
//   description: "",
//   mrpPrice: "",
//   sellingPrice: "",
//   quantity: "",
//   color: "",
//   images: [],
//   category: "",
//   category2: "",
//   category3: "",
//   sizes: [],
//   brand: "",
//   slug: "",
//   sku: "",
//   hsnCode: "",
//   gstPercent: "",
//   countryOfOrigin: "India",
//   unitValue: "",
//   unitType: "piece",
//   weightValue: "",
//   weightUnit: "kg",
//   length: "",
//   width: "",
//   height: "",
//   dimensionUnit: "cm",
//   shippingCharges: "",
//   estimatedDeliveryDays: 3,
//   isFeatured: false,
//   metaTitle: "",
//   metaDescription: "",
//   keywords: "",
// };

// const AddProductForm: React.FC<AddProductFormProps> = ({
//   initialValues = defaultInitialValues,
//   mode = "add",
//   onSubmit,
//   onClose,
// }) => {
//   const [uploadImage, setUploadingImage] = useState(false);
//   const dispatch = useAppDispatch();
//   const { sellerProduct } = useAppSelector((store) => store);
//   const [snackbarOpen, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   // Category states
//   const [mainCategories, setMainCategories] = useState<any[]>([]);
//   const [subCategories, setSubCategories] = useState<any[]>([]);
//   const [childCategories, setChildCategories] = useState<any[]>([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Convert initial sizes to array (if stored as string)
//   const getInitialValues = () => {
//     if (mode === "edit" && initialValues._id) {
//       let sizesArray = initialValues.sizes;
//       if (typeof initialValues.sizes === "string") {
//         sizesArray = initialValues.sizes.split(",").map((s: string) => s.trim());
//       } else if (!Array.isArray(initialValues.sizes)) {
//         sizesArray = [];
//       }

//       return {
//         ...defaultInitialValues,
//         ...initialValues,
//         mrpPrice: initialValues.mrpPrice || "",
//         sellingPrice: initialValues.sellingPrice || "",
//         quantity: initialValues.quantity || "",
//         weightValue: initialValues.weight?.value || "",
//         weightUnit: initialValues.weight?.unit || "kg",
//         length: initialValues.dimensions?.length || "",
//         width: initialValues.dimensions?.width || "",
//         height: initialValues.dimensions?.height || "",
//         dimensionUnit: initialValues.dimensions?.unit || "cm",
//         keywords: Array.isArray(initialValues.keywords)
//           ? initialValues.keywords.join(", ")
//           : initialValues.keywords || "",
//         sizes: sizesArray,
//         category: initialValues.category?.level === 1
//           ? initialValues.category.categoryId
//           : initialValues.category?.parentCategory?.level === 1
//             ? initialValues.category.parentCategory.categoryId
//             : initialValues.category?.parentCategory?.parentCategory?.categoryId || "",
//         category2: initialValues.category?.level === 2
//           ? initialValues.category.categoryId
//           : initialValues.category?.level === 3
//             ? initialValues.category.parentCategory?.categoryId || ""
//             : "",
//         category3: initialValues.category?.level === 3
//           ? initialValues.category.categoryId
//           : "",
//       };
//     }
//     return initialValues;
//   };

//   // Form validation (categories are optional)
//   const validate = (values: any) => {
//     const errors: any = {};

//     if (!values.title) errors.title = "Title is required";
//     if (!values.description) errors.description = "Description is required";
//     if (!values.mrpPrice) errors.mrpPrice = "MRP Price is required";
//     if (!values.sellingPrice) errors.sellingPrice = "Selling Price is required";
//     if (!values.color) errors.color = "Color is required";
//     if (!values.sizes || values.sizes.length === 0) {
//       errors.sizes = "Please select at least one size";
//     }
//     if (!values.quantity) errors.quantity = "Stock is required";
//     if (!values.brand) errors.brand = "Brand is required";
//     if (!values.slug) errors.slug = "Slug is required";
//     if (!values.sku) errors.sku = "SKU is required";
//     if (!values.hsnCode) errors.hsnCode = "HSN Code is required";
//     if (!values.gstPercent) errors.gstPercent = "GST % is required";
//     if (!values.unitValue) errors.unitValue = "Unit Value is required";

//     return errors;
//   };

//   const formik = useFormik({
//     initialValues: getInitialValues(),
//     enableReinitialize: true,
//     validate,
//     onSubmit: (values) => {
//       const sizesToSend = Array.isArray(values.sizes) ? values.sizes.join(',') : values.sizes;

//       const finalData = {
//         ...values,
//         mrpPrice: Number(values.mrpPrice),
//         sellingPrice: Number(values.sellingPrice),
//         quantity: Number(values.quantity),
//         discountPercent: Math.round(
//           ((values.mrpPrice - values.sellingPrice) / values.mrpPrice) * 100
//         ),
//         gstPercent: Number(values.gstPercent),
//         unitValue: Number(values.unitValue),
//         shippingCharges: Number(values.shippingCharges),
//         estimatedDeliveryDays: Number(values.estimatedDeliveryDays),
//         weight: {
//           value: Number(values.weightValue),
//           unit: values.weightUnit,
//         },
//         dimensions: {
//           length: Number(values.length),
//           width: Number(values.width),
//           height: Number(values.height),
//           unit: values.dimensionUnit,
//         },
//         keywords: values.keywords
//           ? Array.isArray(values.keywords)
//             ? values.keywords
//             : values.keywords.split(",").map((k: string) => k.trim())
//           : [],
//         sizes: sizesToSend,
//       };

//       console.log("Final data before send:", finalData);

//       if (mode === "edit") {
//         const {
//           _id,
//           id,
//           __v,
//           createdAt,
//           updatedAt,
//           seller,
//           category,
//           category2,
//           category3,
//           ...updateData
//         } = finalData;

//         console.log("Update data being sent:", updateData);

//         if (onSubmit) {
//           onSubmit(updateData);
//         } else {
//           dispatch(
//             updateProduct({
//               productId: initialValues._id,
//               product: updateData as any,
//             })
//           );
//         }
//       } else {
//         if (onSubmit) {
//           onSubmit(finalData);
//         } else {
//           dispatch(
//             createProduct({
//               request: finalData,
//               jwt: localStorage.getItem("jwt"),
//             })
//           );
//         }
//       }
//     },
//   });

//   // Image handling – fixed with error handling and null check
//   const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files || files.length === 0) return;

//     const file = files[0];
//     setUploadingImage(true);
//     try {
//       const image = await uploadToCloudinary(file);
//       formik.setFieldValue("images", [...formik.values.images, image]);
//     } catch (err) {
//       console.error("Image upload error:", err);
//       setSnackbarMessage("Image upload failed. Please try again.");
//       setOpenSnackbar(true);
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     const updatedImages = [...formik.values.images];
//     updatedImages.splice(index, 1);
//     formik.setFieldValue("images", updatedImages);
//   };

//   // Categories fetching
//   useEffect(() => {
//     const fetchMainCategories = async () => {
//       try {
//         setLoadingCategories(true);
//         const response = await api.get("/api/admin/main-categories");
//         const mainCats = response.data.filter((cat: any) => cat.level === 1);
//         setMainCategories(mainCats);
//         setError(null);
//       } catch (err: any) {
//         setError("Failed to load categories");
//         console.error("Error fetching categories:", err);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchMainCategories();
//   }, []);

//   const handleMainCategoryChange = async (mainCategoryId: string) => {
//     formik.setFieldValue("category", mainCategoryId);
//     formik.setFieldValue("category2", "");
//     formik.setFieldValue("category3", "");

//     if (!mainCategoryId) {
//       setSubCategories([]);
//       setChildCategories([]);
//       return;
//     }

//     try {
//       setLoadingCategories(true);
//       const response = await api.get("/api/admin/main-categories");
//       const subCats = response.data.filter(
//         (cat: any) => cat.level === 2 && cat.parentCategoryId === mainCategoryId
//       );
//       setSubCategories(subCats);
//       setChildCategories([]);
//       setError(null);
//     } catch (err: any) {
//       setError("Failed to load sub categories");
//       console.error("Error fetching sub categories:", err);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   const handleSubCategoryChange = async (subCategoryId: string) => {
//     formik.setFieldValue("category2", subCategoryId);
//     formik.setFieldValue("category3", "");

//     if (!subCategoryId) {
//       setChildCategories([]);
//       return;
//     }

//     try {
//       setLoadingCategories(true);
//       const response = await api.get("/api/admin/main-categories");
//       const childCats = response.data.filter(
//         (cat: any) => cat.level === 3 && cat.parentCategoryId === subCategoryId
//       );
//       setChildCategories(childCats);
//       setError(null);
//     } catch (err: any) {
//       setError("Failed to load child categories");
//       console.error("Error fetching child categories:", err);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   const handleChildCategoryChange = (childCategoryId: string) => {
//     formik.setFieldValue("category3", childCategoryId);
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   useEffect(() => {
//     if (sellerProduct.productCreated || sellerProduct.error) {
//       setOpenSnackbar(true);
//     }
//   }, [sellerProduct.productCreated, sellerProduct.error]);

//   useEffect(() => {
//     const initializeCategories = async () => {
//       if (mode === "edit" && formik.values.category) {
//         try {
//           const response = await api.get("/api/admin/main-categories");
//           const subCats = response.data.filter(
//             (cat: any) =>
//               cat.level === 2 && cat.parentCategoryId === formik.values.category
//           );
//           setSubCategories(subCats);

//           if (formik.values.category2) {
//             const childCats = response.data.filter(
//               (cat: any) =>
//                 cat.level === 3 && cat.parentCategoryId === formik.values.category2
//             );
//             setChildCategories(childCats);
//           }
//         } catch (err) {
//           console.error("Error initializing categories:", err);
//         }
//       }
//     };

//     if (mode === "edit" && formik.values.category) {
//       initializeCategories();
//     }
//   }, [formik.values.category, formik.values.category2, mode]);

//   return (
//     <div>
//       <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
//         <Grid container spacing={2}>
//           {/* Image upload */}
//           <Grid size={{ xs: 12 }} className="flex flex-wrap gap-5">
//             <input
//               type="file"
//               accept="image/*"
//               id="fileInput"
//               style={{ display: "none" }}
//               onChange={handleImageChange}
//             />
//             <label className="relative" htmlFor="fileInput">
//               <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
//                 <AddPhotoAlternateIcon className="text-gray-700" />
//               </span>
//               {uploadImage && (
//                 <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
//                   <CircularProgress />
//                 </div>
//               )}
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {formik.values.images.map((image: any, index: any) => (
//                 <div key={index} className="relative">
//                   <img
//                     className="w-24 h-24 object-cover"
//                     src={image}
//                     alt={`ProductImage ${index + 1}`}
//                   />
//                   <IconButton
//                     onClick={() => handleRemoveImage(index)}
//                     size="small"
//                     color="error"
//                     sx={{
//                       position: "absolute",
//                       top: 0,
//                       right: 0,
//                       outline: "none",
//                     }}
//                   >
//                     <CloseIcon sx={{ fontSize: "1rem" }} />
//                   </IconButton>
//                 </div>
//               ))}
//             </div>
//           </Grid>

//           {/* Title */}
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               fullWidth
//               id="title"
//               name="title"
//               label="Title"
//               value={formik.values.title}
//               onChange={formik.handleChange}
//               error={formik.touched.title && Boolean(formik.errors.title)}
//               helperText={
//                 formik.touched.title ? (formik.errors.title as string) : ""
//               }
//               required
//             />
//           </Grid>

//           {/* Description */}
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               multiline
//               rows={4}
//               fullWidth
//               id="description"
//               name="description"
//               label="Description"
//               value={formik.values.description}
//               onChange={formik.handleChange}
//               error={formik.touched.description && Boolean(formik.errors.description)}
//               helperText={
//                 formik.touched.description ? (formik.errors.description as string) : ""
//               }
//               required
//             />
//           </Grid>

//           {/* Prices */}
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <TextField
//               fullWidth
//               id="mrp_price"
//               name="mrpPrice"
//               label="MRP Price"
//               type="number"
//               value={formik.values.mrpPrice}
//               onChange={formik.handleChange}
//               error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
//               helperText={
//                 formik.touched.mrpPrice ? (formik.errors.mrpPrice as string) : ""
//               }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <TextField
//               fullWidth
//               id="sellingPrice"
//               name="sellingPrice"
//               label="Selling Price"
//               type="number"
//               value={formik.values.sellingPrice}
//               onChange={formik.handleChange}
//               error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
//               helperText={
//                 formik.touched.sellingPrice ? (formik.errors.sellingPrice as string) : ""
//               }
//               required
//             />
//           </Grid>

//           {/* Color */}
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <FormControl
//               fullWidth
//               error={formik.touched.color && Boolean(formik.errors.color)}
//               required
//             >
//               <InputLabel id="color-label">Color</InputLabel>
//               <Select
//                 labelId="color-label"
//                 id="color"
//                 name="color"
//                 value={formik.values.color}
//                 onChange={formik.handleChange}
//                 label="Color"
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {colors.map((color) => (
//                   <MenuItem key={color.name} value={color.name}>
//                     <div className="flex gap-3">
//                       <span
//                         style={{ backgroundColor: color.hex }}
//                         className={`h-5 w-5 rounded-full ${color.name === "White" ? "border" : ""}`}
//                       ></span>
//                       <p>{color.name}</p>
//                     </div>
//                   </MenuItem>
//                 ))}
//               </Select>
//               {formik.touched.color && formik.errors.color && (
//                 <FormHelperText>
//                   {formik.touched.color ? (formik.errors.color as string) : ""}
//                 </FormHelperText>
//               )}
//             </FormControl>
//           </Grid>

//           {/* Sizes - Required field */}
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <FormControl
//               fullWidth
//               error={formik.touched.sizes && Boolean(formik.errors.sizes)}
//             >
//               <Autocomplete
//                 multiple
//                 id="sizes"
//                 options={["FREE", "S", "M", "L", "XL", "XXL"]}
//                 value={formik.values.sizes}
//                 onChange={(_event, newValue) => {
//                   console.log("Sizes selected:", newValue);
//                   formik.setFieldValue("sizes", newValue ?? []);
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Sizes"
//                     error={formik.touched.sizes && Boolean(formik.errors.sizes)}
//                     helperText={
//                       formik.touched.sizes && formik.errors.sizes
//                         ? (formik.errors.sizes as string)
//                         : ""
//                     }
//                   />
//                 )}
//                 renderOption={(props, option, { selected }) => (
//                   <li {...props}>
//                     <Checkbox checked={selected} />
//                     {option}
//                   </li>
//                 )}
//               />
//               {formik.values.sizes.length > 0 && (
//                 <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
//                   Selected: {formik.values.sizes.join(', ')}
//                 </Typography>
//               )}
//             </FormControl>
//           </Grid>

//           {/* Quantity */}
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <TextField
//               fullWidth
//               id="quantity"
//               name="quantity"
//               label="Stock / Inventory"
//               type="number"
//               value={formik.values.quantity}
//               onChange={formik.handleChange}
//               error={formik.touched.quantity && Boolean(formik.errors.quantity)}
//               helperText={
//                 formik.touched.quantity ? (formik.errors.quantity as string) : ""
//               }
//               required
//             />
//           </Grid>

//           {/* Categories - Optional */}
//           <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
//             <FormControl
//               fullWidth
//               error={formik.touched.category && Boolean(formik.errors.category)}
//               disabled={loadingCategories}
//             >
//               <InputLabel id="category-label">Category (Optional)</InputLabel>
//               <Select
//                 labelId="category-label"
//                 id="category"
//                 name="category"
//                 value={formik.values.category}
//                 onChange={(e) => handleMainCategoryChange(e.target.value)}
//                 label="Category (Optional)"
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {mainCategories.map((item) => (
//                   <MenuItem key={item.categoryId} value={item.categoryId}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//               {error && <FormHelperText error>{error}</FormHelperText>}
//             </FormControl>
//           </Grid>

//           <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
//             <FormControl
//               fullWidth
//               error={formik.touched.category2 && Boolean(formik.errors.category2)}
//               disabled={!formik.values.category}
//             >
//               <InputLabel id="category2-label">Second Category (Optional)</InputLabel>
//               <Select
//                 labelId="category2-label"
//                 id="category2"
//                 name="category2"
//                 value={formik.values.category2}
//                 onChange={(e) => handleSubCategoryChange(e.target.value)}
//                 label="Second Category (Optional)"
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {subCategories.map((item) => (
//                   <MenuItem key={item.categoryId} value={item.categoryId}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
//             <FormControl
//               fullWidth
//               error={formik.touched.category3 && Boolean(formik.errors.category3)}
//               disabled={!formik.values.category2}
//             >
//               <InputLabel id="category3-label">Third Category (Optional)</InputLabel>
//               <Select
//                 labelId="category3-label"
//                 id="category3"
//                 name="category3"
//                 value={formik.values.category3}
//                 onChange={(e) => handleChildCategoryChange(e.target.value)}
//                 label="Third Category (Optional)"
//               >
//                 <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem>
//                 {childCategories.map((item) => (
//                   <MenuItem key={item.categoryId} value={item.categoryId}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* Brand, Slug, SKU, etc. */}
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <TextField
//               fullWidth
//               label="Brand"
//               name="brand"
//               value={formik.values.brand}
//               onChange={formik.handleChange}
//               error={formik.touched.brand && Boolean(formik.errors.brand)}
//               helperText={
//                 formik.touched.brand ? (formik.errors.brand as string) : ""
//               }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <TextField
//               fullWidth
//               label="Slug"
//               name="slug"
//               value={formik.values.slug}
//               onChange={formik.handleChange}
//               error={formik.touched.slug && Boolean(formik.errors.slug)}
//               helperText={
//                 formik.touched.slug ? (formik.errors.slug as string) : ""
//               }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6 }}>
//             <TextField
//               fullWidth
//               label="SKU"
//               name="sku"
//               value={formik.values.sku}
//               onChange={formik.handleChange}
//               error={formik.touched.sku && Boolean(formik.errors.sku)}
//               helperText={
//                 formik.touched.sku ? (formik.errors.sku as string) : ""
//               }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               label="HSN Code"
//               name="hsnCode"
//               value={formik.values.hsnCode}
//               onChange={formik.handleChange}
//               error={formik.touched.hsnCode && Boolean(formik.errors.hsnCode)}
//               helperText={
//                 formik.touched.hsnCode ? (formik.errors.hsnCode as string) : ""
//               }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="number"
//               label="GST %"
//               name="gstPercent"
//               value={formik.values.gstPercent}
//               onChange={formik.handleChange}
//               error={formik.touched.gstPercent && Boolean(formik.errors.gstPercent)}
//               helperText={
//                 formik.touched.gstPercent ? (formik.errors.gstPercent as string) : ""
//               }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="number"
//               label="Unit Value"
//               name="unitValue"
//               value={formik.values.unitValue}
//               onChange={formik.handleChange}
//               error={formik.touched.unitValue && Boolean(formik.errors.unitValue)}
//               helperText={
//                 formik.touched.unitValue ? (formik.errors.unitValue as string) : ""
//               }
//               required
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <FormControl fullWidth>
//               <InputLabel>Unit Type</InputLabel>
//               <Select
//                 name="unitType"
//                 value={formik.values.unitType}
//                 onChange={formik.handleChange}
//               >
//                 <MenuItem value="g">Gram</MenuItem>
//                 <MenuItem value="kg">Kg</MenuItem>
//                 <MenuItem value="ml">ML</MenuItem>
//                 <MenuItem value="liter">Liter</MenuItem>
//                 <MenuItem value="piece">Piece</MenuItem>
//                 <MenuItem value="pack">Pack</MenuItem>
//                 <MenuItem value="meter">Meter</MenuItem>
//                 <MenuItem value="cm">CM</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="number"
//               label="Weight"
//               name="weightValue"
//               value={formik.values.weightValue}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <FormControl fullWidth>
//               <InputLabel>Weight Unit</InputLabel>
//               <Select
//                 name="weightUnit"
//                 value={formik.values.weightUnit}
//                 onChange={formik.handleChange}
//               >
//                 <MenuItem value="g">Gram</MenuItem>
//                 <MenuItem value="kg">Kg</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid size={{ xs: 4 }}>
//             <TextField fullWidth label="Length" name="length" value={formik.values.length} onChange={formik.handleChange} />
//           </Grid>
//           <Grid size={{ xs: 4 }}>
//             <TextField fullWidth label="Width" name="width" value={formik.values.width} onChange={formik.handleChange} />
//           </Grid>
//           <Grid size={{ xs: 4 }}>
//             <TextField fullWidth label="Height" name="height" value={formik.values.height} onChange={formik.handleChange} />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="number"
//               label="Shipping Charges"
//               name="shippingCharges"
//               value={formik.values.shippingCharges}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={{ xs: 6 }}>
//             <TextField
//               fullWidth
//               type="number"
//               label="Delivery Days"
//               name="estimatedDeliveryDays"
//               value={formik.values.estimatedDeliveryDays}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               fullWidth
//               label="Meta Title"
//               name="metaTitle"
//               value={formik.values.metaTitle}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               fullWidth
//               multiline
//               rows={2}
//               label="Meta Description"
//               name="metaDescription"
//               value={formik.values.metaDescription}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={{ xs: 12 }}>
//             <TextField
//               fullWidth
//               label="Keywords (comma separated)"
//               name="keywords"
//               value={formik.values.keywords}
//               onChange={formik.handleChange}
//             />
//           </Grid>
//           <Grid size={12}>
//             <Button
//               sx={{ p: "14px" }}
//               color="primary"
//               variant="contained"
//               fullWidth
//               type="submit"
//               disabled={sellerProduct.loading}
//             >
//               {sellerProduct.loading ? (
//                 <CircularProgress size="small" sx={{ width: "27px", height: "27px" }} />
//               ) : mode === "edit" ? (
//                 "Update Product"
//               ) : (
//                 "Add Product"
//               )}
//             </Button>
//           </Grid>
//           {onClose && (
//             <Grid size={12}>
//               <Button onClick={onClose} color="secondary" fullWidth>
//                 Cancel
//               </Button>
//             </Grid>
//           )}
//         </Grid>
//       </form>
//       <Snackbar
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={sellerProduct.error ? "error" : "success"}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {sellerProduct.error
//             ? sellerProduct.error
//             : snackbarMessage || (mode === "edit"
//               ? "Product updated successfully"
//               : "Product created successfully")}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default AddProductForm;
