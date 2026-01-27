import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { restockInventory } from "../../DAL/edit";
import { getAllInventory } from "../../DAL/fetch";
import { useNavigate, useParams } from "react-router-dom";
import { fileUrl } from "../../Config/Config";

const InventoryViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setFetchLoading(true);
        
        const response = await getAllInventory(1, 1000, "");
        const inventoryItem = response?.data?.find(item => item._id === id);

        if (inventoryItem) {
          setInventoryId(inventoryItem._id || "");
          setProductName(inventoryItem.product?.name || "");
          setColor(inventoryItem.color?.name || "");
          setSize(inventoryItem.size || "");
          setSku(inventoryItem.sku || "");
          setPrice(inventoryItem.price || 0);
          setDiscount(inventoryItem.discount || 0);
          setFinalPrice(inventoryItem.finalPrice || 0);
          setStock(inventoryItem.stock || 0);
          setLowStockThreshold(inventoryItem.lowStockThreshold || 0);
          setWeight(inventoryItem.weight || 0);
          setPublished(inventoryItem.published || false);
          setIsDeleted(inventoryItem.isDeleted || false);
          setImages(inventoryItem.images || []);
          setCreatedAt(inventoryItem.createdAt || "");
          setUpdatedAt(inventoryItem.updatedAt || "");
        } else {
          toast.error("Inventory not found");
          navigate("/inventory");
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
        toast.error("Failed to load inventory data");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchInventoryData();
    }
  }, [id, navigate]);

const handleUpdateInventory = async () => {
  if (!inventoryId) {
    toast.error("Inventory ID is missing. Cannot update inventory.");
    return;
  }

  // Convert to number safely
  const quantityNumber = parseInt(stock, 10);

  if (isNaN(quantityNumber) || quantityNumber < 0) {
    toast.error("Please enter a valid stock number");
    return;
  }

  const payload = {
    variantId: inventoryId,
    quantity: quantityNumber,
  };

  try {
    setLoading(true);
    const res = await restockInventory(payload);

    if (res?.statusCode === 200 || res?.status === "success") {
      toast.success(res.message || "Inventory updated successfully");
      navigate("/inventory");
    } else {
      toast.error(res.message || "Failed to update inventory");
      console.error("PATCH response error:", res);
    }
  } catch (err) {
    console.error("PATCH request failed:", err);
    toast.error("Failed to update inventory");
  } finally {
    setLoading(false);
  }
};


  const handleBack = () => {
    navigate("/inventory");
  };

  if (fetchLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={50} sx={{ color: "var(--primary-color)" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#fff" }}>
      <Typography variant="h4">View Inventory Details</Typography>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {/* <TextField
            label="Inventory ID"
            fullWidth
            required
            value={inventoryId}
            disabled
          /> */}
          <TextField
            label="Product Name"
            fullWidth
            required
            value={productName}
            disabled
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Color"
            fullWidth
            value={color}
            disabled
          />
          <TextField
            label="Size"
            fullWidth
            value={size}
            disabled
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="SKU"
            fullWidth
            value={sku}
            disabled
          />
          <TextField
            label="Price"
            fullWidth
            value={price}
            disabled
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Discount (%)"
            fullWidth
            value={discount}
            disabled
          />
          <TextField
            label="Final Price"
            fullWidth
            value={finalPrice}
            disabled
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Stock"
            fullWidth
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
          />
          <TextField
            label="Low Stock Threshold"
            fullWidth
            value={lowStockThreshold}
            disabled
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Weight (g)"
            fullWidth
            value={weight}
            disabled
          />
          <TextField
            label="Status"
            fullWidth
            value={published ? "Active" : "Inactive"}
            disabled
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Created At"
            fullWidth
            value={createdAt ? new Date(createdAt).toLocaleString() : ""}
            disabled
          />
          <TextField
            label="Updated At"
            fullWidth
            value={updatedAt ? new Date(updatedAt).toLocaleString() : ""}
            disabled
          />
        </Box>

        <Typography variant="h6" mt={2} mb={1}>
          Product Images
        </Typography>
        {images && images.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
            {images.map((img, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={fileUrl + img.url}
                  alt={`Product ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {img.isPrimary && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "var(--primary-color)",
                      color: "white",
                      textAlign: "center",
                      py: 0.3,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                    }}
                  >
                    Primary
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No images available
          </Typography>
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
            onClick={handleBack}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleUpdateInventory}
            sx={{
              background: "var(--horizontal-gradient)",
              color: "#fff",
              "&:hover": {
                background: "var(--vertical-gradient)",
              },
            }}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InventoryViewPage;