import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { getOrders } from "../api";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  gap: 28px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OrderCard = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 40};
`;

const OrderId = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const OrderDate = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: ${({ theme }) => theme.bg};
  border-radius: 8px;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const ProductQuantity = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const ProductPrice = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
`;

const OrderSummary = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + 40};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalAmount = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const DeliveryAddress = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 8px;
`;

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("krist-app-token");
      const response = await getOrders(token);
      setOrders(response.data);
    } catch (error) {
      dispatch(
        openSnackbar({
          message: "Failed to fetch orders. Please try again.",
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <Title>Your Orders</Title>
        {orders.length === 0 ? (
          <div>No orders found</div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id}>
              <OrderHeader>
                <OrderId>Order #{order._id.slice(-6).toUpperCase()}</OrderId>
                <OrderDate>
                  {new Date(order.createdAt).toLocaleDateString()}
                </OrderDate>
              </OrderHeader>
              <OrderDetails>
                {order.products.map((item) => (
                  <ProductItem key={item.product?._id}>
                    <ProductImage 
                      src={item.product?.img} 
                      alt={item.product?.title} 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80';
                      }}
                    />
                    <ProductInfo>
                      <ProductTitle>{item.product?.title}</ProductTitle>
                      <ProductQuantity>
                        Quantity: {item.quantity} | ${item.product?.price?.org} each
                      </ProductQuantity>
                    </ProductInfo>
                    <ProductPrice>
                      ${(item.product?.price?.org * item.quantity).toFixed(2)}
                    </ProductPrice>
                  </ProductItem>
                ))}
              </OrderDetails>
              <OrderSummary>
                <DeliveryAddress>
                  Delivery Address: {order.address}
                </DeliveryAddress>
                <TotalAmount>
                  Total: ${parseFloat(order.total_amount?.$numberDecimal || order.totalAmount || 0).toFixed(2)}
                </TotalAmount>
              </OrderSummary>
            </OrderCard>
          ))
        )}
      </Section>
    </Container>
  );
};

export default Orders; 