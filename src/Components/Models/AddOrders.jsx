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
import { updateOrderStatus } from "../../DAL/edit";

const AddOrder = ({ open, setOpen, Modeltype, Modeldata, onResponse }) => {
  // ---------------- State ----------------
  const [orderId, setOrderId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- Load Data ----------------
  useEffect(() => {
    if (open && Modeltype === "View" && Modeldata) {
      setOrderId(Modeldata._id || "");
      setCustomerEmail(Modeldata.customerEmail || "");
      setTotalAmount(Modeldata.totalAmount || 0);
      setPaymentMethod(Modeldata.paymentMethod || "");
      setPaymentStatus(Modeldata.paymentStatus || "");
      setOrderStatus(Modeldata.orderStatus || "");
      setCreatedAt(Modeldata.createdAt || "");
      setUpdatedAt(Modeldata.updatedAt || "");
    }
  }, [open, Modeltype, Modeldata]);

  // ---------------- Update Order ----------------
const handleUpdateOrder = async () => {
  if (!orderStatus) {
    toast.error("Order status is required");
    return;
  }

  try {
    setLoading(true);

    // Backend expects `status`, not `orderStatus`
    const payload = { status: orderStatus };

    const res = await updateOrderStatus(Modeldata._id, payload);

    if (res?.statusCode === 200) {
      toast.success(res.message || "Order updated successfully");
      onResponse();
      handleClose();
    } else {
      toast.error(res.message || "Failed to update order");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to update order");
  } finally {
    setLoading(false);
  }
};


  // ---------------- Handle Close ----------------
  const handleClose = () => {
    setOpen(false);
    // Reset fields
    setOrderId("");
    setCustomerEmail("");
    setTotalAmount(0);
    setPaymentMethod("");
    setPaymentStatus("");
    setOrderStatus("");
    setCreatedAt("");
    setUpdatedAt("");
  };

  // ---------------- UI ----------------
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          // background: "var(--horizontal-gradient)",
          color: "black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {Modeltype === "Add" ? "Add New Order" : "View Order"}
        <IconButton onClick={handleClose} sx={{ color: "black" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* -------- Row 1 -------- */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Order ID"
            fullWidth
            value={orderId}
            disabled
            size="small"
          />
          <TextField
            label="Customer Email"
            fullWidth
            value={customerEmail}
            disabled
            size="small"
          />
        </Box>

        {/* -------- Row 2 -------- */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Total Amount"
            fullWidth
            value={totalAmount}
            disabled
            size="small"
          />
          <TextField
            label="Payment Method"
            fullWidth
            value={paymentMethod}
            disabled
            size="small"
          />
        </Box>

        {/* -------- Row 3 - Editable Status Fields -------- */}
<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
  <FormControl fullWidth size="small">
    <InputLabel>Payment Status</InputLabel>
    <Select
      value={paymentStatus}
      label="Payment Status"
      onChange={(e) => setPaymentStatus(e.target.value)}
      disabled={Modeltype === "View"} // <-- make it read-only in View mode
    >
      <MenuItem value="pending">Pending</MenuItem>
      <MenuItem value="paid">Paid</MenuItem>
      <MenuItem value="failed">Failed</MenuItem>
    </Select>
  </FormControl>

  <FormControl fullWidth size="small">
  <InputLabel>Order Status</InputLabel>
  <Select
    value={orderStatus}
    label="Order Status"
    onChange={(e) => setOrderStatus(e.target.value)}
  >
    <MenuItem value="pending">Pending</MenuItem>
    <MenuItem value="processing">Processing</MenuItem>
    <MenuItem value="shipped">Shipped</MenuItem>
    <MenuItem value="delivered">Delivered</MenuItem>
    <MenuItem value="cancelled">Cancelled</MenuItem>
  </Select>
</FormControl>
</Box>

        {/* -------- Row 4 -------- */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            borderColor: "#B1B1B1",
            color: "#B1B1B1",
            "&:hover": {
              borderColor: "#999",
              backgroundColor: "rgba(177, 177, 177, 0.1)",
            },
          }}
          
        >
          Cancel
        </Button>

        {Modeltype === "View" && (
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleUpdateOrder}
            sx={{
              background: "var(--horizontal-gradient)",
              "&:hover": { background: "var(--vertical-gradient)" },
            }}
          >
            {loading ? "Updating..." : "Update Order"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddOrder;