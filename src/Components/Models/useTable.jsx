import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Checkbox,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../Utils/Formatedate";
import truncateText from "../../Utils/truncateText";
import DeleteModal from "./confirmDeleteModel";
import AddUsers from "./addUsers";
import {
  getAllAdmins,
  getAllCategories,
  getAllCustomers,
  getAllOrders,
  getAllProducts,
} from "../../DAL/fetch";
import {
  deleteAdmins,
  deleteCategories,
  deleteProducts,
} from "../../DAL/delete";
import { toast } from "react-toastify";
import PermissionGate from "../../Config/PermissionGate";
import {
  CREATE_PERMISSION_BY_TABLE,
  VIEW_PERMISSION_BY_TABLE,
} from "../../Config/Permission";
import AuthContext from "../../auth/AuthContext";
import { fileUrl } from "../../Config/Config";

export function useTable({ attributes, tableType, limitPerPage = 25 }) {
  const navigate = useNavigate();
  const { can } = useContext(AuthContext);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitPerPage);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [openUserModal, setOpenUserModal] = useState(false);
  const [modelData, setModelData] = useState({});
  const [modeltype, setModeltype] = useState("Add");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const STATUS_FIELDS = ["status", "isActive", "published", "paymentStatus"];

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let res;

      if (tableType === "Users") {
        res = await getAllAdmins(page, rowsPerPage, debouncedSearch);
      }

      if (tableType === "Categories") {
        res = await getAllCategories(page, rowsPerPage, debouncedSearch);
      }
      if (tableType === "Products") {
        res = await getAllProducts(page, rowsPerPage, debouncedSearch);
      }
      if (tableType === "Customers") {
        res = await getAllCustomers(page, rowsPerPage, debouncedSearch);
      }
      if (tableType === "Orders") {
        res = await getAllOrders(page, rowsPerPage, debouncedSearch);
      }
      setData(res?.data || []);
      setTotalRecords(res?.meta?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- ADD BUTTON ---------------- */
  const handleAddButton = () => {
    if (tableType === "Categories") {
      navigate("/categories/add");
      return;
    }
    if (tableType === "Products") {
      navigate("/products/add");
      return;
    }

    if (tableType === "Users") setOpenUserModal(true);

    setModeltype("Add");
    setModelData({});
  };

  /* ---------------- VIEW / EDIT ---------------- */
  const handleViewClick = (row) => {
    // Permission check: view permission nahi hai tou block kar do
    if (!can(VIEW_PERMISSION_BY_TABLE[tableType])) {
      toast.error("You don't have permission to view this");
      return;
    }

    if (tableType === "Categories") {
      navigate(`/categories/${row._id}/edit`);
      return;
    }
    if (tableType === "Products") {
      navigate(`/products/${row._id}/edit`);
      return;
    }
    if (tableType === "Customers") {
      navigate(`/customers/${row._id}/edit`);
      return;
    }

    if (tableType === "Users") {
      setOpenUserModal(true);
      setModeltype("View");
      setModelData(row);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!selected.length) {
      toast.warning("No items selected");
      return;
    }

    try {
      let res;

      if (tableType === "Users") res = await deleteAdmins({ ids: selected });
      if (tableType === "Categories")
        res = await deleteCategories({ ids: selected });
      if (tableType === "Products")
        res = await deleteProducts({ ids: selected });

      if (res?.statusCode === 200) {
        toast.success(res.message || "Deleted successfully");
        fetchData();
        setSelected([]);
        setOpenDeleteModal(false);
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, key) => acc?.[key] ?? "N/A", obj);

  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? data.map((row) => row._id) : []);
  };

  const isSelected = (id) => selected.includes(id);

  const handleChangePage = (_, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Check if user has view permission
  const hasViewPermission = can(VIEW_PERMISSION_BY_TABLE[tableType]);

  /* ---------------- UI ---------------- */
  return {
    tableUI: (
      <>
        {openUserModal && (
          <AddUsers
            open={openUserModal}
            setOpen={setOpenUserModal}
            Modeltype={modeltype}
            Modeldata={modelData}
            onResponse={fetchData}
          />
        )}

        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          onConfirm={handleDelete}
        />

        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", maxHeight: "95vh", boxShadow: "none" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5" sx={{ color: "var(--primary-color)" }}>
                {tableType} List
              </Typography>
              <Box sx={{ display: "flex", gap: "10px" }}>
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
                  <IconButton
                    onClick={() => setOpenDeleteModal(true)}
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : (
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
                        Add New {tableType}
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
                      Add New {tableType}
                    </Button>
                  </PermissionGate>
                )}
              </Box>
            </Toolbar>

            <TableContainer sx={{ maxHeight: "76vh" }}>
              <Table stickyHeader>
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
                    {attributes.map((attr) => (
                      <TableCell key={attr._id}>{attr.label}</TableCell>
                    ))}
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={attributes.length + 2}
                        align="center"
                        sx={{ py: 8 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <CircularProgress
                            size={45}
                            thickness={4}
                            sx={{ color: "var(--primary-color)" }}
                          />
                          <Typography>Loading {tableType}...</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={attributes.length + 2} align="center">
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => {
                      const isItemSelected = isSelected(row._id || row.id);
                      return (
                        <TableRow
                          key={row._id || row.id}
                          selected={isItemSelected}
                        >
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
                                    ? prev.filter(
                                        (id) => id !== (row._id || row.id),
                                      )
                                    : [...prev, row._id || row.id],
                                )
                              }
                            />
                          </TableCell>
                          {attributes.map((attr) => (
                            <TableCell key={attr.id}>
                              {attr.id === "createdAt" ? (
                                formatDate(row[attr.id])
                              ) : attr.id === "image" ||
                                attr.id === "thumbnail" ? (
                                row[attr.id] ? (
                                  <img
                                    src={fileUrl + row[attr.id]}
                                    alt=""
                                    style={{
                                      height: "50px",
                                      maxWidth: "200px",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : (
                                  <Avatar sx={{ width: 40, height: 40 }} />
                                )
                              ) : STATUS_FIELDS.includes(attr.id) ? (
                                (() => {
                                  let value = row[attr.id];
                                  if (value === true) value = "Active";
                                  if (value === false) value = "Inactive";

                                  const STATUS_STYLES = {
                                    Active: {
                                      bg: "var(--status-success-bg)",
                                      color: "var(--status-success-text)",
                                    },
                                    IDBCursornactive: {
                                      bg: "var(--status-error-bg)",
                                      color: "var(--status-error-text)",
                                    },

                                    pending: {
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

                                    cancelled: {
                                      bg: "var(--status-error-bg)",
                                      color: "var(--status-error-text)",
                                    },

                                    paid: {
                                      bg: "var(--status-success-bg)",
                                      color: "var(--status-success-text)",
                                    },

                                    failed: {
                                      bg: "var(--status-error-bg)",
                                      color: "var(--status-error-text)",
                                    },
                                  };

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
                              ) : row[attr.id] === 0 ? (
                                0
                              ) : typeof getNestedValue(row, attr.id) ===
                                "string" ? (
                                truncateText(getNestedValue(row, attr.id), 30)
                              ) : (
                                getNestedValue(row, attr.id)
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            {/* Permission check: agar view permission nahi hai tou disabled button dikhao */}
                            {!hasViewPermission ? (
                              <Button
                                size="small"
                                variant="outlined"
                                disabled
                                sx={{
                                  textTransform: "none",
                                  borderColor: "#ccc",
                                  color: "#999",
                                  cursor: "not-allowed",
                                  "&:hover": {
                                    borderColor: "#ccc",
                                  },
                                }}
                              >
                                View
                              </Button>
                            ) : (
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
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={totalRecords}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </>
    ),
  };
}