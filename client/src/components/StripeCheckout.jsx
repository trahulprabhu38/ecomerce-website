import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './StripeCheckout.css';

// Debug the environment variable
console.log('Stripe Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Initialize Stripe with error handling
const stripePromise = (() => {
  const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  console.log('Initializing Stripe with key:', publishableKey);
  
  if (!publishableKey) {
    console.error('Stripe publishable key is missing. Please check your .env file.');
    return null;
  }
  
  try {
    return loadStripe(publishableKey);
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    return null;
  }
})();

const CheckoutForm = ({ onSuccess, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!stripePromise) {
      setError('Payment system is not properly configured. Please try again later.');
      console.error('Stripe promise is null');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError('Payment system is not ready. Please try again.');
      setProcessing(false);
      return;
    }

    try {
      // Create payment intent
      const { data: { clientSecret } } = await axios.post('http://localhost:8080/api/payment/create-payment-intent', {
        amount: Math.round(totalAmount * 100), // Convert to cents and ensure it's an integer
        currency: 'usd'
      });

      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
      } else {
        // Payment successful
        await axios.post('http://localhost:8080/api/payment/handle-payment', {
          paymentIntentId: paymentIntent.id
        });
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment processing');
      setProcessing(false);
    }
  };

  if (!stripePromise) {
    return (
      <div className="stripe-form">
        <div className="error-message">
          Payment system is not properly configured. Please contact support.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="form-row">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                ':-webkit-autofill': {
                  color: '#fce883',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={!stripe || processing} className="pay-button">
        {processing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

const StripeCheckout = ({ onSuccess, totalAmount }) => {
  if (!stripePromise) {
    return (
      <div className="stripe-form">
        <div className="error-message">
          Payment system is not properly configured. Please contact support.
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onSuccess={onSuccess} totalAmount={totalAmount} />
    </Elements>
  );
};

export default StripeCheckout; 