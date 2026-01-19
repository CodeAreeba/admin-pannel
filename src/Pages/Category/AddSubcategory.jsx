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

import { getSubCategoryById } from "../../DAL/fetch";
import { createSubCategory } from "../../DAL/create";
import { updateSubCategory } from "../../DAL/edit";

const AddSubCategory = () => {
  const { id: categoryId, subId } = useParams(); // id = categoryId
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  // ================= FETCH SUBCATEGORY =================
  const fetchSubCategory = async () => {
    if (!subId) return;
    try {
      const res = await getSubCategoryById(subId);
      if (res?.statusCode === 200) {
        const s = res.data;
        setName(s.name);
        setMetaTitle(s.metaTitle || "");
        setShortDescription(s.shortDescription || "");
        setPublished(s.published ?? true);
      } else {
        toast.error(res.message || "Failed to fetch subcategory");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching subcategory");
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, [subId]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.warning("Name is required");
    setLoading(true);

    const payload = {
      name,
      metaTitle,
      shortDescription,
      published,
      categoryId,
    };

    try {
      const res = subId
        ? await updateSubCategory(subId, payload)
        : await createSubCategory(payload);

      if (res?.statusCode === 200) {
        toast.success(res.message || "Subcategory saved successfully");
        navigate(`/categories/${categoryId}/edit`);
      } else {
        toast.error(res.message || "Failed to save subcategory");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 , backgroundColor:"#fff"}}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {subId ? "Edit Subcategory" : "Add Subcategory"}
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
          label="Short Description"
          multiline
          rows={3}
          fullWidth
          sx={{ mb: 2 }}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
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
            onClick={() => navigate(-1)}
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
            {subId ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddSubCategory;
