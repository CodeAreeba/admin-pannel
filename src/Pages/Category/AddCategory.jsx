import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { toast } from "react-toastify";

import { useTable3 } from "../../Components/Models/useTable3";
import { getCategoryById } from "../../DAL/fetch";
import { updateCategory } from "../../DAL/edit";
import { createCategory } from "../../DAL/create";

const AddCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  const [subcategories, setSubcategories] = useState({
    published: true,
    items: [],
  });

  /* ---------------- FETCH CATEGORY (EDIT) ---------------- */
  const fetchCategory = async () => {
    if (!id) return;

    try {
      const res = await getCategoryById(id);
      if (res?.statusCode === 200) {
        const c = res.data;
        setName(c.name || "");
        setMetaTitle(c.metaTitle || "");
        setMetaDescription(c.metaDescription || "");
        setPublished(c.published ?? true);
        setSubcategories(c.subcategories || { published: true, items: [] });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load category");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        metaTitle,
        metaDescription,
        published,
        subcategories,
      };

      const res = id
        ? await updateCategory(id, payload)
        : await createCategory(payload);

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success(res.message || "Saved successfully");
        navigate("/categories");
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SUBCATEGORY TABLE ---------------- */
  const subcategoryAttributes = [
    { id: "name", label: "Name" },
    { id: "metaTitle", label: "Meta Title" },
    { id: "shortDescription", label: "Short Description" },
    { id: "published", label: "Visibility" },
  ];

  const { tableUI3 } = useTable3({
    attributes3: subcategoryAttributes,
    tableType: "Subcategories",
    data: subcategories.items,
    reFetch: fetchCategory,
    addPath: `/categories/${id}/add-subcategory`,
    viewPath: `/categories/${id}/edit-subcategory/:subId`,
  });

  /* ---------------- UI ---------------- */
  return (
    <Box sx={{ p: 3, backgroundColor: "var(--white-color)" }}>
      <Typography variant="h4">
        {id ? "Edit Category" : "Add Category"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, display: "grid", gap: 2 }}
      >
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Meta Title"
          fullWidth
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
        />

        <TextField
          label="Meta Description"
          multiline
          rows={2}
          fullWidth
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />

        <FormControlLabel
          control={
            <Switch
              checked={published}
              onChange={() => setPublished(!published)}
            />
          }
          label={published ? "Published" : "Draft"}
        />

        <Typography variant="h5" sx={{ mt: 3 }}>
          Subcategories
        </Typography>

        {tableUI3}

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            onClick={() => navigate("/categories")}
            sx={{
              padding: "8px 28px",
              textTransform: "none",
              borderColor: "var(--primary-color)",
              backgroundColor: "var(--grey-color)",
              color: "black",
              transition: "0.3s ease",
              "&:hover": {
                color: "var(--primary-color)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              padding: "8px 28px",
              textTransform: "none",
              borderColor: "var(--primary-color)",
              backgroundColor: "var(--primary-color)",
              color: "var(--white-color)",
              "&:hover": {
                backgroundColor: "var(--primary-color)",
                color: "var(--white-color)",
              },
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddCategory;
