import { type NextRequest, NextResponse } from "next/server"
import { verifyPaystackPayment } from "@/lib/paystack"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    const { reference, orderId } = await request.json()

    if (!reference || !orderId) {
      return NextResponse.json({ error: "Missing reference or orderId" }, { status: 400 })
    }

    // Verify payment with Paystack
    const paymentData = await verifyPaystackPayment(reference)

    if (paymentData.status && paymentData.data.status === "success") {
      // Update order status in Firebase
      const orderRef = doc(db, "orders", orderId)
      await updateDoc(orderRef, {
        paymentStatus: "paid",
        status: "processing",
        paymentReference: reference,
        paymentData: paymentData.data,
        updatedAt: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        data: paymentData.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
          error: paymentData.message,
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
