import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Settings,
  Loader2,
  History,
  X,
  Copy,
  Clock,
  Trash2,
  ExternalLink,
  Info,
  FileText,
  Receipt
} from 'lucide-react';
import jsPDF from 'jspdf';

// Form type definition
type FormType = 'requisition' | 'voucher';

// Interface for recent activity tracking
interface RecentActivity {
  id: string;
  formType: FormType;
  serialNumber: string;
  action: 'printed' | 'downloaded';
  timestamp: string;
}

// Official North Beech Ltd logo component using user's uploaded image
const NorthBeechLogo: React.FC<{ className?: string }> = ({ className = "h-14" }) => {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <img
        src="/north_beech_limited_logo.png"
        alt="North Beech Ltd"
        width="120"
        className="max-w-[120px] h-auto object-contain"
        onError={(e) => {
          // Fallback if image path has issue
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

// Pure vector PDF generator for Requisition Form
function createPettyCashRequisitionPdf(serialNumber: string): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const leftMargin = 18;
  const rightMargin = 192;
  const printableWidth = rightMargin - leftMargin; // 174mm

  // 1. Header Banner
  doc.setFillColor(217, 217, 217); // #D9D9D9
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(leftMargin, 16, printableWidth, 9, 'F');
  doc.rect(leftMargin, 16, printableWidth, 9, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('PETTY CASH REQUISITION FORM', leftMargin + 3.5, 22.2);

  // 2. Logo in Top Right
  doc.setFillColor(156, 115, 69);
  doc.rect(162, 30, 2.8, 12, 'F');
  doc.rect(171, 30, 2.8, 12, 'F');
  doc.triangle(162, 30, 174, 42, 171, 42, 'F');
  doc.triangle(162, 30, 165, 30, 174, 42, 'F');

  doc.setFillColor(38, 38, 38);
  doc.rect(175, 30, 2.8, 12, 'F');
  doc.roundedRect(175, 30, 7.5, 6.2, 1.5, 1.5, 'F');
  doc.roundedRect(175, 35.8, 8.2, 6.2, 1.5, 1.5, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(177.8, 31.8, 2.6, 2.6, 'F');
  doc.rect(177.8, 37.6, 3.2, 2.6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(38, 38, 38);
  doc.text('NORTH BEECH LTD', 158, 46.5);

  // 3. Metadata fields on the left
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);

  let currentY = 32;
  const labelWidth = 34;
  const fieldRight = 148;

  // Field: Requisition No:
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Requisition No:', leftMargin, currentY);
  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.text(serialNumber, leftMargin + labelWidth + 2, currentY);
  doc.line(leftMargin + labelWidth, currentY + 1.5, fieldRight, currentY + 1.5);

  // Field: Date:
  currentY += 7.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Date:', leftMargin, currentY);
  doc.line(leftMargin + labelWidth, currentY + 1.5, fieldRight, currentY + 1.5);

  // Field: Requested By:
  currentY += 7.5;
  doc.text('Requested By:', leftMargin, currentY);
  doc.line(leftMargin + labelWidth, currentY + 1.5, fieldRight, currentY + 1.5);

  // Field: Department:
  currentY += 7.5;
  doc.text('Department:', leftMargin, currentY);
  doc.line(leftMargin + labelWidth, currentY + 1.5, fieldRight, currentY + 1.5);

  // Field: Contact Number:
  currentY += 7.5;
  doc.text('Contact Number:', leftMargin, currentY);
  doc.line(leftMargin + labelWidth, currentY + 1.5, fieldRight, currentY + 1.5);

  // 4. Purpose of Expense
  currentY += 13;
  doc.text('Purpose of Expense:', leftMargin, currentY);
  currentY += 6.5;
  doc.line(leftMargin, currentY, rightMargin, currentY);
  currentY += 7.5;
  doc.line(leftMargin, currentY, rightMargin, currentY);

  // 5. Amount Requested & Currency
  currentY += 11;
  doc.text('Amount Requested:', leftMargin, currentY);
  doc.line(leftMargin + 38, currentY + 1.5, 128, currentY + 1.5);

  doc.setFont('helvetica', 'normal');
  doc.text('(Currency:', 134, currentY);
  doc.line(155, currentY + 1.5, 182, currentY + 1.5);
  doc.text(')', 184, currentY);

  // 6. Details of Estimated Expenses Table
  currentY += 11;
  doc.setFont('helvetica', 'bold');
  doc.text('Details of Estimated Expenses:', leftMargin, currentY);
  currentY += 2.5;

  const tableTop = currentY;
  const colSplit = 128;
  const tableHeight = 37.5;

  doc.setLineWidth(0.4);
  doc.rect(leftMargin, tableTop, printableWidth, tableHeight);
  doc.line(leftMargin, tableTop + 7.5, rightMargin, tableTop + 7.5);
  doc.line(colSplit, tableTop, colSplit, tableTop + tableHeight);

  doc.setLineWidth(0.25);
  for (let i = 1; i <= 3; i++) {
    doc.line(leftMargin, tableTop + 7.5 + (i * 7.5), rightMargin, tableTop + 7.5 + (i * 7.5));
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Item Description', leftMargin + 3, tableTop + 5.2);
  doc.text('Estimated Amount', colSplit + 3, tableTop + 5.2);

  currentY = tableTop + tableHeight + 7.5;

  // 7. Total Estimated Amount
  doc.setLineWidth(0.3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Total Estimated Amount:', leftMargin, currentY);
  doc.line(leftMargin + 46, currentY + 1.5, rightMargin, currentY + 1.5);

  // 8. Supporting Documents Attached
  currentY += 11;
  doc.text('Supporting Documents Attached:', leftMargin, currentY);

  currentY += 6.5;
  doc.rect(leftMargin + 1, currentY - 3.4, 3.8, 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text('Purchase Quote', leftMargin + 7.5, currentY);

  currentY += 6.5;
  doc.rect(leftMargin + 1, currentY - 3.4, 3.8, 3.8);
  doc.text('Approval Email', leftMargin + 7.5, currentY);

  currentY += 6.5;
  doc.rect(leftMargin + 1, currentY - 3.4, 3.8, 3.8);
  doc.text('Others:', leftMargin + 7.5, currentY);
  doc.line(leftMargin + 24, currentY + 1.5, rightMargin, currentY + 1.5);

  // 9. Signatures (2 Columns)
  currentY += 15;
  const col1Left = leftMargin;
  const col1Right = 95;
  const col2Left = 112;
  const col2Right = rightMargin;

  doc.setFont('helvetica', 'bold');
  doc.text('Requested By:', col1Left, currentY);
  doc.text('Approval:', col2Left, currentY);

  currentY += 7.5;
  doc.text('Name:', col1Left, currentY);
  doc.line(col1Left + 15, currentY + 1.5, col1Right, currentY + 1.5);
  doc.text('Name:', col2Left, currentY);
  doc.line(col2Left + 15, currentY + 1.5, col2Right, currentY + 1.5);

  currentY += 7.5;
  doc.text('Signature:', col1Left, currentY);
  doc.line(col1Left + 21, currentY + 1.5, col1Right, currentY + 1.5);
  doc.text('Position:', col2Left, currentY);
  doc.line(col2Left + 18, currentY + 1.5, col2Right, currentY + 1.5);

  currentY += 7.5;
  doc.text('Date:', col1Left, currentY);
  doc.line(col1Left + 15, currentY + 1.5, col1Right, currentY + 1.5);
  doc.text('Signature:', col2Left, currentY);
  doc.line(col2Left + 21, currentY + 1.5, col2Right, currentY + 1.5);

  currentY += 7.5;
  doc.text('Date:', col2Left, currentY);
  doc.line(col2Left + 15, currentY + 1.5, col2Right, currentY + 1.5);

  return doc;
}

// Pure vector PDF generator for Voucher Form
function createPettyCashVoucherPdf(serialNumber: string): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const leftMargin = 18;
  const rightMargin = 192;
  const printableWidth = rightMargin - leftMargin; // 174mm

  // 1. Header Banner
  doc.setFillColor(217, 217, 217); // #D9D9D9
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(leftMargin, 16, printableWidth, 9, 'F');
  doc.rect(leftMargin, 16, printableWidth, 9, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('PETTY CASH VOUCHER', leftMargin + 3.5, 22.2);

  // 2. Logo in Top Right
  doc.setFillColor(156, 115, 69);
  doc.rect(162, 30, 2.8, 12, 'F');
  doc.rect(171, 30, 2.8, 12, 'F');
  doc.triangle(162, 30, 174, 42, 171, 42, 'F');
  doc.triangle(162, 30, 165, 30, 174, 42, 'F');

  doc.setFillColor(38, 38, 38);
  doc.rect(175, 30, 2.8, 12, 'F');
  doc.roundedRect(175, 30, 7.5, 6.2, 1.5, 1.5, 'F');
  doc.roundedRect(175, 35.8, 8.2, 6.2, 1.5, 1.5, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(177.8, 31.8, 2.6, 2.6, 'F');
  doc.rect(177.8, 37.6, 3.2, 2.6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(38, 38, 38);
  doc.text('NORTH BEECH LTD', 158, 46.5);

  // 3. Metadata fields
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);

  let currentY = 32;
  const labelWidth = 30;
  const fieldRight = 148;

  // Voucher No:
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Voucher No:', leftMargin, currentY);
  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.text(serialNumber, leftMargin + labelWidth + 2, currentY);
  doc.line(leftMargin + labelWidth, currentY + 1.5, fieldRight, currentY + 1.5);

  // Date:
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Date:', leftMargin, currentY);
  doc.line(leftMargin + labelWidth, currentY + 1.5, fieldRight, currentY + 1.5);

  // Received from: (Petty Cash Custodian):
  currentY += 8;
  doc.text('Received from: (Petty Cash Custodian):', leftMargin, currentY);
  doc.line(leftMargin + 72, currentY + 1.5, rightMargin, currentY + 1.5);

  // Payee Name:
  currentY += 12;
  doc.text('Payee Name:', leftMargin, currentY);
  doc.line(leftMargin + 26, currentY + 1.5, rightMargin, currentY + 1.5);

  // Purpose of Expense:
  currentY += 12;
  doc.text('Purpose of Expense:', leftMargin, currentY);
  doc.line(leftMargin + 40, currentY + 1.5, rightMargin, currentY + 1.5);
  currentY += 8;
  doc.line(leftMargin, currentY, rightMargin, currentY);

  // Details of Expense Table
  currentY += 12;
  doc.text('Details of Expense:', leftMargin, currentY);
  currentY += 2.5;

  const tableTop = currentY;
  const col1W = 78; // Item Description
  const col2W = 28; // Quantity
  const col3W = 32; // Unit Price
  const col4W = 36; // Amount
  const tableHeight = 37.5;

  const col1X = leftMargin;
  const col2X = col1X + col1W;
  const col3X = col2X + col2W;
  const col4X = col3X + col3W;

  doc.setLineWidth(0.4);
  doc.rect(leftMargin, tableTop, printableWidth, tableHeight);
  doc.line(leftMargin, tableTop + 7.5, rightMargin, tableTop + 7.5);

  // Vertical column dividers
  doc.line(col2X, tableTop, col2X, tableTop + tableHeight);
  doc.line(col3X, tableTop, col3X, tableTop + tableHeight);
  doc.line(col4X, tableTop, col4X, tableTop + tableHeight);

  // Inner rows
  doc.setLineWidth(0.25);
  for (let i = 1; i <= 3; i++) {
    doc.line(leftMargin, tableTop + 7.5 + (i * 7.5), rightMargin, tableTop + 7.5 + (i * 7.5));
  }

  // Header text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Item Description', col1X + 3, tableTop + 5.2);
  doc.text('Quantity', col2X + 3, tableTop + 5.2);
  doc.text('Unit Price', col3X + 3, tableTop + 5.2);
  doc.text('Amount', col4X + 3, tableTop + 5.2);

  currentY = tableTop + tableHeight + 8;

  // Total Amount:
  doc.setLineWidth(0.3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Total Amount:', leftMargin, currentY);
  doc.line(leftMargin + 28, currentY + 1.5, 120, currentY + 1.5);

  // Mode of Payment
  currentY += 10;
  doc.text('Mode of Payment:', leftMargin, currentY);
  
  // [ ] Cash
  doc.rect(leftMargin + 38, currentY - 3.4, 3.8, 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text('Cash', leftMargin + 44, currentY);
  doc.line(leftMargin + 54, currentY + 1.5, leftMargin + 70, currentY + 1.5);

  // [ ] Reimbursed
  doc.rect(leftMargin + 74, currentY - 3.4, 3.8, 3.8);
  doc.text('Reimbursed', leftMargin + 80, currentY);
  doc.line(leftMargin + 104, currentY + 1.5, leftMargin + 120, currentY + 1.5);

  // [ ] Other:
  doc.rect(leftMargin + 124, currentY - 3.4, 3.8, 3.8);
  doc.text('Other:', leftMargin + 130, currentY);
  doc.line(leftMargin + 143, currentY + 1.5, rightMargin, currentY + 1.5);

  // Approvals & Receipts (2 Columns)
  currentY += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Approved By:', leftMargin, currentY);
  doc.line(leftMargin + 28, currentY + 1.5, 110, currentY + 1.5);
  doc.text('Date:', 120, currentY);
  doc.line(132, currentY + 1.5, rightMargin, currentY + 1.5);

  currentY += 8;
  doc.text('Received By:', leftMargin, currentY);
  doc.line(leftMargin + 28, currentY + 1.5, 110, currentY + 1.5);
  doc.text('Date:', 120, currentY);
  doc.line(132, currentY + 1.5, rightMargin, currentY + 1.5);

  // Attachments
  currentY += 10;
  doc.text('Attachments (Receipts):', leftMargin, currentY);
  doc.rect(leftMargin + 47, currentY - 3.4, 3.8, 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text('Yes', leftMargin + 53, currentY);
  doc.line(leftMargin + 61, currentY + 1.5, leftMargin + 72, currentY + 1.5);

  doc.rect(leftMargin + 75, currentY - 3.4, 3.8, 3.8);
  doc.text('No', leftMargin + 81, currentY);

  // Remarks
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Remarks:', leftMargin, currentY);
  doc.line(leftMargin + 20, currentY + 1.5, rightMargin, currentY + 1.5);

  // Full-width divider line
  currentY += 14;
  doc.setLineWidth(0.4);
  doc.line(leftMargin, currentY, rightMargin, currentY);

  // Signatures
  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('(Signature of Payee)', leftMargin, currentY);
  doc.line(leftMargin + 32, currentY + 1.5, 80, currentY + 1.5);

  doc.line(140, currentY + 1.5, 155, currentY + 1.5);
  doc.text('(Signature of Approver)', 156, currentY);

  return doc;
}

export default function App() {
  // Active form type: 'requisition' or 'voucher'
  const [activeFormType, setActiveFormType] = useState<FormType>(() => {
    const saved = localStorage.getItem('nb_active_form_type');
    return (saved === 'voucher' ? 'voucher' : 'requisition') as FormType;
  });

  // Separate serial sequence counters for each form type
  const [requisitionNumber, setRequisitionNumber] = useState<number>(() => {
    const saved = localStorage.getItem('nb_requisition_number');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [voucherNumber, setVoucherNumber] = useState<number>(() => {
    const saved = localStorage.getItem('nb_voucher_number');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Recent activity log: tracks last 5 printed or downloaded vouchers/requisitions
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(() => {
    const saved = localStorage.getItem('nb_requisition_recent_history');
    if (saved) {
      try {
        return JSON.parse(saved).slice(0, 5);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastGeneratedPdfUrl, setLastGeneratedPdfUrl] = useState<string | null>(null);
  const [lastGeneratedSerial, setLastGeneratedSerial] = useState<string | null>(null);

  // Active serial number based on form type
  const currentNumber = activeFormType === 'requisition' ? requisitionNumber : voucherNumber;

  const setCurrentNumber = (num: number) => {
    if (activeFormType === 'requisition') {
      setRequisitionNumber(num);
    } else {
      setVoucherNumber(num);
    }
  };

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('nb_active_form_type', activeFormType);
  }, [activeFormType]);

  useEffect(() => {
    localStorage.setItem('nb_requisition_number', requisitionNumber.toString());
  }, [requisitionNumber]);

  useEffect(() => {
    localStorage.setItem('nb_voucher_number', voucherNumber.toString());
  }, [voucherNumber]);

  useEffect(() => {
    localStorage.setItem('nb_requisition_recent_history', JSON.stringify(recentActivity));
  }, [recentActivity]);

  // Format serial number as R0000-XXXX for requisition and V0000-XXXX for voucher
  const formatSerial = (num: number, formType: FormType = activeFormType): string => {
    const prefix = formType === 'requisition' ? 'R0000-' : 'V0000-';
    const padded = String(num).padStart(4, '0');
    return `${prefix}${padded}`;
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Add entry to recent activity (capped at 5 items)
  const trackActivity = (serial: string, action: 'printed' | 'downloaded') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const newEntry: RecentActivity = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      formType: activeFormType,
      serialNumber: serial,
      action,
      timestamp: `${dateStr}, ${timeStr}`
    };

    setRecentActivity(prev => [newEntry, ...prev].slice(0, 5));
  };

  // Print function: triggers print, downloads backup PDF, and advances sequence
  const handlePrint = () => {
    const printedNumber = currentNumber;
    const printedText = formatSerial(printedNumber);
    const nextNumber = printedNumber + 1;
    const nextText = formatSerial(nextNumber);

    const doc = activeFormType === 'requisition'
      ? createPettyCashRequisitionPdf(printedText)
      : createPettyCashVoucherPdf(printedText);

    try {
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      setLastGeneratedPdfUrl(blobUrl);
      setLastGeneratedSerial(printedText);

      const fileName = activeFormType === 'requisition'
        ? `Petty-Cash-Requisition-${printedText}.pdf`
        : `Petty-Cash-Voucher-${printedText}.pdf`;

      doc.save(fileName);
    } catch (e) {
      console.warn('PDF generation error:', e);
    }

    try {
      window.print();
    } catch (err) {
      console.warn('Native window.print() was blocked by browser sandbox:', err);
    }

    trackActivity(printedText, 'printed');
    setCurrentNumber(nextNumber);

    const formLabel = activeFormType === 'requisition' ? 'Requisition' : 'Voucher';
    showNotification(`${formLabel} ${printedText} printed! File saved to Downloads • Next: ${nextText}`);
  };

  // Direct Vector PDF Download
  const handleDownloadPdf = () => {
    setIsProcessing(true);
    const printedNumber = currentNumber;
    const printedText = formatSerial(printedNumber);
    const nextNumber = printedNumber + 1;
    const nextText = formatSerial(nextNumber);

    try {
      const doc = activeFormType === 'requisition'
        ? createPettyCashRequisitionPdf(printedText)
        : createPettyCashVoucherPdf(printedText);

      const fileName = activeFormType === 'requisition'
        ? `Petty-Cash-Requisition-${printedText}.pdf`
        : `Petty-Cash-Voucher-${printedText}.pdf`;

      doc.save(fileName);

      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      setLastGeneratedPdfUrl(blobUrl);
      setLastGeneratedSerial(printedText);

      trackActivity(printedText, 'downloaded');
      setCurrentNumber(nextNumber);

      const formLabel = activeFormType === 'requisition' ? 'Requisition' : 'Voucher';
      showNotification(`Saved PDF for ${formLabel} ${printedText} • Next: ${nextText}`);
    } catch (error) {
      console.error('PDF generation error:', error);
      showNotification('Failed to generate PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-download past serial number from history modal
  const handleRedownload = (item: RecentActivity) => {
    try {
      const doc = item.formType === 'voucher'
        ? createPettyCashVoucherPdf(item.serialNumber)
        : createPettyCashRequisitionPdf(item.serialNumber);

      const fileName = item.formType === 'voucher'
        ? `Petty-Cash-Voucher-${item.serialNumber}.pdf`
        : `Petty-Cash-Requisition-${item.serialNumber}.pdf`;

      doc.save(fileName);
      showNotification(`Downloaded PDF for ${item.serialNumber}`);
    } catch (err) {
      console.error(err);
      showNotification(`Error downloading ${item.serialNumber}`);
    }
  };

  // Copy serial number to clipboard
  const handleCopySerial = (serial: string) => {
    navigator.clipboard.writeText(serial);
    showNotification(`Copied ${serial} to clipboard`);
  };

  // Keyboard shortcut Ctrl+P or Cmd+P and Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      } else if (e.key === 'Escape') {
        setShowHistoryModal(false);
        setShowSettings(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentNumber, activeFormType]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-2xl border border-slate-700 text-sm flex items-center space-x-2 animate-in fade-in duration-200 no-print max-w-md">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Streamlined Top Control Bar (Hidden on print) */}
      <header className="no-print w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand & Form Switcher */}
          <div className="flex items-center space-x-3">
            <div className="font-bold text-slate-900 text-base tracking-tight hidden md:inline">
              North Beech Ltd
            </div>
            <span className="text-slate-300 hidden md:inline">|</span>

            {/* Form Toggle Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300">
              <button
                onClick={() => {
                  setActiveFormType('requisition');
                  showNotification('Switched to Petty Cash Requisition Form');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeFormType === 'requisition'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Requisition Form</span>
              </button>

              <button
                onClick={() => {
                  setActiveFormType('voucher');
                  showNotification('Switched to Petty Cash Voucher Form');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeFormType === 'voucher'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Voucher Form</span>
              </button>
            </div>
          </div>

          {/* Controls: Counter & Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Incremental Number Box */}
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg px-2.5 sm:px-3 py-1.5 space-x-2">
              <span className="text-xs text-slate-500 font-medium">
                {activeFormType === 'requisition' ? 'Requisition No:' : 'Voucher No:'}
              </span>
              <span className="font-mono font-extrabold text-blue-700 text-sm tracking-wider">
                {formatSerial(currentNumber)}
              </span>

              {/* Quick Stepper Buttons */}
              <div className="flex items-center space-x-1 pl-1.5 border-l border-slate-200">
                <button
                  onClick={() => {
                    if (currentNumber > 1) {
                      setCurrentNumber(currentNumber - 1);
                    }
                  }}
                  disabled={currentNumber <= 1}
                  className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                  title="Previous number (-1)"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCurrentNumber(currentNumber + 1)}
                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                  title="Next number (+1)"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Settings toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer transition-colors"
                title="Change or reset sequence number"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recent Activity Button */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-sm font-medium px-2.5 sm:px-3 py-2 rounded-lg border border-slate-300 flex items-center space-x-1.5 cursor-pointer transition-colors"
              title="View last 5 printed or downloaded requisition / voucher numbers"
            >
              <History className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Recent</span>
              {recentActivity.length > 0 && (
                <span className="bg-blue-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full leading-tight">
                  {recentActivity.length}
                </span>
              )}
            </button>

            {/* Direct Print Button */}
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm px-3.5 sm:px-5 py-2 rounded-lg shadow-sm flex items-center space-x-1.5 sm:space-x-2 cursor-pointer transition-colors"
              title="Print document and download PDF backup"
            >
              <Printer className="w-4 h-4" />
              <span>Print Page</span>
            </button>

            {/* Direct Vector PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isProcessing}
              className="bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-medium text-sm px-3 py-2 rounded-lg shadow-sm flex items-center space-x-1.5 cursor-pointer transition-colors disabled:opacity-50"
              title="Download vector PDF directly"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-300" />
                  <span className="hidden sm:inline">Save PDF</span>
                </>
              )}
            </button>

            {/* Open in Full Window for Direct Native Browser Printing */}
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-2 rounded-lg transition-colors cursor-pointer"
              title="Open full page in new tab for standard browser printer dialog"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Tab</span>
            </a>
          </div>
        </div>

        {/* Dropdown to adjust number if needed */}
        {showSettings && (
          <div className="border-t border-slate-200 bg-slate-50 py-2.5 px-4 animate-in fade-in">
            <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-3">
                <span>
                  Set next {activeFormType === 'requisition' ? 'requisition' : 'voucher'} number:
                </span>
                <input
                  type="number"
                  min="1"
                  value={currentNumber}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1) {
                      setCurrentNumber(val);
                    }
                  }}
                  className="w-24 bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    const resetCode = activeFormType === 'requisition' ? 'R0000-0001' : 'V0000-0001';
                    setCurrentNumber(1);
                    showNotification(`Reset sequence to ${resetCode}`);
                    setShowSettings(false);
                  }}
                  className="text-slate-500 hover:text-rose-600 flex items-center space-x-1 cursor-pointer ml-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to {activeFormType === 'requisition' ? 'R0000-0001' : 'V0000-0001'}</span>
                </button>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Helpful Status Bar if Print was initiated */}
      {lastGeneratedSerial && (
        <div className="no-print w-full max-w-5xl px-4 pt-3">
          <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                {activeFormType === 'requisition' ? 'Requisition' : 'Voucher'}{' '}
                <strong>{lastGeneratedSerial}</strong> was generated! Check your browser&apos;s{' '}
                <strong>Downloads</strong> folder.
              </span>
            </div>
            <div className="flex items-center space-x-2 self-end sm:self-center">
              {lastGeneratedPdfUrl && (
                <a
                  href={lastGeneratedPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 font-semibold underline flex items-center space-x-1"
                >
                  <span>Open PDF in Tab to Print</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Container: Centered Paper Preview */}
      <main className="w-full flex-1 flex justify-center py-6 px-4 sm:px-6">
        {activeFormType === 'requisition' ? (
          /* ========================================================================= */
          /* FORM 1: PETTY CASH REQUISITION FORM                                      */
          /* ========================================================================= */
          <div
            id="requisition-paper-sheet"
            className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-2xl border border-slate-200 rounded-xs flex flex-col justify-between box-border"
            style={{
              fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
              color: '#000000',
              backgroundColor: '#ffffff'
            }}
          >
            <div>
              {/* Header Banner */}
              <div
                className="text-black font-bold text-[14px] sm:text-[15px] uppercase tracking-wide py-2 px-3"
                style={{
                  backgroundColor: '#D9D9D9',
                  border: '1px solid rgba(0,0,0,0.15)'
                }}
              >
                PETTY CASH REQUISITION FORM
              </div>

              {/* Requisition No, Metadata and Logo */}
              <div className="mt-5 flex flex-row justify-between items-start gap-6">
                {/* Left Column: Form Fields */}
                <div className="flex-1 space-y-2.5 text-[13px]">
                  {/* Requisition No */}
                  <div className="flex items-end">
                    <span className="font-semibold text-black whitespace-nowrap min-w-[125px]">
                      Requisition No:
                    </span>
                    <div
                      className="flex-1 pb-0.5 px-2 flex items-baseline justify-between min-h-[22px]"
                      style={{ borderBottom: '1px solid #000000' }}
                    >
                      <span className="text-[15px] font-mono font-bold tracking-wider text-black">
                        {formatSerial(currentNumber)}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-end">
                    <span className="font-semibold text-black whitespace-nowrap min-w-[125px]">
                      Date:
                    </span>
                    <div
                      className="flex-1 pb-0.5 px-2 min-h-[22px]"
                      style={{ borderBottom: '1px solid #000000' }}
                    ></div>
                  </div>

                  {/* Requested By */}
                  <div className="flex items-end">
                    <span className="font-semibold text-black whitespace-nowrap min-w-[125px]">
                      Requested By:
                    </span>
                    <div
                      className="flex-1 pb-0.5 px-2 min-h-[22px]"
                      style={{ borderBottom: '1px solid #000000' }}
                    ></div>
                  </div>

                  {/* Department */}
                  <div className="flex items-end">
                    <span className="font-semibold text-black whitespace-nowrap min-w-[125px]">
                      Department:
                    </span>
                    <div
                      className="flex-1 pb-0.5 px-2 min-h-[22px]"
                      style={{ borderBottom: '1px solid #000000' }}
                    ></div>
                  </div>

                  {/* Contact Number */}
                  <div className="flex items-end">
                    <span className="font-semibold text-black whitespace-nowrap min-w-[125px]">
                      Contact Number:
                    </span>
                    <div
                      className="flex-1 pb-0.5 px-2 min-h-[22px]"
                      style={{ borderBottom: '1px solid #000000' }}
                    ></div>
                  </div>
                </div>

                {/* Right Column: Official North Beech Ltd Monogram */}
                <div className="w-[145px] sm:w-[165px] pt-1 flex justify-end">
                  <NorthBeechLogo />
                </div>
              </div>

              {/* Purpose of Expense */}
              <div className="mt-6 text-[13px]">
                <div className="font-semibold text-black mb-1">Purpose of Expense:</div>
                <div style={{ borderBottom: '1px solid #000000', minHeight: '26px' }}></div>
                <div style={{ borderBottom: '1px solid #000000', minHeight: '26px', marginTop: '6px' }}></div>
              </div>

              {/* Amount Requested & Currency */}
              <div className="mt-6 flex items-end justify-between text-[13px]">
                <div className="flex items-end flex-1 max-w-[65%]">
                  <span className="font-semibold text-black whitespace-nowrap mr-2">
                    Amount Requested:
                  </span>
                  <div
                    className="flex-1 pb-0.5 px-2 min-h-[22px]"
                    style={{ borderBottom: '1px solid #000000' }}
                  ></div>
                </div>
                <div className="flex items-end ml-4">
                  <span className="text-black whitespace-nowrap mr-1 font-medium">
                    (Currency:
                  </span>
                  <div
                    className="w-24 pb-0.5 text-center min-h-[22px]"
                    style={{ borderBottom: '1px solid #000000' }}
                  ></div>
                  <span className="text-black ml-1">)</span>
                </div>
              </div>

              {/* Details of Estimated Expenses Table */}
              <div className="mt-6">
                <div className="font-semibold text-[13px] text-black mb-1.5">
                  Details of Estimated Expenses:
                </div>
                <div style={{ border: '2px solid #000000', width: '100%' }}>
                  <div
                    className="grid grid-cols-12 font-bold text-[13px]"
                    style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #000000' }}
                  >
                    <div
                      className="col-span-8 p-2"
                      style={{ borderRight: '2px solid #000000' }}
                    >
                      Item Description
                    </div>
                    <div className="col-span-4 p-2">
                      Estimated Amount
                    </div>
                  </div>

                  {[1, 2, 3, 4].map((rowIdx) => (
                    <div
                      key={rowIdx}
                      className="grid grid-cols-12 min-h-[30px] text-[13px]"
                      style={{ borderBottom: rowIdx === 4 ? 'none' : '1px solid #000000' }}
                    >
                      <div
                        className="col-span-8 p-2"
                        style={{ borderRight: '2px solid #000000' }}
                      ></div>
                      <div className="col-span-4 p-2"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Estimated Amount */}
              <div className="mt-5 flex items-end text-[13px]">
                <span className="font-semibold text-black whitespace-nowrap mr-2">
                  Total Estimated Amount:
                </span>
                <div
                  className="flex-1 pb-0.5 px-2 min-h-[22px]"
                  style={{ borderBottom: '1px solid #000000' }}
                ></div>
              </div>

              {/* Supporting Documents Attached */}
              <div className="mt-6 text-[13px] space-y-2.5">
                <div className="font-semibold text-black">
                  Supporting Documents Attached:
                </div>

                <div className="flex items-center space-x-2.5 pl-1">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '1px solid #000000',
                      backgroundColor: '#ffffff'
                    }}
                  ></span>
                  <span>Purchase Quote</span>
                </div>

                <div className="flex items-center space-x-2.5 pl-1">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '1px solid #000000',
                      backgroundColor: '#ffffff'
                    }}
                  ></span>
                  <span>Approval Email</span>
                </div>

                <div className="flex items-end space-x-2.5 pl-1">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '1px solid #000000',
                      backgroundColor: '#ffffff'
                    }}
                  ></span>
                  <span className="whitespace-nowrap">Others:</span>
                  <div
                    className="flex-1 pb-0.5 px-2 min-h-[20px]"
                    style={{ borderBottom: '1px solid #000000' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bottom Signatures Section (2 Columns) */}
            <div className="mt-12 pt-6 grid grid-cols-2 gap-10 text-[13px]">
              <div className="space-y-3">
                <div className="font-semibold text-black mb-1">Requested By:</div>
                <div className="flex items-end">
                  <span className="font-medium text-black min-w-[75px]">Name:</span>
                  <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                </div>
                <div className="flex items-end">
                  <span className="font-medium text-black min-w-[75px]">Signature:</span>
                  <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                </div>
                <div className="flex items-end">
                  <span className="font-medium text-black min-w-[75px]">Date:</span>
                  <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-semibold text-black mb-1">Approval:</div>
                <div className="flex items-end">
                  <span className="font-medium text-black min-w-[75px]">Name:</span>
                  <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                </div>
                <div className="flex items-end">
                  <span className="font-medium text-black min-w-[75px]">Position:</span>
                  <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                </div>
                <div className="flex items-end">
                  <span className="font-medium text-black min-w-[75px]">Signature:</span>
                  <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                </div>
                <div className="flex items-end">
                  <span className="font-medium text-black min-w-[75px]">Date:</span>
                  <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* FORM 2: PETTY CASH VOUCHER                                               */
          /* ========================================================================= */
          <div
            id="requisition-paper-sheet"
            className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-2xl border border-slate-200 rounded-xs flex flex-col justify-between box-border"
            style={{
              fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
              color: '#000000',
              backgroundColor: '#ffffff'
            }}
          >
            <div>
              {/* Header Banner */}
              <div
                className="text-black font-bold text-[14px] sm:text-[15px] uppercase tracking-wide py-2 px-3"
                style={{
                  backgroundColor: '#D9D9D9',
                  border: '1px solid rgba(0,0,0,0.15)'
                }}
              >
                PETTY CASH VOUCHER
              </div>

              {/* Voucher No, Date, Custodian, and Logo */}
              <div className="mt-5 flex flex-row justify-between items-start gap-6">
                {/* Left Fields */}
                <div className="flex-1 space-y-3 text-[13px]">
                  {/* Voucher No */}
                  <div className="flex items-end">
                    <span className="font-semibold text-black whitespace-nowrap min-w-[110px]">
                      Voucher No:
                    </span>
                    <div
                      className="flex-1 pb-0.5 px-2 flex items-baseline justify-between min-h-[22px]"
                      style={{ borderBottom: '1px solid #000000' }}
                    >
                      <span className="text-[15px] font-mono font-bold tracking-wider text-black">
                        {formatSerial(currentNumber)}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-end">
                    <span className="font-semibold text-black whitespace-nowrap min-w-[110px]">
                      Date:
                    </span>
                    <div
                      className="flex-1 pb-0.5 px-2 min-h-[22px]"
                      style={{ borderBottom: '1px solid #000000' }}
                    ></div>
                  </div>

                  {/* Received from: (Petty Cash Custodian): */}
                  <div className="flex items-end">
                    <span className="font-semibold text-black whitespace-nowrap">
                      Received from: (Petty Cash Custodian):
                    </span>
                    <div
                      className="flex-1 pb-0.5 px-2 min-h-[22px]"
                      style={{ borderBottom: '1px solid #000000' }}
                    ></div>
                  </div>
                </div>

                {/* Right Logo */}
                <div className="w-[145px] sm:w-[165px] pt-1 flex justify-end">
                  <NorthBeechLogo />
                </div>
              </div>

              {/* Payee Name */}
              <div className="mt-5 flex items-end text-[13px]">
                <span className="font-semibold text-black whitespace-nowrap mr-2">
                  Payee Name:
                </span>
                <div
                  className="flex-1 pb-0.5 px-2 min-h-[22px]"
                  style={{ borderBottom: '1px solid #000000' }}
                ></div>
              </div>

              {/* Purpose of Expense */}
              <div className="mt-5 text-[13px]">
                <div className="flex items-end">
                  <span className="font-semibold text-black whitespace-nowrap mr-2">
                    Purpose of Expense:
                  </span>
                  <div
                    className="flex-1 pb-0.5 px-2 min-h-[22px]"
                    style={{ borderBottom: '1px solid #000000' }}
                  ></div>
                </div>
                <div style={{ borderBottom: '1px solid #000000', minHeight: '26px', marginTop: '6px' }}></div>
              </div>

              {/* Details of Expense Table */}
              <div className="mt-6">
                <div className="font-semibold text-[13px] text-black mb-1.5">
                  Details of Expense:
                </div>
                <div style={{ border: '2px solid #000000', width: '100%' }}>
                  <div
                    className="grid grid-cols-12 font-bold text-[13px]"
                    style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #000000' }}
                  >
                    <div
                      className="col-span-6 p-2"
                      style={{ borderRight: '2px solid #000000' }}
                    >
                      Item Description
                    </div>
                    <div
                      className="col-span-2 p-2 text-center"
                      style={{ borderRight: '2px solid #000000' }}
                    >
                      Quantity
                    </div>
                    <div
                      className="col-span-2 p-2 text-center"
                      style={{ borderRight: '2px solid #000000' }}
                    >
                      Unit Price
                    </div>
                    <div className="col-span-2 p-2 text-right">
                      Amount
                    </div>
                  </div>

                  {[1, 2, 3, 4].map((rowIdx) => (
                    <div
                      key={rowIdx}
                      className="grid grid-cols-12 min-h-[30px] text-[13px]"
                      style={{ borderBottom: rowIdx === 4 ? 'none' : '1px solid #000000' }}
                    >
                      <div
                        className="col-span-6 p-2"
                        style={{ borderRight: '2px solid #000000' }}
                      ></div>
                      <div
                        className="col-span-2 p-2"
                        style={{ borderRight: '2px solid #000000' }}
                      ></div>
                      <div
                        className="col-span-2 p-2"
                        style={{ borderRight: '2px solid #000000' }}
                      ></div>
                      <div className="col-span-2 p-2"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="mt-5 flex items-end text-[13px]">
                <span className="font-semibold text-black whitespace-nowrap mr-2">
                  Total Amount:
                </span>
                <div
                  className="w-72 pb-0.5 px-2 min-h-[22px]"
                  style={{ borderBottom: '1px solid #000000' }}
                ></div>
              </div>

              {/* Mode of Payment */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-[13px]">
                <span className="font-semibold text-black">Mode of Payment:</span>

                <div className="flex items-center space-x-1.5">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '1px solid #000000',
                      backgroundColor: '#ffffff'
                    }}
                  ></span>
                  <span>Cash</span>
                  <div className="w-16 ml-1" style={{ borderBottom: '1px solid #000000', minHeight: '16px' }}></div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '1px solid #000000',
                      backgroundColor: '#ffffff'
                    }}
                  ></span>
                  <span>Reimbursed</span>
                  <div className="w-16 ml-1" style={{ borderBottom: '1px solid #000000', minHeight: '16px' }}></div>
                </div>

                <div className="flex items-center space-x-1.5 flex-1 min-w-[200px]">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '1px solid #000000',
                      backgroundColor: '#ffffff'
                    }}
                  ></span>
                  <span>Other:</span>
                  <div className="flex-1 ml-1" style={{ borderBottom: '1px solid #000000', minHeight: '16px' }}></div>
                </div>
              </div>

              {/* Approvals & Receipts (2 Columns) */}
              <div className="mt-5 grid grid-cols-2 gap-8 text-[13px]">
                <div className="space-y-3">
                  <div className="flex items-end">
                    <span className="font-semibold text-black min-w-[95px]">Approved By:</span>
                    <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                  </div>
                  <div className="flex items-end">
                    <span className="font-semibold text-black min-w-[95px]">Received By:</span>
                    <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-end">
                    <span className="font-semibold text-black min-w-[50px]">Date:</span>
                    <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                  </div>
                  <div className="flex items-end">
                    <span className="font-semibold text-black min-w-[50px]">Date:</span>
                    <div className="flex-1 pb-0.5 px-1 min-h-[20px]" style={{ borderBottom: '1px solid #000000' }}></div>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-5 flex items-center space-x-4 text-[13px]">
                <span className="font-semibold text-black">Attachments (Receipts):</span>
                <div className="flex items-center space-x-1.5">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '1px solid #000000',
                      backgroundColor: '#ffffff'
                    }}
                  ></span>
                  <span>Yes</span>
                  <div className="w-14 ml-1" style={{ borderBottom: '1px solid #000000', minHeight: '16px' }}></div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '1px solid #000000',
                      backgroundColor: '#ffffff'
                    }}
                  ></span>
                  <span>No</span>
                </div>
              </div>

              {/* Remarks */}
              <div className="mt-5 flex items-end text-[13px]">
                <span className="font-semibold text-black whitespace-nowrap mr-2">
                  Remarks:
                </span>
                <div
                  className="flex-1 pb-0.5 px-2 min-h-[22px]"
                  style={{ borderBottom: '1px solid #000000' }}
                ></div>
              </div>
            </div>

            {/* Bottom Signatures Section with Divider Line */}
            <div className="mt-12 pt-4 text-[13px]">
              <div style={{ borderBottom: '1px solid #000000', width: '100%', marginBottom: '14px' }}></div>
              <div className="flex justify-between items-center text-slate-800 text-[12px] sm:text-[13px]">
                <div className="flex items-center space-x-1">
                  <span>(Signature of Payee)</span>
                  <div className="w-24 border-b border-black"></div>
                </div>

                <div className="flex items-center space-x-1">
                  <div className="w-20 border-b border-black"></div>
                  <span>(Signature of Approver)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* RECENT ACTIVITY MODAL (Hidden on print) */}
      {/* ========================================================================= */}
      {showHistoryModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Recent Requisitions &amp; Vouchers
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: List of Last 5 Numbers */}
            <div className="p-5">
              <p className="text-xs text-slate-500 mb-3">
                Tracking the last 5 printed or downloaded documents:
              </p>

              {recentActivity.length === 0 ? (
                <div className="py-8 text-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">No recent activity yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Print or save a requisition or voucher to track numbers here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentActivity.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-400 w-4">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-extrabold text-blue-700 text-sm tracking-wide">
                              {item.serialNumber}
                            </span>
                            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                              {item.formType === 'voucher' ? 'Voucher' : 'Requisition'}
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                                item.action === 'printed'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {item.action === 'printed' ? 'Printed' : 'PDF Saved'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleCopySerial(item.serialNumber)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          title="Copy number"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRedownload(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          title="Download this document PDF again"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              {recentActivity.length > 0 ? (
                <button
                  onClick={() => {
                    setRecentActivity([]);
                    showNotification('Recent activity history cleared');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center space-x-1 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear List</span>
                </button>
              ) : (
                <div></div>
              )}
              <button
                onClick={() => setShowHistoryModal(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
