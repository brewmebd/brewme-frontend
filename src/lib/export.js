import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates a "Beautiful Neobrutalist" PDF datasheet for Earnings.
 * @param {Object} data - The earnings data including chart_data and payouts.
 * @param {Object} profile - User profile info (name, etc).
 */
export const exportEarningsPDF = (data, profile) => {
  const doc = jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  // --- Theme Colors ---
  const YELLOW = [245, 197, 24]; // #F5C518
  const BLACK = [26, 26, 26];     // #1A1A1A
  const LIGHT_YELLOW = [255, 253, 231]; // #FFFDE7

  // --- 1. Header (Neobrutalist Style) ---
  doc.setFillColor(...YELLOW);
  doc.rect(10, 10, 190, 30, "F");
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 30, "D"); 

  doc.setTextColor(...BLACK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("BREWME EARNINGS REPORT", 20, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const date = new Date().toLocaleDateString();
  doc.text(`GENERATED ON: ${date}`, 20, 32);

  // --- 2. Creator Info ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`CREATOR: ${profile?.creator_name || "VALUED CREATOR"}`, 10, 55);
  doc.setLineWidth(0.5);
  doc.line(10, 58, 200, 58);

  // --- 3. Summary Stats (Horizontal Cards) ---
  const stats = [
    { label: "TOTAL EARNED", value: data?.total_earned || "$0.00" },
    { label: "CURRENT BALANCE", value: data?.available_balance || "$0.00" },
    { label: "TOTAL PAYOUTS", value: data?.total_payouts_sum || "$0.00" },
  ];

  let startX = 10;
  stats.forEach((stat) => {
    doc.setFillColor(...LIGHT_YELLOW);
    doc.rect(startX, 65, 60, 25, "F");
    doc.setDrawColor(...BLACK);
    doc.rect(startX, 65, 60, 25, "D");
    
    doc.setFillColor(...BLACK);
    doc.rect(startX + 60, 66, 1.5, 25, "F");
    doc.rect(startX + 1, 90, 60, 1.5, "F");

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(stat.label, startX + 5, 72);

    doc.setFontSize(14);
    doc.setTextColor(...BLACK);
    doc.text(stat.value, startX + 5, 82);

    startX += 65;
  });

  // --- 4. Payout History Table ---
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PAYOUT HISTORY", 10, 110);

  const tableRows = (data?.payouts || []).map(p => [
    p.id,
    `$${p.amount}`,
    p.date,
    p.status.toUpperCase()
  ]);

  autoTable(doc, {
    startY: 115,
    head: [["PAYOUT ID", "AMOUNT", "DATE", "STATUS"]],
    body: tableRows,
    theme: "plain",
    headStyles: {
      fillColor: YELLOW,
      textColor: BLACK,
      fontStyle: "bold",
      lineWidth: 0.5,
      lineColor: BLACK,
    },
    bodyStyles: {
      textColor: BLACK,
      lineWidth: 0.1,
      lineColor: [200, 200, 200],
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    margin: { left: 10, right: 10 },
  });

  // --- 5. Footer ---
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for choosing BrewMe. Keep brewing amazing things!", 105, 280, { align: "center" });

  // Save the PDF
  const filename = `BrewMe_Earnings_${profile?.creator_url || "report"}.pdf`;
  doc.save(filename);
};
