import React from 'react';
import styled from 'styled-components';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/StripeCheckout';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder } from '../api';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/snackbarSlice';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 20px;
`;

const CheckoutContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  padding: 40px;
  background: #f8f9fa;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const RightSection = styled.div`
  flex: 1;
  padding: 40px;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a1f36;
  margin-bottom: 24px;
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #1a1f36;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
  color: #1a1f36;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  margin-top: 16px;
`;

const StripeCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalAmount, cartItems, deliveryDetails } = location.state || { 
    totalAmount: 0, 
    cartItems: [],
    deliveryDetails: null
  };

  const handleSuccess = async () => {
    try {
      const token = localStorage.getItem("krist-app-token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      // Format products for order
      const formattedProducts = cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));

      // Convert address object to string
      const addressString = deliveryDetails ? 
        `${deliveryDetails.firstName} ${deliveryDetails.lastName}, ${deliveryDetails.completeAddress}, ${deliveryDetails.phoneNumber}, ${deliveryDetails.emailAddress}` : 
        "";

      // Create order data
      const orderData = {
        products: formattedProducts,
        address: addressString,
        totalAmount: totalAmount.toFixed(2)
      };

      // Save order to database
      await placeOrder(token, orderData);

      // Show success message
      dispatch(
        openSnackbar({
          message: "Order placed successfully!",
          severity: "success",
        })
      );

      // Navigate to orders page
      navigate('/orders', { state: { success: true } });
    } catch (error) {
      console.error('Error saving order:', error);
      dispatch(
        openSnackbar({
          message: error.message || "Failed to save order. Please try again.",
          severity: "error",
        })
      );
    }
  };

  if (!totalAmount || !cartItems || !deliveryDetails) {
    navigate('/cart');
    return null;
  }

  return (
    <Container>
      <CheckoutContainer>
        <LeftSection>
          <Title>Order Summary</Title>
          <OrderSummary>
            {cartItems.map((item, index) => (
              <SummaryItem key={index}>
                <span>{item.product.name} x {item.quantity}</span>
                <span>${(item.product.price.org * item.quantity).toFixed(2)}</span>
              </SummaryItem>
            ))}
            <Total>
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </Total>
          </OrderSummary>
        </LeftSection>
        <RightSection>
          <Title>Payment Details</Title>
          <Elements stripe={stripePromise}>
            <CheckoutForm onSuccess={handleSuccess} totalAmount={totalAmount} />
          </Elements>
        </RightSection>
      </CheckoutContainer>
    </Container>
  );
};

export default StripeCheckoutPage; 