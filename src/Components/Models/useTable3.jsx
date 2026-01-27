import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Checkbox,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./confirmDeleteModel";
import { useParams, useNavigate } from "react-router-dom";
import { fileUrl } from "../../Config/Config";
import truncateText from "../../Utils/truncateText";
import { formatDate } from "../../Utils/Formatedate";
import { toast } from "react-toastify";
import AuthContext from "../../auth/AuthContext";
import PermissionGate from "../../Config/PermissionGate";
import {
  CREATE_PERMISSION_BY_TABLE,
  VIEW_PERMISSION_BY_TABLE,
} from "../../Config/Permission";
import OrderReceipt from "../OrderReceipt";

export function useTable3({
  attributes3,
  reFetch,
  tableType,
  data = [],
  addPath,
  viewPath,
  deleteFn,
  onSearch,
  navigationState,
  onViewClick,
}) {
  const [selected, setSelected] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useContext(AuthContext);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const STATUS_FIELDS = [
    "status",
    "isActive",
    "published",
    "paymentStatus",
    "orderStatus",
  ];

  const STATUS_STYLES = {
    Active: {
      bg: "var(--status-success-bg)",
      color: "var(--status-success-text)",
    },
    Inactive: {
      bg: "var(--status-error-bg)",
      color: "var(--status-error-text)",
    },
    pending: {
      bg: "var(--status-warning-bg)",
      color: "var(--status-warning-text)",
    },
    Pending: {
      bg: "var(--status-warning-bg)",
      color: "var(--status-warning-text)",
    },
    completed: {
      bg: "var(--status-info-bg)",
      color: "var(--status-info-text)",
    },
    delivered: {
      bg: "var(--status-success-bg)",
      color: "var(--status-success-text)",
    },
    Delivered: {
      bg: "var(--status-success-bg)",
      color: "var(--status-success-text)",
    },
    cancelled: {
      bg: "var(--status-error-bg)",
      color: "var(--status-error-text)",
    },
    Cancelled: {
      bg: "var(--status-error-bg)",
      color: "var(--status-error-text)",
    },
    paid: {
      bg: "var(--status-success-bg)",
      color: "var(--status-success-text)",
    },
    Paid: {
      bg: "var(--status-success-bg)",
      color: "var(--status-success-text)",
    },
    failed: { bg: "var(--status-error-bg)", color: "var(--status-error-text)" },
    Failed: { bg: "var(--status-error-bg)", color: "var(--status-error-text)" },
    shipped: {
      bg: "var(--status-shipped-bg)",
      color: "var(--status-shipped-text)",
    },
    Shipped: {
      bg: "var(--status-shipped-bg)",
      color: "var(--status-shipped-text)",
    },
    processing: {
      bg: "var(--status-info-bg)",
      color: "var(--status-info-text)",
    },
    Processing: {
      bg: "var(--status-info-bg)",
      color: "var(--status-info-text)",
    },
  };

  // --- Select all rows ---
  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? data.map((row) => row._id) : []);
  };

  const isSelected = (id) => selected.includes(id);

  // --- Navigate to View/Edit ---
  const handleViewClick = (row) => {
    if (!can(VIEW_PERMISSION_BY_TABLE[tableType])) {
      toast.warning("You don't have permission to view this");
      return;
    }
    if (onViewClick) {
      onViewClick(row);
      return;
    }
    if (viewPath)
      navigate(viewPath.replace(":id", id).replace(":subId", row._id));
  };

  // --- Navigate to Add ---
  const handleAddButton = () => {
    if (addPath) {
      if (navigationState) {
        navigate(addPath.replace(":id", id), { state: navigationState });
      } else {
        navigate(addPath.replace(":id", id));
      }
    }
  };

  // --- Delete modal ---
  const handleDeleteClick = () => setOpenDeleteModal(true);

  const handleDelete = async () => {
    if (!selected.length) {
      toast.warning("No items selected for deletion");
      return;
    }
    if (!deleteFn) return;

    try {
      const response = await deleteFn({ ids: selected });
      if (response.statusCode === 200) {
        toast.success(response.message || "Deleted successfully");
        reFetch && reFetch();
        setSelected([]);
        setOpenDeleteModal(false);
      } else {
        toast.error(response.message || "Failed to delete items");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again later.");
    }
  };

  const getNestedValue = (obj, path) =>
    path
      .split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : "N/A"),
        obj,
      );

  // --- Table UI ---
  return {
    tableUI3: (
      <>
        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          onConfirm={handleDelete}
        />

        <Box sx={{ width: "100%", marginBottom: "50px" }}>
          <Paper sx={{ width: "100%", maxHeight: "95vh", boxShadow: "none" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                {tableType} List
              </Typography>

              <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <TextField
                  size="small"
                  placeholder="Search..."
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    minWidth: 200,
                    backgroundColor: "white",
                    borderRadius: 1,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon sx={{ cursor: "pointer" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                {selected.length > 0 ? (
                  <IconButton onClick={handleDeleteClick} sx={{ color: "red" }}>
                    <DeleteIcon />
                  </IconButton>
                ) : addPath ? (
                  <PermissionGate
                    permission={CREATE_PERMISSION_BY_TABLE[tableType]}
                    fallback={
                      <Button
                        disabled
                        sx={{
                          background: "#e0e0e0",
                          color: "#777",
                          borderRadius: "var(--border-radius-secondary)",
                          textTransform: "none",
                          cursor: "not-allowed",
                        }}
                      >
                        Add {tableType}
                      </Button>
                    }
                  >
                    <Button
                      sx={{
                        background: "var(--horizontal-gradient)",
                        color: "var(--white-color)",
                        borderRadius: "var(--border-radius-secondary)",
                        "&:hover": { background: "var(--vertical-gradient)" },
                        textTransform: "none",
                      }}
                      onClick={handleAddButton}
                    >
                      Add {tableType}
                    </Button>
                  </PermissionGate>
                ) : null}
              </Box>
            </Toolbar>

            <TableContainer sx={{ width: "100%", overflowX: "hidden" }}>
              <Table stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        backgroundColor: "var(--primary-color)",
                        color: "white",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{
                          color: "var(--white-color)",
                          "&.Mui-checked": { color: "var(--white-color)" },
                          "&.MuiCheckbox-indeterminate": {
                            color: "var(--white-color)",
                          },
                        }}
                        indeterminate={
                          selected.length > 0 && selected.length < data.length
                        }
                        checked={
                          data.length > 0 && selected.length === data.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>

                    {attributes3.map((attr) => (
                      <TableCell
                        key={attr.id}
                        sx={{
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {attr.label}
                      </TableCell>
                    ))}

                    {tableType === "Orders" && <TableCell>Receipt</TableCell>}
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={attributes3.length + 2}
                        align="center"
                        sx={{ py: 4 }}
                      >
                        <Typography color="text.secondary">
                          No results found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => {
                      const isItemSelected = isSelected(row._id);
                      return (
                        <TableRow key={row._id} selected={isItemSelected}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              sx={{
                                color: "var(--primary-color)",
                                "&.Mui-checked": {
                                  color: "var(--primary-color)",
                                },
                              }}
                              checked={isItemSelected}
                              onChange={() =>
                                setSelected((prev) =>
                                  isItemSelected
                                    ? prev.filter((id) => id !== row._id)
                                    : [...prev, row._id],
                                )
                              }
                            />
                          </TableCell>

                          {attributes3.map((attr) => (
                            <TableCell
                              key={attr.id}
                              sx={{
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                overflow: "hidden",
                              }}
                            >
                              {STATUS_FIELDS.includes(attr.id) ? (
                                (() => {
                                  let value = row[attr.id];
                                  if (value === true) value = "Active";
                                  if (value === false) value = "Inactive";
                                  const style = STATUS_STYLES[value] || {
                                    bg: "#e2e3e5",
                                    color: "#383d41",
                                  };
                                  return (
                                    <span
                                      style={{
                                        background: style.bg,
                                        color: style.color,
                                        padding: "5px 10px",
                                        borderRadius: "6px",
                                        fontWeight: 600,
                                        textTransform: "capitalize",
                                        display: "inline-block",
                                        minWidth: "90px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {value}
                                    </span>
                                  );
                                })()
                              ) : attr.id === "createdAt" ||
                                attr.id === "publishedDate" ? (
                                formatDate(row[attr.id])
                              ) : attr.id === "image" ? (
                                row[attr.id] ? (
                                  <img
                                    alt=""
                                    src={fileUrl + row[attr.id]}
                                    style={{
                                      height: 60,
                                      width: "auto",
                                      maxWidth: "100%",
                                      display: "block",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : (
                                  "N/A"
                                )
                              ) : typeof getNestedValue(row, attr.id) ===
                                "string" ? (
                                truncateText(getNestedValue(row, attr.id), 30)
                              ) : (
                                getNestedValue(row, attr.id)
                              )}
                            </TableCell>
                          ))}

                          {tableType === "Orders" && (
                            <TableCell align="center">
                              <OrderReceipt orderId={row._id} />
                            </TableCell>
                          )}

                          <TableCell>
                            <PermissionGate
                              permission={VIEW_PERMISSION_BY_TABLE[tableType]}
                              fallback={
                                <Button
                                  size="small"
                                  variant="outlined"
                                  disabled
                                  sx={{
                                    textTransform: "none",
                                    borderColor: "#ccc",
                                    color: "#999",
                                    cursor: "not-allowed",
                                    "&:hover": { borderColor: "#ccc" },
                                  }}
                                >
                                  View
                                </Button>
                              }
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleViewClick(row)}
                                sx={{
                                  textTransform: "none",
                                  borderColor: "var(--primary-color)",
                                  color: "var(--primary-color)",
                                  "&:hover": {
                                    backgroundColor: "var(--primary-color)",
                                    color: "#fff",
                                  },
                                }}
                              >
                                View
                              </Button>
                            </PermissionGate>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </>
    ),
  };
}
