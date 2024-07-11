import { PDFDocument, rgb } from "pdf-lib";
import { TicketPurchasedProps } from "@/emails/TicketPurchased";
import QRCode from "qrcode";

const generateTicketReceipt = async (
  ticketId: string | string[],
  eventId: string,
  ticketProps: TicketPurchasedProps
) => {
  const doc = await PDFDocument.create();
  const page = doc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 20;
  const qrCodeSize = 100;
  const margin = 50;
  const contentPadding = 20;

  // ticket details text block position
  const textStartX = margin;
  let textStartY = height - margin - fontSize;

  const details = [
    `${ticketProps.eventName}`,
    `${ticketProps.guestName}`,
    `${ticketProps.ticketType}`,
    `Quantity: ${ticketProps.quantity}`,
  ];
  if(ticketProps.dinnerSelection) details.push(`Dinner Selection: ${ticketProps.dinnerSelection}`)
  details.forEach((detail, index) => {
    page.drawText(detail, {
      x: textStartX,
      y: textStartY - (index + 1) * (fontSize * 1.5),
      size: index === 0 ? fontSize : fontSize * 0.6,
    });
  });

  const textBlockHeight = details.length * fontSize * 1.5;
  const qrCodeX = width - qrCodeSize - margin;
  const qrCodeY = height - qrCodeSize - margin - fontSize;

  let qrCodeUrl;
  // generate QR code and embed it in the pdf
  if(typeof ticketId  == "string") {
    qrCodeUrl = await QRCode.toDataURL(
    `https://ontreasure.xyz/verify-tickets/?ticket_id=${ticketId}&event_id=${eventId}`
  );}
  else{
    qrCodeUrl = await QRCode.toDataURL(
      `https://ontreasure.xyz/verify-tickets/?ticket_id=${ticketId[0]}&event_id=${eventId}`
    )
  }
  const qrCodeImage = await doc.embedPng(qrCodeUrl);
  page.drawImage(qrCodeImage, {
    x: qrCodeX,
    y: qrCodeY,
    width: qrCodeSize,
    height: qrCodeSize,
  });

  // rectangle around the content bounds
  const rectHeight = Math.max(qrCodeSize, textBlockHeight) + contentPadding * 2;
  const rectY = height - margin - rectHeight;
  const rectWidth = qrCodeX + qrCodeSize - textStartX + contentPadding;

  // rectangle around the content
  page.drawRectangle({
    x: textStartX - contentPadding,
    y: rectY - contentPadding,
    width: rectWidth,
    height: rectHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  if(typeof ticketId  !== "string"){
    let j = 1
    if(details.length === 4){
      details.pop()
    }
    else if(details.length === 5){
      details.pop()
      details.pop()
    }
    while(j < ticketId.length){
      const page = doc.addPage();
      
      const { width, height } = page.getSize();
      const fontSize = 20;
      const qrCodeSize = 100;
      const margin = 50;
      const contentPadding = 20;

      // ticket details text block position
      const textStartX = margin;
      let textStartY = height - margin - fontSize;

      const details = [
        `${ticketProps.eventName}`,
        `${ticketProps.guestName}`,
        `${ticketProps.ticketType}`,
      ];
      if(ticketProps.dinnerSelection) details.push(`Dinner Selection: ${ticketProps.dinnerSelection}`)
      details.forEach((detail, index) => {
        page.drawText(detail, {
          x: textStartX,
          y: textStartY - (index + 1) * (fontSize * 1.5),
          size: index === 0 ? fontSize : fontSize * 0.6,
        });
      });

      const textBlockHeight = details.length * fontSize * 1.5;
      const qrCodeX = width - qrCodeSize - margin;
      const qrCodeY = height - qrCodeSize - margin - fontSize;

      // generate QR code and embed it in the pdf

      let qrCodeUrl = await QRCode.toDataURL(
        `https://ontreasure.xyz/verify-tickets/?ticket_id=${ticketId[j]}&event_id=${eventId}`
      )
      const qrCodeImage = await doc.embedPng(qrCodeUrl);
      page.drawImage(qrCodeImage, {
        x: qrCodeX,
        y: qrCodeY,
        width: qrCodeSize,
        height: qrCodeSize,
      });

      // rectangle around the content bounds
      const rectHeight = Math.max(qrCodeSize, textBlockHeight) + contentPadding * 2;
      const rectY = height - margin - rectHeight;
      const rectWidth = qrCodeX + qrCodeSize - textStartX + contentPadding;

      // rectangle around the content
      page.drawRectangle({
        x: textStartX - contentPadding,
        y: rectY - contentPadding,
        width: rectWidth,
        height: rectHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      j+=1
    }
  }
  const pdfBytes = await doc.save();
  return pdfBytes;
};

export { generateTicketReceipt };
