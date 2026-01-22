import React, { useEffect, useState } from "react";
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

import { getCustomerById, getCustomerOrders } from "../../DAL/fetch";
import { updateCustomerStatus } from "../../DAL/edit";
import { useTable3 } from "../../Components/Models/useTable3";
import AddOrder from "./AddOrders";

const AddCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isViewMode = Boolean(id);

  // ---------------- State ----------------
  const [customerId, setCustomerId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- Order Modal State ----------------
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ---------------- Fetch Customer ----------------
  const fetchCustomer = async () => {
    if (!id) return;
    try {
      const res = await getCustomerById(id);
      if (res?.statusCode === 200) {
        const c = res.data;

        setCustomerId(c._id);
        setEmail(c.email);
        setRole(c.role);
        setIsActive(c.isActive);
        setOtpAttempts(c.otpAttempts || 0);
        setAddresses(c.addresses || []);
        setCreatedAt(c.createdAt);
        setUpdatedAt(c.updatedAt);
      }
    } catch (err) {
      toast.error("Failed to load customer");
    }
  };

  // ---------------- Fetch Orders ----------------
  const fetchOrders = async () => {
    if (!id) return;
    try {
      const res = await getCustomerOrders(id);
      if (res?.statusCode === 200) {
        setOrders(res.data || []);
      }
    } catch (err) {
      setOrders([]);
    }
  };

  // ---------------- Update Status ----------------
  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      const res = await updateCustomerStatus(id, { isActive });
      toast.success(res.message || "Status updated");
      navigate("/customers");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Custom View Handler for Modal ----------------
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenOrderModal(true);
  };

  // ---------------- Order Modal Response ----------------
  const handleOrderModalResponse = () => {
    fetchOrders();
  };

  // ---------------- Orders Table ----------------
  const orderAttributes = [
    { id: "_id", label: "ORDER ID" },
    { id: "totalAmount", label: "TOTAL AMOUNT" },
    { id: "paymentMethod", label: "PAYMENT METHOD" },
    { id: "paymentStatus", label: "PAYMENT STATUS" },
    { id: "status", label: "ORDER STATUS" },
    {
      id: "createdAt",
      label: "ORDER DATE",
      format: (val) => new Date(val).toLocaleDateString(),
    },
  ];

  const { tableUI3 } = useTable3({
    attributes3: orderAttributes,
    tableType: "Orders",
    data: orders,
    reFetch: fetchOrders,
    // Don't pass addPath - this will hide "Add Orders" button
    addPath: undefined,
    // Don't pass viewPath - we're using onViewClick instead
    viewPath: undefined,
    // Pass custom view handler
    onViewClick: handleViewOrder,
    deleteFn: undefined,
  });

  // ---------------- Effects ----------------
  useEffect(() => {
    fetchCustomer();
    fetchOrders();
  }, [id]);

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 3, backgroundColor: "#fff" }}>
      <Typography variant="h4">View Customer</Typography>

      <Box component="form" sx={{ mt: 2 }}>
        {/* --------- Row 1: Customer ID + Email --------- */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="Customer ID" fullWidth value={customerId} disabled />
          <TextField label="Email" fullWidth value={email} disabled />
        </Box>

        {/* --------- Row 2: Role + OTP Attempts --------- */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="Role" fullWidth value={role} disabled />
          <TextField label="OTP Attempts" fullWidth value={otpAttempts} disabled />
        </Box>

        {/* --------- Row 3: Active Switch --------- */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
            }
            label={isActive ? "Active" : "Inactive"}
          />
        </Box>

        {/* --------- Row 4: Created At + Updated At --------- */}
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

        {/* --------- Addresses Section --------- */}
        {addresses.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
              Addresses
            </Typography>

            {addresses.map((addr, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: "#fafafa" }}>
                <Typography variant="subtitle1">
                  {addr.firstName} {addr.lastName}
                </Typography>
                <Typography variant="body2">
                  {addr.addressLine1}, {addr.addressLine2}
                </Typography>
                <Typography variant="body2">
                  {addr.city}, {addr.postalCode}
                </Typography>
                <Typography variant="body2">{addr.country}</Typography>
                <Typography variant="body2">📞 {addr.phone}</Typography>
              </Paper>
            ))}
          </>
        )}

        {/* --------- Orders Section --------- */}
        <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
          Customer Orders
        </Typography>
        {tableUI3}

        {/* --------- Footer --------- */}
        <Paper
          sx={{
            mt: 4,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            boxShadow: "none",
          }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#B1B1B1" }}
            onClick={() => navigate("/customers")}
          >
            Back
          </Button>

          <Button
            variant="contained"
            disabled={loading}
            onClick={handleUpdateStatus}
            sx={{
              background: "var(--horizontal-gradient)",
              "&:hover": {
                background: "var(--vertical-gradient)",
              },
            }}
          >
            Update Status
          </Button>
        </Paper>
      </Box>

      {/* --------- Order Modal --------- */}
      <AddOrder
        open={openOrderModal}
        setOpen={setOpenOrderModal}
        Modeltype="View"
        Modeldata={selectedOrder}
        onResponse={handleOrderModalResponse}
      />
    </Box>
  );
};

export default AddCustomer;