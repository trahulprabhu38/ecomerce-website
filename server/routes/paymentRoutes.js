import express from 'express';
import { createPaymentIntent, handleSuccessfulPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Create a payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Handle successful payment
router.post('/handle-payment', handleSuccessfulPayment);

export default router; 