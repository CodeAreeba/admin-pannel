import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";

import {
  getProductById,
  getAllCategories,
  getAllSubCategories,
  getAllProductVariants,
} from "../../DAL/fetch";
import { createProduct } from "../../DAL/create";
import { updateProduct } from "../../DAL/edit";
import { deleteVariants } from "../../DAL/delete";
import { useTable3 } from "../../Components/Models/useTable3";
import UploadFile from "../../Components/UploadFile";
import AuthContext from "../../auth/AuthContext";
import {
  UPDATE_PERMISSION_BY_TABLE,
  CREATE_PERMISSION_BY_TABLE,
  VIEW_PERMISSION_BY_TABLE,
} from "../../Config/Permission";

const AddProduct = () => {
  const { id } = useParams(); // productId for edit
  const navigate = useNavigate();
  const { can } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [description, setDescription] = useState("");
  const [baseSku, setBaseSku] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(true);

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Check permissions
  const canView = can(VIEW_PERMISSION_BY_TABLE.Products);
  const canUpdate = can(UPDATE_PERMISSION_BY_TABLE.Products);
  const canCreate = can(CREATE_PERMISSION_BY_TABLE.Products);

  // Agar view permission nahi hai tou redirect kar do
  useEffect(() => {
    if (id && !canView) {
      toast.error("You don't have permission to view this product");
      navigate("/products");
    }
  }, [id, canView, navigate]);

  // Determine if save button should be disabled
  const isSaveDisabled = id ? !canUpdate : !canCreate;

  // Determine if fields should be read-only (view mode)
  const isReadOnly = id && !canUpdate;

  /////////////////// Fetch Categories //////////////////////
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      if (res?.statusCode === 200) setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]);
    }
  };

  /////////////////// Fetch Subcategories //////////////////////
  const fetchSubcategories = async () => {
    if (!categoryId) return;
    try {
      const res = await getAllSubCategories(categoryId);
      if (res?.statusCode === 200) setSubcategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
      setSubcategories([]);
    }
  };

  /////////////////// Fetch Product for edit //////////////////////
  const fetchProduct = async () => {
    if (!id) return;
    try {
      const res = await getProductById(id);
      if (res?.statusCode === 200) {
        const p = res.data;
        setName(p.name);
        setMetaDescription(p.metaDescription || "");
        setDescription(p.description);
        setBaseSku(p.baseSku);
        setTags(p.tags || []);
        setImage(p.image || "");
        setPublished(p.published ?? true);
        setCategoryId(p.subcategory?.category?._id || "");
        setSubcategoryId(p.subcategory?._id || "");
      }
    } catch (err) {
      console.error("Failed to fetch product", err);
    }
  };

  /////////////////// Fetch Variants //////////////////////
  const fetchVariants = async () => {
    if (!id) return;
    try {
      const res = await getAllProductVariants(id, 1, 25, searchTerm);
      if (res?.statusCode === 200) {
        setVariants(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch variants:", err);
      setVariants([]);
    }
  };

  /////////////////// Handle Search //////////////////////
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchVariants();
    }, 500);

    return () => clearTimeout(handler);
  }, [id, searchTerm]);

  const handleSearch = (val) => setSearchTerm(val);

  /////////////////// Handle Delete Variants //////////////////////
  const handleDeleteVariants = async ({ ids }) => {
    try {
      const response = await deleteVariants({ ids });
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /////////////////// Handle Submit //////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Permission check before submission
    if (id && !canUpdate) {
      toast.error("You don't have permission to update this product");
      return;
    }
    if (!id && !canCreate) {
      toast.error("You don't have permission to create products");
      return;
    }

    if (
      !name.trim() ||
      !description.trim() ||
      !baseSku.trim() ||
      !subcategoryId
    ) {
      return toast.warning("Please fill required fields");
    }

    setLoading(true);
    const payload = {
      name,
      metaDescription,
      description,
      baseSku,
      tags,
      image,
      published,
      subcategoryId,
    };

    try {
      const res = id
        ? await updateProduct(id, payload)
        : await createProduct(payload);
      toast.success(res.message || "Product saved successfully");
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /////////////////// Variants Table config //////////////////////
  const variantAttributes = [
    { id: "sku", label: "SKU" },
    { id: "color.name", label: "Color" },
    { id: "size", label: "Size" },
    { id: "finalPrice.PKR", label: "Final Price" },
    { id: "stock", label: "Stock" },
    { id: "published", label: "Status" },
  ];

  const { tableUI3 } = useTable3({
    attributes3: variantAttributes,
    tableType: "Variants",
    data: variants,
    reFetch: fetchVariants,
    addPath: `/products/${id}/add-variant`,
    viewPath: `/products/${id}/edit-variant/:subId`,
    onSearch: handleSearch,
    deleteFn: handleDeleteVariants,
    navigationState: { baseSku },
  });

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (categoryId) fetchSubcategories();
  }, [categoryId]);

  const generateBaseSku = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
    return words
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#fff" }}>
      <Typography variant="h4">
        {id ? (isReadOnly ? "View Product" : "Edit Product") : "Add Product"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Name"
          fullWidth
          required
          sx={{ mb: 2 }}
          value={name}
          onChange={(e) => {
            if (!isReadOnly) {
              setName(e.target.value);
              setBaseSku(generateBaseSku(e.target.value));
            }
          }}
          InputProps={{ readOnly: isReadOnly }}
          disabled={isReadOnly}
        />

        <TextField
          label="Meta Description"
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
          value={metaDescription}
          onChange={(e) => !isReadOnly && setMetaDescription(e.target.value)}
          InputProps={{ readOnly: isReadOnly }}
          disabled={isReadOnly}
        />

        <TextField
          label="Description"
          fullWidth
          required
          multiline
          rows={4}
          sx={{ mb: 2 }}
          value={description}
          onChange={(e) => !isReadOnly && setDescription(e.target.value)}
          InputProps={{ readOnly: isReadOnly }}
          disabled={isReadOnly}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 2 }}>
          <TextField
            label="Base SKU"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={baseSku}
            InputProps={{ readOnly: true }}
            disabled
          />

          <TextField
            label="Tags (comma separated)"
            fullWidth
            value={tags.join(",")}
            onChange={(e) =>
              !isReadOnly &&
              setTags(e.target.value.split(",").map((t) => t.trim()))
            }
            InputProps={{ readOnly: isReadOnly }}
            disabled={isReadOnly}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 4 }}>
          <TextField
            select
            label="Category"
            fullWidth
            required
            value={categoryId}
            onChange={(e) => !isReadOnly && setCategoryId(e.target.value)}
            disabled={isReadOnly}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Subcategory"
            fullWidth
            required
            value={subcategoryId}
            onChange={(e) => !isReadOnly && setSubcategoryId(e.target.value)}
            disabled={isReadOnly}
          >
            {subcategories.map((sub) => (
              <MenuItem key={sub._id} value={sub._id}>
                {sub.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Typography variant="h6" mt={1} mb={1}>
          Upload Image
        </Typography>
        <UploadFile
          multiple={false}
          accept="image/*"
          initialFile={image}
          onUploadComplete={(path) => !isReadOnly && setImage(path)}
          disabled={isReadOnly}
        />

        {id && (
          <>
            <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
              Variants
            </Typography>
            {tableUI3}
          </>
        )}

        {/* /////////////////// footer ////////////////////// */}
        <Paper
          sx={{
            mt: 3,
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
              onClick={() => navigate("/products")}
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
                {id ? "Update" : "Save"}
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddProduct;