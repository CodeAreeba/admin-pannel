import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useRef } from "react";
import { baseUrl, fileUrl } from "../Config/Config";

const MAX_IMAGES = 4;

const VariantImageGallery = ({ images, setImages }) => {
  const inputRef = useRef(null);

  const openFilePicker = () => inputRef.current.click();

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const updated = [...images];

      const emptyIndexes = updated
        .map((img, i) => (!img ? i : null))
        .filter((i) => i !== null);

      for (let i = 0; i < files.length && i < emptyIndexes.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);

        const res = await axios.post(`${baseUrl}/upload/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res?.data?.file) {
          updated[emptyIndexes[i]] = {
            url: res.data.file,
            isPrimary: emptyIndexes[i] === 0,
          };
        }
      }

      // Ensure ONLY first image is primary
      const firstIndex = updated.findIndex(Boolean);
      updated.forEach((img, i) => {
        if (img) img.isPrimary = i === firstIndex;
      });

      setImages(updated);
    } catch (err) {
      console.error(err);
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = null;

      // Re-assign primary if needed
      const firstIndex = updated.findIndex(Boolean);
      updated.forEach((img, i) => {
        if (img) img.isPrimary = i === firstIndex;
      });

      return updated;
    });
  };

  const setPrimary = (index) => {
    if (!images[index]) return;

    setImages((prev) =>
      prev.map((img, i) => (img ? { ...img, isPrimary: i === index } : null)),
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Upload Images
      </Typography>
      {/* MAIN IMAGE - Slot 0 */}
      <Box
        sx={{
          height: 320,
          mb: 4,
          p: 3,
          borderRadius: 2,
          bgcolor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {images[0] ? (
          <>
            <img
              src={`${fileUrl}${images[0].url}`}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />

            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "#fff",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                removeImage(0);
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            No image uploaded
          </Typography>
        )}
      </Box>

      {/* THUMBNAILS - Slots 1, 2, 3, and upload button */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {[1, 2, 3, "upload"].map((slot, i) => {
          const isUpload = slot === "upload";
          const image = images[slot];

          return (
            <Box
              key={i}
              sx={{
                width: "25%",
                height: 100,
                borderRadius: 1,
                border: "1px solid #ddd",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: image ? "#fff" : "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                if (isUpload) openFilePicker();
                else if (image) setPrimary(slot);
              }}
            >
              {image ? (
                <>
                  <img
                    src={`${fileUrl}${image.url}`}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      bgcolor: "#fff",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(slot);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : isUpload ? (
                <AddIcon fontSize="large" sx={{ color: "#aaa" }} />
              ) : null}
            </Box>
          );
        })}
      </Box>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        hidden
        onChange={handleFiles}
      />
    </Box>
  );
};

export default VariantImageGallery;
