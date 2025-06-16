export interface PaystackConfig {
  publicKey: string
  secretKey: string
}

export const paystackConfig: PaystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  secretKey: process.env.PAYSTACK_SECRET_KEY || "",
}

export interface PaystackPaymentData {
  email: string
  amount: number // in kobo (multiply by 100)
  currency?: string
  reference?: string
  callback_url?: string
  metadata?: Record<string, any>
}

export const initializePaystackPayment = (data: PaystackPaymentData) => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Paystack can only be initialized in the browser"))
      return
    }

    // Load Paystack script if not already loaded
    if (!window.PaystackPop) {
      const script = document.createElement("script")
      script.src = "https://js.paystack.co/v1/inline.js"
      script.onload = () => initPayment()
      script.onerror = () => reject(new Error("Failed to load Paystack script"))
      document.head.appendChild(script)
    } else {
      initPayment()
    }

    function initPayment() {
      const handler = window.PaystackPop.setup({
        key: paystackConfig.publicKey,
        email: data.email,
        amount: data.amount,
        currency: data.currency || "NGN",
        ref: data.reference || `ref_${Date.now()}`,
        callback: (response: any) => {
          resolve(response)
        },
        onClose: () => {
          reject(new Error("Payment cancelled"))
        },
        metadata: data.metadata,
      })

      handler.openIframe()
    }
  })
}

// Server-side payment verification
export const verifyPaystackPayment = async (reference: string) => {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackConfig.secretKey}`,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Payment verification error:", error)
    throw error
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    PaystackPop: any
  }
}
