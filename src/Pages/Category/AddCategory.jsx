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
import { getCategoryById, getAllSubCategories } from "../../DAL/fetch";
import { updateCategory } from "../../DAL/edit";
import { createCategory } from "../../DAL/create";
import AddSubcategoryModal from "./AddSubcategory";

const AddCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ---------------- CATEGORY STATE ---------------- */
  const [name, setName] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ---------------- SUBCATEGORY STATE ---------------- */
  const [subcategories, setSubcategories] = useState({
    published: true,
    items: [],
  });

  /* ---------------- MODAL STATE ---------------- */
  const [openModal, setOpenModal] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  /* ---------------- FETCH CATEGORY (EDIT MODE) ---------------- */
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
      }
    } catch (err) {
      toast.error("Failed to load category");
    }
  };

  /* ---------------- FETCH SUBCATEGORIES ---------------- */
  const fetchSubcategories = async () => {
    if (!id) return;

    try {
      const res = await getAllSubCategories(id);
      if (res?.statusCode === 200) {
        setSubcategories({
          published: true,
          items: res.data || [],
        });
      }
    } catch (err) {
      toast.error("Failed to fetch subcategories");
    }
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (id) {
      fetchCategory();
      fetchSubcategories();
    }
  }, [id]);

  /* ---------------- SAVE CATEGORY ---------------- */
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

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success(res.message || "Saved successfully");
        navigate("/categories");
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MODAL HANDLERS ---------------- */
  const handleAddSubcategory = () => {
    setSelectedSubcategoryId(null);
    setOpenModal(true);
  };

  const handleEditSubcategory = (subId) => {
    setSelectedSubcategoryId(subId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSubcategoryId(null);
  };

  const handleModalSuccess = () => {
    fetchSubcategories();
  };

  /* ---------------- TABLE ---------------- */
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
    reFetch: fetchSubcategories,
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

        {/* ---------------- SUBCATEGORY TABLE (EDIT MODE ONLY) ---------------- */}
        {id && (
          <Box
            sx={{ mt: 3 }}
            onClick={(e) => {
              const target = e.target;

              // Add Subcategory
              if (
                target.closest("button") &&
                target.textContent?.toLowerCase().includes("add")
              ) {
                e.preventDefault();
                e.stopPropagation();
                handleAddSubcategory();
                return;
              }

              // Edit Subcategory
              if (target.textContent === "View") {
                const row = target.closest("tr");
                const index = [...row.parentNode.children].indexOf(row);
                const sub = subcategories.items[index];
                if (sub?._id) handleEditSubcategory(sub._id);
              }
            }}
          >
            <Typography variant="h5">Subcategories</Typography>
            {tableUI3}
          </Box>
        )}

        {/* ---------------- ACTION BUTTONS ---------------- */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            onClick={() => navigate("/categories")}
            sx={{
              padding: "8px 28px",
              textTransform: "none",
              backgroundColor: "var(--grey-color)",
              color: "black",
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
              backgroundColor: "var(--primary-color)",
              color: "var(--white-color)",
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>

      {/* ---------------- SUBCATEGORY MODAL ---------------- */}
      {id && (
        <AddSubcategoryModal
          open={openModal}
          onClose={handleCloseModal}
          subcategoryId={selectedSubcategoryId}
          categoryId={id}
          onSuccess={handleModalSuccess}
        />
      )}
    </Box>
  );
};

export default AddCategory;
