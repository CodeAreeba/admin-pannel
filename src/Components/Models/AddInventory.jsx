import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { createProduct } from "../../DAL/create";
import { updateProduct } from "../../DAL/edit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

export default function AddProduct({
  open,
  setOpen,
  Modeltype,
  Modeldata,
  onResponse,
}) {
  const [productName, setProductName] = React.useState(Modeldata?.productName || "");
  const [productId, setProductId] = React.useState(Modeldata?.productId || "");
  const [category, setCategory] = React.useState(Modeldata?.category || "");
  const [description, setDescription] = React.useState(Modeldata?.description || "");
  const [status, setStatus] = React.useState(
    typeof Modeldata?.status === "boolean" ? Modeldata.status : true
  );
  const [id, setId] = React.useState(Modeldata?._id || "");
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setProductName(Modeldata?.productName || "");
    setProductId(Modeldata?.productId || "");
    setCategory(Modeldata?.category || "");
    setDescription(Modeldata?.description || "");
    setStatus(typeof Modeldata?.status === "boolean" ? Modeldata.status : true);
    setId(Modeldata?._id || "");
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      productName,
      productId,
      category,
      description,
      status,
    };

    try {
      let response;
      if (Modeltype === "Add") {
        response = await createProduct(productData);
      } else {
        response = await updateProduct(id, productData);
      }

      if (response?.status === 201 || response?.status === 200) {
        onResponse({ messageType: "success", message: response.message });

        setProductName("");
        setProductId("");
        setCategory("");
        setDescription("");
        setStatus(true);
        setErrors({});
        setId("");

        setOpen(false);
      } else if (response?.status === 400 && response?.missingFields) {
        const fieldErrors = {};
        response.missingFields.forEach((f) => {
          fieldErrors[f.name] = f.message;
        });
        setErrors(fieldErrors);
      } else {
        onResponse({ messageType: "error", message: response?.message });
      }
    } catch (err) {
      onResponse({
        messageType: "error",
        message: err.response?.data?.message || "Server error",
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6">
          {Modeltype} Product
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              error={!!errors.productName}
              helperText={errors.productName}
            />
            <TextField
              fullWidth
              label="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              error={!!errors.productId}
              helperText={errors.productId}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              error={!!errors.category}
              helperText={errors.category}
            />

            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
              <FormHelperText>{errors.status}</FormHelperText>
            </FormControl>
          </Box>

          <Box mt={2}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Box>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "var(--horizontal-gradient)",
                "&:hover": { background: "var(--vertical-gradient)" },
              }}
            >
              {id ? "Update Product" : "Add Product"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
