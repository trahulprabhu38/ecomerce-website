import stripe from 'stripe';
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'usd' } = req.body;

        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
};

// Handle successful payment , goes to stripe website and checks for the success of the order
export const handleSuccessfulPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        
        const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);

        console.log(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            // Here you can update your database, send confirmation emails, etc.
            res.status(200).json({ 
                success: true, 
                message: 'Payment successful',
                paymentDetails: paymentIntent
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: 'Payment not successful' 
            });
        }
    } catch (error) {
        console.error('Error handling payment:', error);
        res.status(500).json({ error: error.message });
    }
}; 