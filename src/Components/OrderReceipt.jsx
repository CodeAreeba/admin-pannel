 import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { generateReceipt } from "../DAL/fetch";
import DownloadIcon from "@mui/icons-material/Download";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";

const OrderReceipt = ({ orderId }) => {
  const [loading, setLoading] = useState(false);

  const downloadReceipt = async () => {
    setLoading(true);

    try {
      const result = await generateReceipt(orderId);

      if (!result?.success || !result?.data) {
        throw new Error("Invalid receipt response");
      }

      generatePDF(result.data);
    } catch (error) {
      console.error("DOWNLOAD ERROR", error);
      alert(error.message || "Error while downloading receipt");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (data) => {
    const doc = new jsPDF({
      unit: "mm",
      format: [80, 297],  
    });

    const primaryBrown = [101, 67, 33];
    const lightBrown = [139, 90, 43];
    const darkText = [51, 51, 51];

    let yPos = 10;

    // Logo
    const img = new Image();
    img.src = "/logo.png";
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    doc.addImage(img, "PNG", 25, yPos, 30, 12);
    yPos += 18;

    /* =======================
       COMPANY HEADER
    ======================= */
    doc.setTextColor(...primaryBrown);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(data.company?.address || "123 Business St, Karachi", 40, yPos, {
      align: "center",
    });
    yPos += 4;
    doc.text(`Tel: ${data.company?.phone || "+92 XXX XXXXXXX"}`, 40, yPos, {
      align: "center",
    });
    yPos += 4;
    doc.text(data.company?.website || "www.shoeman.com", 40, yPos, {
      align: "center",
    });
    yPos += 5;
    doc.setDrawColor(...lightBrown);
    doc.setLineWidth(0.3);
    doc.line(10, yPos, 70, yPos);

    /* =======================
       ORDER INFO
    ======================= */
    yPos += 5;
    doc.setTextColor(...darkText);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER RECEIPT", 40, yPos, { align: "center" });

    yPos += 5;
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");

    const orderDate = data.date
      ? new Date(data.date).toLocaleDateString("en-US")
      : "";

    doc.text(`Order ID: ${data.orderId}`, 10, yPos);
    yPos += 4;
    doc.text(`Date: ${orderDate}`, 10, yPos);
    yPos += 4;
    doc.text(`Status: ${data.status?.toUpperCase()}`, 10, yPos);

    yPos += 5;
    doc.line(10, yPos, 70, yPos);

    /* =======================
       CUSTOMER INFO
    ======================= */
    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 10, yPos);
    doc.setFont("helvetica", "normal");

    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Name:", 10, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.customer?.name || "", 24, yPos);

    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Email:", 10, yPos);
    doc.setFont("helvetica", "normal");
    const emailLines = doc.splitTextToSize(data.customer?.email || "", 50);
    doc.text(emailLines, 24, yPos);
    yPos += emailLines.length * 3;

    yPos += 1;
    doc.setFont("helvetica", "bold");
    doc.text("Phone:", 10, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.customer?.phone || "", 24, yPos);

    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Address:", 10, yPos);
    doc.setFont("helvetica", "normal");
    const addressLines = doc.splitTextToSize(data.customer?.address || "", 50);
    doc.text(addressLines, 24, yPos);
    yPos += addressLines.length * 3;

    yPos += 2;
    doc.line(10, yPos, 70, yPos);

    /* =======================
       ITEMS (TABLE FORMAT)
    ======================= */
    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("ITEMS", 10, yPos);
    yPos += 3;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);

    const tableColumn = ["Description", "Qty", "Unit Price", "Total"];
    const tableRows = data.items.map((item) => [
      item.description,
      item.quantity,
      `Rs. ${item.unitPrice.toLocaleString()}`,
      `Rs. ${item.total.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [tableColumn],
      body: tableRows,
      theme: "plain",
      styles: {
        font: "helvetica",
        fontSize: 6.5,
        textColor: [51, 51, 51],
        cellPadding: 1.5,
      },
      headStyles: {
        fillColor: primaryBrown,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
       columnStyles: {
    0: { cellWidth: 20 }, // Description column
    1: { halign: "center", cellWidth: 10 }, // Qty
    2: { halign: "right", cellWidth: 15 }, // Unit Price
    3: { halign: "right", cellWidth: 15 }, // Total
  },
  tableWidth: 50,          // total table width
  margin: { left: 10, right: 5 },
    });

    yPos = doc.lastAutoTable.finalY + 3;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(10, yPos, 70, yPos);
    yPos += 3;

    /* =======================
       SUMMARY
    ======================= */
    doc.setFontSize(7);

    doc.text("Subtotal:", 10, yPos);
    doc.text(`Rs. ${data.summary.subtotal.toLocaleString()}`, 70, yPos, {
      align: "right",
    });

    yPos += 4;
    doc.text("Tax:", 10, yPos);
    doc.text(`Rs. ${data.summary.tax.toLocaleString()}`, 70, yPos, {
      align: "right",
    });

    yPos += 4;
    doc.text("Shipping:", 10, yPos);
    doc.text(`Rs. ${data.summary.shipping.toLocaleString()}`, 70, yPos, {
      align: "right",
    });

    yPos += 5;
    doc.setDrawColor(...primaryBrown);
    doc.setLineWidth(0.5);
    doc.line(10, yPos, 70, yPos);

    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("TOTAL:", 10, yPos);
    doc.text(`Rs. ${data.summary.total.toLocaleString()}`, 70, yPos, {
      align: "right",
    });

    /* =======================
       PAYMENT
    ======================= */
    yPos += 6;
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.line(10, yPos, 70, yPos);

    yPos += 4;
    doc.text(
      `Payment: ${data.payment?.method.toUpperCase()} - ${data.payment?.status.toUpperCase()}`,
      40,
      yPos,
      { align: "center" }
    );

    /* =======================
       FOOTER
    ======================= */
    yPos += 8;
    doc.setFontSize(6);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for shopping with us!", 40, yPos, { align: "center" });

    yPos += 3;
    doc.text("support@shoeman.com", 40, yPos, { align: "center" });

    doc.save(`Receipt_${data.orderId}.pdf`);
  };

  return (
    <Tooltip title="Download Receipt" arrow>
      <IconButton
        onClick={downloadReceipt}
        disabled={loading}
        size="small"
        sx={{
          color: "rgba(135, 90, 34, 0.863)",
          border: "1px solid   rgba(135, 90, 34, 0.863)",
          borderRadius: "6px",
          padding: "4px 8px",
          fontSize: "0.75rem",
          "&:hover": {
            backgroundColor: "  rgba(135, 90, 34, 0.863)",
            color: "#fff",
          },
          "&:disabled": {
            opacity: 0.5,
          },
        }}
      >
        {loading ? (
          <CircularProgress size={16} sx={{ color: "#654321" }} />
        ) : (
          <>
            <DownloadIcon sx={{ fontSize: "16px", mr: 0.5 }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>
              Download
            </span>
          </>
        )}
      </IconButton>
    </Tooltip>
  );
};

export default OrderReceipt;
