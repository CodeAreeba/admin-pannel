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

import { getCategoryById, getAllSubCategories } from "../../DAL/fetch";
import { createCategory } from "../../DAL/create";
import { useTable3 } from "../../Components/Models/useTable3";
import { updateCategory } from "../../DAL/edit";
import { deleteSubCategories } from "../../DAL/delete";

const AddCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  // ================= FETCH CATEGORY =================
  const fetchCategory = async () => {
    if (!id) return;
    const res = await getCategoryById(id);
    if (res?.statusCode === 200) {
      const c = res.data;
      setName(c.name);
      setMetaTitle(c.metaTitle || "");
      setMetaDescription(c.metaDescription || "");
      setPublished(c.published);
    }
  };

  // ================= FETCH SUBCATEGORIES =================
  const fetchSubcategories = async () => {
    if (!id) return;
    try {
      const res = await getAllSubCategories(id, 1, 25, searchTerm); // Pass search term
      if (res?.statusCode === 200) {
        setSubcategories(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      setSubcategories([]);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  // Fetch subcategories when search term changes
  useEffect(() => {
    fetchSubcategories();
  }, [id, searchTerm]);

  // ================= HANDLE SEARCH =================
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };
  // ================= HANDLE DELETE =================
  const handleDeleteSubcategories = async ({ ids }) => {
    try {
      const response = await deleteSubCategories({ ids });
      console.log("Delete response:", response); // Debug
      return response;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };
  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        metaTitle,
        metaDescription,
        published,
      };

      const res = id
        ? await updateCategory(id, payload)
        : await createCategory(payload);

      toast.success(res.message || "Category saved");
      navigate("/categories");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBCATEGORY TABLE =================
  const subcategoryAttributes = [
    { id: "name", label: "Name" },
    { id: "metaTitle", label: "Meta Title" },
    { id: "shortDescription", label: "Short Description" },
    { id: "published", label: "Status" },
  ];

  const { tableUI3 } = useTable3({
    attributes3: subcategoryAttributes,
    tableType: "Subcategory",
    data: subcategories,
    reFetch: fetchSubcategories,
    addPath: `/categories/${id}/add-subcategory`,
    viewPath: `/categories/${id}/edit-subcategory/:subId`,
    onSearch: handleSearch, // Add search handler
    deleteFn: handleDeleteSubcategories, 
  });
  return (
    <Box sx={{ p: 3, backgroundColor: "#fff" }}>
      <Typography variant="h4">
        {id ? "Edit Category" : "Add Category"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Name"
          fullWidth
          required
          sx={{ mb: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Meta Title"
          fullWidth
          sx={{ mb: 2 }}
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
        />

        <TextField
          label="Meta Description"
          multiline
          rows={3}
          fullWidth
          sx={{ mb: 2 }}
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

        {id && (
          <>
            <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
              Subcategories
            </Typography>
            {tableUI3}
          </>
        )}

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#B1B1B1" }}
            onClick={() => navigate("/categories")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: "var(--horizontal-gradient)",
              color: "#fff",
              "&:hover": { background: "var(--vertical-gradient)" },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddCategory;
