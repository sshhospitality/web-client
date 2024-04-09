import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {formatDate} from './date_format';


export const exportPDF = (txn) => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    // eslint-disable-next-line new-cap
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = 'Transaction Data';
    const headers = [['Date', 'To', 'From', 'Amount', 'Type', 'Mode', 'Remarks']];

    const data = txn.map((transaction) => [
      formatDate(transaction.transaction_date),
      transaction.account_to,
      transaction.account_from,
      transaction.amount,
      transaction.transaction_type,
      transaction.transaction_mode,
      transaction.remarks,
    ]);

    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, 40, 40);
    autoTable(doc, content);

    doc.save('transaction.pdf');
  };