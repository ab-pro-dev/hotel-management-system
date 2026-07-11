import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { jsPDF } from "jspdf";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const booking = await prisma.booking.findUnique({
    where: { bookingAccessToken: token },
    include: {
      room: { include: { roomType: true } },
      payment: true,
      guest: true,
    },
  });

  if (!booking) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Grand Raya Hotel", 105, 20, { align: "center" });
  doc.setFontSize(10);
  doc.text("123 Grand Avenue, City Center", 105, 28, { align: "center" });
  doc.text("Tel: (555) 123-4567 | info@grandraya.com", 105, 34, { align: "center" });

  doc.setDrawColor(0);
  doc.line(20, 40, 190, 40);

  doc.setFontSize(14);
  doc.text("INVOICE", 20, 52);
  doc.setFontSize(10);
  doc.text(`Invoice #: ${booking.id.slice(0, 8).toUpperCase()}`, 20, 60);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 66);

  doc.text("Guest Information", 20, 80);
  doc.setFontSize(9);
  doc.text(`Name: ${booking.guest.name}`, 20, 86);
  doc.text(`Email: ${booking.guest.email}`, 20, 92);

  doc.setFontSize(10);
  doc.text("Booking Details", 20, 106);
  doc.setFontSize(9);
  doc.text(`Room Type: ${booking.room.roomType.title}`, 20, 112);
  doc.text(`Room Number: ${booking.room.roomNumber}`, 20, 118);
  doc.text(`Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}`, 20, 124);
  doc.text(`Check-out: ${new Date(booking.checkOutDate).toLocaleDateString()}`, 20, 130);
  doc.text(`Status: ${booking.status.replace("_", " ")}`, 20, 136);

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  doc.text(`Nights: ${nights}`, 20, 142);

  doc.setDrawColor(0);
  doc.line(20, 150, 190, 150);

  doc.setFontSize(10);
  doc.text("Payment Summary", 20, 160);
  doc.setFontSize(9);
  doc.text(`Room Rate: $${Number(booking.room.roomType.basePrice).toFixed(2)} / night`, 20, 166);
  doc.text(`Subtotal: $${(Number(booking.room.roomType.basePrice) * nights).toFixed(2)}`, 20, 172);
  doc.text(`Total Paid: $${Number(booking.totalPrice).toFixed(2)}`, 20, 178);

  if (booking.payment) {
    doc.text(`Payment Method: ${booking.payment.paymentMethod}`, 20, 184);
    doc.text(`Transaction ID: ${booking.payment.transactionId}`, 20, 190);
  }

  doc.line(20, 198, 190, 198);
  doc.setFontSize(8);
  doc.text("Thank you for staying with Grand Raya Hotel!", 105, 206, { align: "center" });

  const pdfBuffer = doc.output("arraybuffer");

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bill-${booking.id.slice(0, 8)}.pdf"`,
    },
  });
}
