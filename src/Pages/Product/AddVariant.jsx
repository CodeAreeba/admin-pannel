import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  FormControlLabel,
  Switch,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";

import { getVariantById } from "../../DAL/fetch";
import { updateVariant } from "../../DAL/edit";
import { createVariant } from "../../DAL/create";
import VariantImageGallery from "../../Components/VariantImageGallery";
import AuthContext from "../../auth/AuthContext";
import {
  UPDATE_PERMISSION_BY_TABLE,
  CREATE_PERMISSION_BY_TABLE,
  VIEW_PERMISSION_BY_TABLE,
} from "../../Config/Permission";

const AVAILABLE_SIZES = [38, 39, 40, 41, 42, 43, 44, 45];

const AddVariant = () => {
  const { id: productId, variantId } = useParams();
  const location = useLocation();
  const baseSku = location.state?.baseSku || "";
  const navigate = useNavigate();
  const { can } = useContext(AuthContext);

  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [sizes, setSizes] = useState([]);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [weight, setWeight] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([null, null, null, null]);

  // Permission checks
  const canView = can(VIEW_PERMISSION_BY_TABLE.Variants);
  const canUpdate = can(UPDATE_PERMISSION_BY_TABLE.Variants);
  const canCreate = can(CREATE_PERMISSION_BY_TABLE.Variants);

  // Agar view permission nahi hai tou redirect kar do
  useEffect(() => {
    if (variantId && !canView) {
      toast.error("You don't have permission to view this variant");
      navigate(`/products/${productId}/edit`);
    }
  }, [variantId, canView, navigate, productId]);

  const isSaveDisabled = variantId ? !canUpdate : !canCreate;
  const isReadOnly = variantId && !canUpdate;

  // Fetch variant
  const fetchVariant = async () => {
    if (!variantId) return;
    try {
      const res = await getVariantById(variantId);
      if (res?.statusCode === 200) {
        const v = res.data;
        setColorName(v.color?.name || "");
        setColorCode(v.color?.code || "");
        setColorHex(v.color?.hex || "#000000");
        setSizes([v.size]);
        setPrice(v.price.PKR || "");
        setDiscount(v.discount || 0);
        setStock(v.stock || "");
        setSku(v.sku || "");
        setWeight(v.weight || "");
        setPublished(v.published ?? true);
        const imgs = [null, null, null, null];
        v.images?.forEach((img, i) => {
          if (i < 4) imgs[i] = img;
        });
        setImages(imgs);
      }
    } catch {
      toast.error("Failed to fetch variant");
    }
  };

  useEffect(() => {
    fetchVariant();
  }, [variantId]);

  const calculatedFinalPrice =
    price && discount
      ? Math.round(price - (price * discount) / 100)
      : price || "";

  const generateVariantSku = (size) => {
    if (!baseSku || !colorCode || !size) return "";
    return `${baseSku.toUpperCase()}-${colorCode.toUpperCase()}-${size}`;
  };

  const toggleSize = (size) => {
    if (isReadOnly) return;
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  // Validate hex color
  const isValidHex = (hex) => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  // Handle hex input change
  const handleColorHexChange = (value) => {
    if (isReadOnly) return;
    
    // Ensure it starts with #
    let newValue = value;
    if (!newValue.startsWith("#")) {
      newValue = "#" + newValue;
    }
    
    // Limit to 7 characters (#RRGGBB)
    newValue = newValue.slice(0, 7).toUpperCase();
    
    setColorHex(newValue);
  };

  // Auto-update SKU when baseSku, colorCode, or sizes change (only for create mode)
  useEffect(() => {
    if (!variantId && sizes.length > 0 && baseSku && colorCode) {
      setSku(generateVariantSku(sizes[0]));
    }
  }, [baseSku, colorCode, sizes, variantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Permission check before submission
    if (variantId && !canUpdate) {
      toast.error("You don't have permission to update this variant");
      return;
    }
    if (!variantId && !canCreate) {
      toast.error("You don't have permission to create variants");
      return;
    }

    if (!colorName || !colorCode || !colorHex || sizes.length === 0 || !price || !stock)
      return toast.warning("Please fill all required fields");

    if (!isValidHex(colorHex)) {
      return toast.warning("Please enter a valid hex color code (e.g., #FF5733)");
    }

    setLoading(true);
    try {
      if (variantId) {
        await updateVariant(variantId, {
          productId,
          color: { 
            name: colorName, 
            code: colorCode.toUpperCase(),
            hex: colorHex.toUpperCase()
          },
          price: Number(price),
          discount: Number(discount),
          finalPrice: calculatedFinalPrice,
          stock: Number(stock),
          sku: sku.toUpperCase(),
          weight: Number(weight),
          published,
          images: images
            .filter(Boolean)
            .map((img) => ({ url: img.url, isPrimary: img.isPrimary })),
        });
        toast.success("Variant updated successfully");
      } else {
        for (let size of sizes) {
          await createVariant({
            productId,
            color: { 
              name: colorName, 
              code: colorCode.toUpperCase(),
              hex: colorHex.toUpperCase()
            },
            size,
            price: Number(price),
            discount: Number(discount),
            finalPrice: calculatedFinalPrice,
            stock: Number(stock),
            sku: generateVariantSku(size),
            weight: Number(weight),
            published,
            images: images
              .filter(Boolean)
              .map((img) => ({ url: img.url, isPrimary: img.isPrimary })),
          });
        }
        toast.success("Variants created successfully");
      }
      navigate(`/products/${productId}/edit`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Box sx={{ flex: "0 0 55%" }}>
          <Paper sx={{ p: 3, mb: 3, boxShadow: "none" }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {isReadOnly ? "View Variant" : "Variant Information"}
            </Typography>

            <TextField
              label="Color Name"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={colorName}
              onChange={(e) => !isReadOnly && setColorName(e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
              disabled={isReadOnly}
              placeholder="e.g., Midnight Blue, Crimson Red"
            />

            <TextField
              label="Color Code (for SKU)"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={colorCode}
              onChange={(e) => !isReadOnly && setColorCode(e.target.value.toUpperCase())}
              InputProps={{ readOnly: isReadOnly }}
              disabled={isReadOnly}
              placeholder="e.g., BRN, BLK, WHT"
              helperText="Short code used in SKU generation (e.g., BRN for Brown)"
            />

            <TextField
              label="Color Hex Code"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={colorHex}
              onChange={(e) => handleColorHexChange(e.target.value)}
              InputProps={{
                readOnly: isReadOnly,
                startAdornment: (
                  <InputAdornment position="start">
                    <input
                      type="color"
                      value={isValidHex(colorHex) ? colorHex : "#000000"}
                      onChange={(e) => !isReadOnly && setColorHex(e.target.value.toUpperCase())}
                      disabled={isReadOnly}
                      style={{
                        width: "32px",
                        height: "32px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: isReadOnly ? "not-allowed" : "pointer",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              disabled={isReadOnly}
              placeholder="#000000"
              helperText={
                !isValidHex(colorHex) && colorHex.length === 7
                  ? "Invalid hex format (use #RRGGBB)"
                  : "Format: #RRGGBB (e.g., #FF5733)"
              }
              error={!isValidHex(colorHex) && colorHex.length === 7}
            />

            <Typography sx={{ mb: 1, fontWeight: 600 }}>
              Select Sizes
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
              {AVAILABLE_SIZES.map((size) => {
                const active = sizes.includes(size);
                return (
                  <Box
                    key={size}
                    onClick={() => toggleSize(size)}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: active ? "var(--primary-color)" : "#ccc",
                      backgroundColor: active ? "var(--primary-color)" : "#fff",
                      color: active ? "#fff" : "#000",
                      cursor: isReadOnly ? "not-allowed" : "pointer",
                      userSelect: "none",
                      opacity: isReadOnly ? 0.6 : 1,
                    }}
                  >
                    {size}
                  </Box>
                );
              })}
            </Box>

            <TextField
              label="Weight (grams)"
              fullWidth
              sx={{ mb: 2 }}
              value={weight}
              onChange={(e) => !isReadOnly && setWeight(e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
              disabled={isReadOnly}
            />

            <TextField
              label="SKU (auto-generated)"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={sku}
              InputProps={{ readOnly: true }}
              disabled
              helperText={
                !variantId && sizes.length > 1
                  ? `${sizes.length} SKUs will be generated (one per size)`
                  : ""
              }
            />
          </Paper>

          <Paper sx={{ p: 3, boxShadow: "none" }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Pricing & Stock
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Base Price"
                fullWidth
                required
                value={price}
                onChange={(e) => !isReadOnly && setPrice(e.target.value)}
                InputProps={{ readOnly: isReadOnly }}
                disabled={isReadOnly}
              />
              <TextField
                label="Stock"
                fullWidth
                required
                value={stock}
                onChange={(e) => !isReadOnly && setStock(e.target.value)}
                InputProps={{ readOnly: isReadOnly }}
                disabled={isReadOnly}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Discount (%)"
                fullWidth
                value={discount}
                onChange={(e) => !isReadOnly && setDiscount(e.target.value)}
                InputProps={{ readOnly: isReadOnly }}
                disabled={isReadOnly}
              />
              <TextField
                label="Final Price"
                fullWidth
                value={calculatedFinalPrice}
                InputProps={{ readOnly: true }}
                disabled
              />
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: "0 0 43%" }}>
          <Paper sx={{ p: 3, boxShadow: "none" }}>
            <VariantImageGallery
              images={images}
              setImages={setImages}
              disabled={isReadOnly}
            />
          </Paper>

          <Paper
            sx={{
              mt: 6,
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 0,
              boxShadow: "none",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={published}
                  onChange={() => !isReadOnly && setPublished(!published)}
                  disabled={isReadOnly}
                />
              }
              label={published ? "Published" : "Draft"}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#B1B1B1" }}
                onClick={() => navigate(-1)}
              >
                {isReadOnly ? "Back" : "Cancel"}
              </Button>
              {!isReadOnly && (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || isSaveDisabled}
                  sx={{
                    background: isSaveDisabled
                      ? "#e0e0e0"
                      : "var(--horizontal-gradient)",
                    color: isSaveDisabled ? "#999" : "#fff",
                    cursor: isSaveDisabled ? "not-allowed" : "pointer",
                    "&:hover": {
                      background: isSaveDisabled
                        ? "#e0e0e0"
                        : "var(--vertical-gradient)",
                    },
                  }}
                >
                  {variantId ? "Update" : "Save"}
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AddVariant;