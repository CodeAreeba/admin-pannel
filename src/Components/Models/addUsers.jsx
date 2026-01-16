// AddUsers.jsx
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Chip,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { createAdmin } from "../../DAL/create";
import { updateAdmin } from "../../DAL/edit";
import { getAllPermissions } from "../../DAL/fetch";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "65%",
  maxHeight: "85vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

export default function AddUsers({ open, setOpen, Modeldata, onResponse }) {
  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState(true);

  const [permissionGroups, setPermissionGroups] = React.useState([]);
  const [selectedPermissions, setSelectedPermissions] = React.useState([]);
  const [errors, setErrors] = React.useState({});

  // Load all permissions
  React.useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await getAllPermissions();
        setPermissionGroups(res?.data || []);
      } catch (err) {
        console.error("Permission load failed", err);
      }
    })();
  }, [open]);

  // Sync edit data
  React.useEffect(() => {
    setId(Modeldata?._id || "");
    setName(Modeldata?.name || "");
    setEmail(Modeldata?.email || "");
    setStatus(
      typeof Modeldata?.isActive === "boolean" ? Modeldata.isActive : true
    );
    setSelectedPermissions(Modeldata?.permissions || []);
    setPassword("");
    setErrors({});
  }, [Modeldata]);

  const handleClose = () => {
    // Reset form on close
    setId("");
    setName("");
    setEmail("");
    setPassword("");
    setStatus(true);
    setSelectedPermissions([]);
    setErrors({});
    setOpen(false);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const togglePermission = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleGroup = (groupPerms) => {
    const allSelected = groupPerms.every((p) =>
      selectedPermissions.includes(p)
    );
    setSelectedPermissions((prev) =>
      allSelected
        ? prev.filter((p) => !groupPerms.includes(p))
        : [...new Set([...prev, ...groupPerms])]
    );
  };

  const isGroupEnabled = (groupPerms) =>
    groupPerms.some((p) => selectedPermissions.includes(p));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldErrors = {};
    if (!name.trim()) fieldErrors.name = "Name is required";
    if (!email.trim()) fieldErrors.email = "Email is required";
    else if (!validateEmail(email.trim()))
      fieldErrors.email = "Invalid email format";
    if (!id && !password.trim()) fieldErrors.password = "Password is required";
    if (!selectedPermissions.length)
      fieldErrors.permissions = "Select at least one permission";

    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    const payload = {
      name,
      email,
      isActive: status,
      permissions: selectedPermissions,
    };
    if (!id) payload.password = password;

    try {
      const res = id
        ? await updateAdmin(id, payload)
        : await createAdmin(payload);

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        onResponse({
          messageType: "success",
          message: id
            ? "Admin updated successfully"
            : "Admin created successfully",
          refresh: true,
        });
      }
    } catch (err) {
      onResponse({
        messageType: "error",
        message: err.message || "Something went wrong",
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6">{id ? "Update" : "Create"} Admin</Typography>

        {/* Name & Email */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Box>

        {/* Password */}
        {!id && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Box>
        )}

        {/* Status */}
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Permissions */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" mb={1}>
            Permissions
          </Typography>
          {errors.permissions && (
            <Typography color="error">{errors.permissions}</Typography>
          )}

          {permissionGroups.map(({ group, permissions }) => {
            const enabled = isGroupEnabled(permissions);
            return (
              <Accordion key={group} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography >{group}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        size="small"
                        color={enabled ? "success" : "default"}
                        label={enabled ? "Enabled" : "Disabled"}
                      />
                      <Switch
                        checked={enabled}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleGroup(permissions)}
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {permissions.map((perm) => (
                      <Grid item xs={6} md={3} key={perm}>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={selectedPermissions.includes(perm)}
                              onChange={() => togglePermission(perm)}
                            />
                          }
                          label={perm.split(":")[1]}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>

        {/* Actions */}
        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#B1B1B1" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: "var(--horizontal-gradient)",
              color: "#fff",
              "&:hover": { background: "var(--vertical-gradient)" },
            }}
          >
            {id ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
