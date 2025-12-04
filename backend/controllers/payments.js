import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res) => {
  const { amount, bookingType } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `${bookingType}_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (error) {
    console.log("Razorpay Order Error: ", error);
    return res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res.json({ success: true });
  }

  return res.json({ success: false });
};