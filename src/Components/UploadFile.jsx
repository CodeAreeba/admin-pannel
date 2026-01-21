import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";
import { baseUrl, fileUrl } from "../Config/Config";

const VisuallyHiddenInput = React.forwardRef(({ onChange, accept }, ref) => (
  <input
    ref={ref}
    type="file"
    accept={accept}
    style={{ display: "none" }}
    onChange={onChange}
  />
));

const UploadFile = ({
  endpoint = "/upload/image",
  fieldName = "image",
  accept = "image/*,application/pdf",
  onUploadComplete,
  initialFile = null,
  error = "",
  showButton = true,
}) => {
  const [fileObj, setFileObj] = useState(null);
  const inputRef = useRef(null);

  // Load initial file if exists
  useEffect(() => {
    if (!initialFile || initialFile === "null") return;

    const filePath =
      initialFile.startsWith("http") || initialFile.startsWith("data:")
        ? initialFile
        : `${fileUrl}${initialFile}`;

    setFileObj({
      file: null,
      preview: filePath,
      isPDF: filePath.toLowerCase().endsWith(".pdf"),
      progress: 100,
      uploading: false,
      uploadedPath: initialFile,
      speed: "--",
      eta: "Done",
    });
  }, [initialFile]);

  // Select single file
  const handleSelectFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isPDF = file.type === "application/pdf";

    setFileObj({
      file,
      preview: isPDF ? null : URL.createObjectURL(file),
      isPDF,
      progress: 0,
      uploading: false,
      uploadedPath: null,
      speed: "--",
      eta: "--",
    });
  };

  // Remove file
  const handleRemoveFile = () => {
    setFileObj(null);
    if (onUploadComplete) onUploadComplete("");
  };

  // Upload file
  const handleUpload = async () => {
    if (!fileObj?.file) return;

    const formData = new FormData();
    formData.append(fieldName, fileObj.file);

    const startTime = Date.now();
    let lastLoaded = 0;

    try {
      setFileObj((prev) => ({ ...prev, uploading: true, progress: 0 }));

      const res = await axios.post(`${baseUrl}${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded * 100) / total);
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = (loaded - lastLoaded) / elapsed;
          lastLoaded = loaded;

          const speedMB = speed / (1024 * 1024);
          const remaining = total - loaded;
          const eta = speed > 0 ? remaining / speed : 0;

          setFileObj((prev) => ({
            ...prev,
            progress,
            speed: `${speedMB.toFixed(2)} MB/s`,
            eta: `${Math.round(eta)}s left`,
          }));
        },
      });

      const uploadedPath = res?.data?.file || "";

      setFileObj((prev) => ({
        ...prev,
        uploading: false,
        progress: 100,
        uploadedPath,
        speed: "--",
        eta: "Done",
      }));

      if (onUploadComplete) onUploadComplete(uploadedPath);
    } catch (error) {
      console.error("Upload failed:", error);
      setFileObj((prev) => ({ ...prev, uploading: false }));
    }
  };

  return (
    <Box>
      {showButton && (
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ backgroundColor: "var(--primary-color)" }}
        >
          Upload file
          <VisuallyHiddenInput
            ref={inputRef}
            accept={accept}
            onChange={handleSelectFile}
          />
        </Button>
      )}

      {error && (
        <Typography variant="caption" color="error" display="block" mt={0.5}>
          {error}
        </Typography>
      )}

      {fileObj && (
        <Box
          sx={{
            width: 180,
            border: "1px solid #bfbebeff",

            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
            p: 1,
            mt: 2,
          }}
        >
          {/* ✅ Show image or PDF preview */}
          {fileObj.isPDF ? (
            <Box
              sx={{
                height: "100px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
              }}
            >
              <PictureAsPdfIcon color="error" sx={{ fontSize: 40 }} />
              <Typography
                variant="caption"
                textAlign="center"
                sx={{ wordBreak: "break-all", mt: 0.5 }}
              >
                {fileObj.file?.name || "PDF File"}
              </Typography>
            </Box>
          ) : (
            <img
              src={fileObj.preview}
              alt="preview"
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid #bfbebeff",
                backgroundColor: "#e2e2e2ff",
              }}
            />
          )}
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              background: "white",
            }}
            onClick={handleRemoveFile}
          >
            <CloseIcon fontSize="small" color="error" />
          </IconButton>

          {/* ⏳ Uploading / Upload button / Uploaded status */}
          {fileObj.uploading ? (
            <Box textAlign="center" mt={1}>
              <CircularProgress
                variant="determinate"
                value={fileObj.progress}
              />
              <Typography variant="caption" display="block">
                {fileObj.progress}%
              </Typography>
              <Typography variant="caption" display="block">
                {fileObj.speed} | {fileObj.eta}
              </Typography>
            </Box>
          ) : fileObj.progress === 100 && fileObj.uploadedPath ? (
            <Typography
              variant="caption"
              display="block"
              color="success.main"
              textAlign="center"
            >
              Uploaded
            </Typography>
          ) : (
            <Button
              fullWidth
              size="small"
              sx={{ mt: 1 }}
              onClick={handleUpload}
            >
              Start Upload
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UploadFile;
