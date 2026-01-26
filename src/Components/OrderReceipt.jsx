import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { generateReceipt } from "../DAL/fetch"; // adjust path if needed

const OrderReceipt = ({ orderId }) => {
  const [loading, setLoading] = useState(false);

  const downloadReceipt = async () => {
    setLoading(true);

    try {
      const result = await generateReceipt(orderId);

      console.log("RECEIPT RESPONSE 👉", result);

      // ✅ result has: { success, data }
      if (!result?.success || !result?.data) {
        throw new Error("Invalid receipt response");
      }

      generatePDF(result.data);
    } catch (error) {
      console.error("DOWNLOAD ERROR 👉", error);
      alert(error.message || "Error while downloading receipt");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();

    /* =======================
       COMPANY HEADER
    ======================= */
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(data.company?.name || "Company Name", 105, 20, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(data.company?.address || "", 105, 28, { align: "center" });
    doc.text(`Phone: ${data.company?.phone || ""}`, 105, 34, {
      align: "center",
    });
    doc.text(data.company?.website || "", 105, 40, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    /* =======================
       ORDER HEADER
    ======================= */
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER RECEIPT", 105, 55, { align: "center" });

    const orderDate = data.date
      ? new Date(data.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${data.orderId}`, 20, 65);
    doc.text(`Date: ${orderDate}`, 20, 71);
    doc.text(`Status: ${data.status?.toUpperCase()}`, 20, 77);

    /* =======================
       CUSTOMER DETAILS
    ======================= */
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 20, 87);

    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${data.customer?.name}`, 20, 93);
    doc.text(`Email: ${data.customer?.email}`, 20, 99);
    doc.text(`Phone: ${data.customer?.phone}`, 20, 105);

    const addressLines = doc.splitTextToSize(
      `Address: ${data.customer?.address || ""}`,
      170
    );
    doc.text(addressLines, 20, 111);

    /* =======================
       ITEMS TABLE
    ======================= */
    const tableData =
      data.items?.map((item) => [
        item.description,
        item.sku,
        item.quantity,
        `Rs. ${item.unitPrice.toLocaleString()}`,
        `Rs. ${item.total.toLocaleString()}`,
      ]) || [];

    if (!tableData.length) {
      throw new Error("No items found in receipt");
    }

    autoTable(doc, {
      startY: 125,
      head: [["Description", "SKU", "Qty", "Unit Price", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 35 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 35, halign: "right" },
        4: { cellWidth: 35, halign: "right" },
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    const summary = data.summary;

    /* =======================
       SUMMARY
    ======================= */
    doc.setFontSize(10);
    doc.text("Subtotal:", 140, finalY);
    doc.text(`Rs. ${summary.subtotal.toLocaleString()}`, 185, finalY, {
      align: "right",
    });

    doc.text("Tax:", 140, finalY + 6);
    doc.text(`Rs. ${summary.tax.toLocaleString()}`, 185, finalY + 6, {
      align: "right",
    });

    doc.text("Shipping:", 140, finalY + 12);
    doc.text(`Rs. ${summary.shipping.toLocaleString()}`, 185, finalY + 12, {
      align: "right",
    });

    doc.setLineWidth(0.3);
    doc.line(140, finalY + 16, 190, finalY + 16);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL:", 140, finalY + 22);
    doc.text(`Rs. ${summary.total.toLocaleString()}`, 185, finalY + 22, {
      align: "right",
    });

    /* =======================
       PAYMENT INFO
    ======================= */
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT INFORMATION", 20, finalY);

    doc.setFont("helvetica", "normal");
    doc.text(
      `Method: ${data.payment?.method.toUpperCase()}`,
      20,
      finalY + 6
    );
    doc.text(
      `Status: ${data.payment?.status.toUpperCase()}`,
      20,
      finalY + 12
    );

    /* =======================
       FOOTER
    ======================= */
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your business!", 105, 280, {
      align: "center",
    });
    doc.text(
      "For any queries, contact us at support@shoeman.com",
      105,
      285,
      { align: "center" }
    );

    doc.save(`Order_Receipt_${data.orderId}.pdf`);
  };

  return (
    <button
      onClick={downloadReceipt}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        fontSize: "0.85rem",
        fontWeight: 500,
        color: "var(--primary-color)",
        border: "1px solid var(--primary-color)",
        background: "#fff",
        borderRadius: "6px",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Generating..." : "📄 Receipt"}
    </button>
  );
};

export default OrderReceipt;
