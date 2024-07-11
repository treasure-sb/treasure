import { PDFDocument, rgb } from "pdf-lib";
import { TicketPurchasedProps } from "@/emails/TicketPurchased";
import QRCode from "qrcode";
function parseProteinCounts(input: string): number[] {
  // Initialize a map with the required proteins and default counts of 0
  const proteinMap: { [key: string]: number } = {
      "Chicken": 0,
      "Salmon": 0,
      "Steak": 0
  };

  // Split the input string by commas to get each protein count part
  const parts = input.split(',');

  // Iterate through each part to extract the protein and its count
  for (const part of parts) {
      const [count, protein] = part.trim().split(' ');
      if (proteinMap.hasOwnProperty(protein)) {
          proteinMap[protein] = parseInt(count);
      }
  }

  // Return the counts in the order: Chicken, Salmon, Steak
  return [proteinMap["Chicken"], proteinMap["Steak"], proteinMap["Salmon"]];
}
const proteins = ["Chicken", "Steak", "Salmon"]
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
  ];
  let dinnerCount = undefined;
  if(ticketProps.dinnerSelection) {
    dinnerCount = parseProteinCounts(ticketProps.dinnerSelection)
    let count = 0;
    while(count <3){
      if(dinnerCount[count] !== 0){
        details.push(`Dinner Selection: ${proteins[count]}`)
        dinnerCount[count] -= 1
        break
      }
      count++
    }

  }
  details.forEach((detail, index) => {
    page.drawText(detail, {
      x: textStartX,
      y: textStartY - (index + 1) * (fontSize * 1.5),
      size: index === 0 ? fontSize : fontSize * 0.6,
    });
  });
  if(details.length == 4) details.pop()
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
    while(j < ticketId.length){
      if(details.length == 4) details.pop()
      if(ticketProps.dinnerSelection && dinnerCount !== undefined) {
      let count = 0;
      while(count < 3){
        if(dinnerCount[count] !== 0){
          details.push(`Dinner Selection: ${proteins[count]}`)
          dinnerCount[count] -= 1
          break
        }
        count++
      }
    }
      const page = doc.addPage();
      
      const { width, height } = page.getSize();
      const fontSize = 20;
      const qrCodeSize = 100;
      const margin = 50;
      const contentPadding = 20;

      // ticket details text block position
      const textStartX = margin;
      let textStartY = height - margin - fontSize;
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
