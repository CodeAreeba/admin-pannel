import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { getSubcategoryById } from "../../DAL/fetch";
import { updateSubcategory } from "../../DAL/edit";
import { createSubcategory } from "../../DAL/create";

const AddSubcategoryModal = ({ open, onClose, subcategoryId, categoryId, onSuccess }) => {
  const [name, setName] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH SUBCATEGORY (EDIT MODE) ---------------- */
  const fetchSubcategory = async () => {
    if (!subcategoryId) return;

    try {
      const res = await getSubcategoryById(subcategoryId);
      if (res?.statusCode === 200) {
        const sub = res.data;
        setName(sub.name || "");
        setMetaTitle(sub.metaTitle || "");
        setShortDescription(sub.shortDescription || "");
        setPublished(sub.published ?? true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subcategory");
    }
  };

  useEffect(() => {
    if (open && subcategoryId) {
      fetchSubcategory();
    } else if (open && !subcategoryId) {
      // Reset form for add mode
      setName("");
      setMetaTitle("");
      setShortDescription("");
      setPublished(true);
    }
  }, [open, subcategoryId]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("Name is required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        categoryId: categoryId,
        name,
        metaTitle,
        shortDescription,
        published,
      };

      const res = subcategoryId
        ? await updateSubcategory(subcategoryId, payload)
        : await createSubcategory(payload);

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success(res.message || "Subcategory saved successfully");
        onSuccess && onSuccess(); // Refresh category data
        onClose(); // Close modal
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

  /* ---------------- UI ---------------- */
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        }
      }}
    >
      <DialogTitle sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid #e0e0e0",
        pb: 2
      }}>
        {subcategoryId ? "Edit Subcategory" : "Add Subcategory"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <form onSubmit={handleSubmit} id="subcategory-form">
          <TextField
            label="Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Meta Title"
            fullWidth
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Short Description"
            multiline
            rows={3}
            fullWidth
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            sx={{ mb: 2 }}
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
        </form>
      </DialogContent>

      <DialogActions sx={{ 
        borderTop: "1px solid #e0e0e0", 
        pt: 2, 
        px: 3, 
        pb: 2 
      }}>
        <Button
          onClick={onClose}
          sx={{
            padding: "8px 24px",
            textTransform: "none",
            color: "black",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="subcategory-form"
          variant="contained"
          disabled={loading}
          sx={{
            padding: "8px 24px",
            textTransform: "none",
            backgroundColor: "var(--primary-color)",
            color: "var(--white-color)",
            "&:hover": {
              backgroundColor: "var(--primary-color)",
            },
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubcategoryModal;