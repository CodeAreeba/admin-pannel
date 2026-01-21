import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";

import { getCategoryById, getAllSubCategories } from "../../DAL/fetch";
import { createCategory } from "../../DAL/create";
import { useTable3 } from "../../Components/Models/useTable3";
import { updateCategory } from "../../DAL/edit";
import { deleteSubCategories } from "../../DAL/delete";
import AuthContext from "../../auth/AuthContext";
import {
  UPDATE_PERMISSION_BY_TABLE,
  CREATE_PERMISSION_BY_TABLE,
} from "../../Config/Permission";
import UploadFile from "../../Components/UploadFile";

const AddCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  // Check permissions
  const canUpdate = can(UPDATE_PERMISSION_BY_TABLE.Categories);
  const canCreate = can(CREATE_PERMISSION_BY_TABLE.Categories);

  // Determine if save button should be disabled
  const isSaveDisabled = id ? !canUpdate : !canCreate;

  /////////////////// Fetc Category //////////////////////
  const fetchCategory = async () => {
    if (!id) return;
    const res = await getCategoryById(id);
    if (res?.statusCode === 200) {
      const c = res.data;
      setName(c.name);
      setMetaTitle(c.metaTitle || "");
      setMetaDescription(c.metaDescription || "");
      setImage(c.image || "");
      setPublished(c.published);
    }
  };

  /////////////////// Fetch Subcategories //////////////////////
  const fetchSubcategories = async () => {
    if (!id) return;
    try {
      const res = await getAllSubCategories(id, 1, 25, searchTerm);
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

  useEffect(() => {
    fetchSubcategories();
  }, [id, searchTerm]);

  /////////////////// Handle Search //////////////////////
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  /////////////////// Handle Delete Subcaetgories //////////////////////
  const handleDeleteSubcategories = async ({ ids }) => {
    try {
      const response = await deleteSubCategories({ ids });
      console.log("Delete response:", response);
      return response;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  /////////////////// Handle Submit //////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Permission check on submit
    if (isSaveDisabled) {
      toast.warning("You don't have permission to perform this action");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        metaTitle,
        metaDescription,
        image,
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

  /////////////////// subcategories table config //////////////////////
  const subcategoryAttributes = [
    { id: "image", label: "Image" },
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
    onSearch: handleSearch,
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
          disabled={isSaveDisabled}
        />

        <TextField
          label="Meta Title"
          fullWidth
          sx={{ mb: 2 }}
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          disabled={isSaveDisabled}
        />

        <TextField
          label="Meta Description"
          multiline
          rows={3}
          fullWidth
          sx={{ mb: 2 }}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          disabled={isSaveDisabled}
        />
        <Typography variant="h6" mt={1} mb={1}>
          Upload Image
        </Typography>
        <UploadFile
          multiple={false}
          accept="image/*"
          initialFile={image}
          onUploadComplete={(path) => setImage(path)}
          disabled={isSaveDisabled}
        />

        {id && (
          <>
            <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
              Subcategories
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
                onChange={() => setPublished(!published)}
                disabled={isSaveDisabled}
              />
            }
            label={published ? "Published" : "Draft"}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
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
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddCategory;
