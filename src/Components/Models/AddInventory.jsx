import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { updateInventoryStatus } from "../../DAL/edit";

const AddInventory = ({ open, setOpen, Modeltype, Modeldata, onResponse }) => {
  // ---------------- State ----------------
  const [inventoryId, setInventoryId] = useState("");
  const [productName, setProductName] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(0);
  const [weight, setWeight] = useState(0);
  const [published, setPublished] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [images, setImages] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- Load Data ----------------
  useEffect(() => {
    if (open && Modeltype === "View" && Modeldata) {
      setInventoryId(Modeldata._id || "");
      setProductName(Modeldata.product?.name || "");
      setColor(Modeldata.color?.name || "");
      setSize(Modeldata.size || "");
      setSku(Modeldata.sku || "");
      setPrice(Modeldata.price || 0);
      setDiscount(Modeldata.discount || 0);
      setFinalPrice(Modeldata.finalPrice || 0);
      setStock(Modeldata.stock || 0);
      setLowStockThreshold(Modeldata.lowStockThreshold || 0);
      setWeight(Modeldata.weight || 0);
      setPublished(Modeldata.published || false);
      setIsDeleted(Modeldata.isDeleted || false);
      setImages(Modeldata.images || []);
      setCreatedAt(Modeldata.createdAt || "");
      setUpdatedAt(Modeldata.updatedAt || "");
    }
  }, [open, Modeltype, Modeldata]);

  // ---------------- Update Inventory ----------------
  const handleUpdateInventory = async () => {
    try {
      setLoading(true);

      const payload = { published };

      const res = await updateInventoryStatus(Modeldata._id, payload);

      if (res?.statusCode === 200) {
        toast.success(res.message || "Inventory updated successfully");
        onResponse();
        handleClose();
      } else {
        toast.error(res.message || "Failed to update inventory");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update inventory");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Handle Close ----------------
  const handleClose = () => {
    setOpen(false);
    setInventoryId("");
    setProductName("");
    setColor("");
    setSize("");
    setSku("");
    setPrice(0);
    setDiscount(0);
    setFinalPrice(0);
    setStock(0);
    setLowStockThreshold(0);
    setWeight(0);
    setPublished(false);
    setIsDeleted(false);
    setImages([]);
    setCreatedAt("");
    setUpdatedAt("");
  };

  // ---------------- UI ----------------
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        View Inventory
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Row 1 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Inventory ID"
            fullWidth
            value={inventoryId}
            disabled
            size="small"
          />
          <TextField
            label="Product Name"
            fullWidth
            value={productName}
            disabled
            size="small"
          />
        </Box>

        {/* Row 2 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="Color" fullWidth value={color} disabled size="small" />
          <TextField label="Size" fullWidth value={size} disabled size="small" />
        </Box>

        {/* Row 3 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="SKU" fullWidth value={sku} disabled size="small" />
          <TextField label="Price" fullWidth value={price} disabled size="small" />
        </Box>

        {/* Row 4 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Discount (%)"
            fullWidth
            value={discount}
            disabled
            size="small"
          />
          <TextField
            label="Final Price"
            fullWidth
            value={finalPrice}
            disabled
            size="small"
          />
        </Box>

        {/* Row 5 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="Stock" fullWidth value={stock} disabled size="small" />
          <TextField
            label="Low Stock Threshold"
            fullWidth
            value={lowStockThreshold}
            disabled
            size="small"
          />
        </Box>

        {/* Row 6 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="Weight (g)" fullWidth value={weight} disabled size="small" />
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={published}
              label="Status"
              onChange={(e) => setPublished(e.target.value)}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Row 7 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Is Deleted"
            fullWidth
            value={isDeleted ? "Yes" : "No"}
            disabled
            size="small"
          />
        </Box>

        {/* Row 8 - Images */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          {images.map((img, index) => (
            <Box
              key={index}
              sx={{ width: 80, height: 80, border: "1px solid #ccc", p: 0.5 }}
            >
              <img
                src={img.url}
                alt={`Inventory-${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
              />
            </Box>
          ))}
        </Box>

        {/* Row 9 - Created / Updated */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Created At"
            fullWidth
            value={createdAt ? new Date(createdAt).toLocaleString() : ""}
            disabled
            size="small"
          />
          <TextField
            label="Updated At"
            fullWidth
            value={updatedAt ? new Date(updatedAt).toLocaleString() : ""}
            disabled
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>

        {Modeltype === "View" && (
          <Button variant="contained" disabled={loading} onClick={handleUpdateInventory}>
            {loading ? "Updating..." : "Update Inventory"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddInventory;
