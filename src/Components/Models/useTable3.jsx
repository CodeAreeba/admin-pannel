import React, { useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./confirmDeleteModel";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../../Config/Config";
import truncateText from "../../Utils/truncateText";
import { formatDate } from "../../Utils/Formatedate";
import { toast } from "react-toastify";

export function useTable3({ attributes3, reFetch, tableType, data = [], addPath, viewPath, deleteFn }) {
  const [selected, setSelected] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Select all rows ---
  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? data.map((row) => row._id) : []);
  };

  const isSelected = (id) => selected.includes(id);

  // --- Navigate to View/Edit ---
  const handleViewClick = (row) => {
    if (viewPath) navigate(viewPath.replace(":id", id).replace(":subId", row._id));
  };

  // --- Navigate to Add ---
  const handleAddButton = () => {
    if (addPath) navigate(addPath.replace(":id", id));
  };

  // --- Delete modal ---
  const handleDeleteClick = () => setOpenDeleteModal(true);

  const handleDelete = async () => {
    if (!selected.length) {
      toast.warning( "No items selected for deletion");
      return;
    }
    if (!deleteFn) return;

    try {
      const response = await deleteFn({ ids: selected });
      if (response.status === 200) {
        toast.success( response.message || "Deleted successfully");
        reFetch && reFetch();
        setSelected([]);
      } else {
        toast.error( response.message || "Failed to delete items");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again later.");
    }
  };

  // --- Helper to access nested values ---
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : "N/A"), obj);

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
              <Typography variant="h5" sx={{ color: "var(--background-color)" }}>
                {tableType} List
              </Typography>

              {selected.length > 0 ? (
                <IconButton onClick={handleDeleteClick} sx={{ color: "red" }}>
                  <DeleteIcon />
                </IconButton>
              ) : (
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
              )}
            </Toolbar>

            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{
                          color: "var(--background-color)",
                          "&.Mui-checked": { color: "var(--background-color)" },
                        }}
                        indeterminate={selected.length > 0 && selected.length < data.length}
                        checked={data.length > 0 && selected.length === data.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    {attributes3.map((attr) => (
                      <TableCell key={attr.id} sx={{ color: "var(--background-color)" }}>
                        {attr.label}
                      </TableCell>
                    ))}
                    <TableCell sx={{ color: "var(--background-color)" }}>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.map((row) => {
                    const isItemSelected = isSelected(row._id);
                    return (
                      <TableRow key={row._id} selected={isItemSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            sx={{ color: "var(--background-color)", "&.Mui-checked": { color: "var(--background-color)" } }}
                            checked={isItemSelected}
                            onChange={() =>
                              setSelected((prev) =>
                                isItemSelected ? prev.filter((id) => id !== row._id) : [...prev, row._id]
                              )
                            }
                          />
                        </TableCell>

                        {attributes3.map((attr) => (
                          <TableCell key={attr.id} sx={{ color: "var(--black-color)" }}>
                            {attr.id === "createdAt" || attr.id === "publishedDate" ? (
                              formatDate(row[attr.id])
                            ) : attr.id === "published" ? (
                              <span
                                style={{
                                  color: row[attr.id] ? "var(--success-color)" : "var(--warning-color)",
                                  background: row[attr.id] ? "var(--success-bgcolor)" : "var(--warning-bgcolor)",
                                  padding: "5px",
                                  minWidth: "100px",
                                  borderRadius: "var(--default-border-radius)",
                                  display: "inline-block",
                                  textAlign: "center",
                                }}
                              >
                                {row[attr.id] ? "Public" : "Draft"}
                              </span>
                            ) : attr.id === "image" ? (
                              row[attr.id] ? (
                                <img
                                  alt=""
                                  src={baseUrl + row[attr.id]}
                                  style={{ height: "50px", maxWidth: "200px", objectFit: "contain" }}
                                />
                              ) : (
                                "N/A"
                              )
                            ) : typeof getNestedValue(row, attr.id) === "string" ? (
                              truncateText(getNestedValue(row, attr.id), 30)
                            ) : (
                              getNestedValue(row, attr.id)
                            )}
                          </TableCell>
                        ))}

                        <TableCell>
                          <span
                            onClick={() => handleViewClick(row)}
                            style={{
                              color: "var(--background-color)",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </>
    ),
  };
}
