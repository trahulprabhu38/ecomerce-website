import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { addToCart, deleteFromCart, getCart, placeOrder } from "../api";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { DeleteOutline } from "@mui/icons-material";
import { showSuccessToast, showErrorToast, showOrderSuccessToast } from "../utils/toastUtils";
import StripeCheckout from "../components/StripeCheckout";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

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
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 12px;
  @media (max-width: 750px) {
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 1.2;
  }
`;
const Table = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 30px;
  ${({ head }) => head && `margin-bottom: 22px`}
`;
const TableItem = styled.div`
  ${({ flex }) => flex && `flex: 1; `}
  ${({ bold }) =>
    bold &&
    `font-weight: 600; 
  font-size: 18px;`}
`;
const Counter = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 8px;
  padding: 4px 12px;
`;

const Product = styled.div`
  display: flex;
  gap: 16px;
`;
const Img = styled.img`
  height: 80px;
`;
const Details = styled.div``;
const Protitle = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  font-weight: 500;
`;
const ProDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ProSize = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 0.8;
  }
`;
const Subtotal = styled.div`
  font-size: 22px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;
const Delivery = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const ModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: ${({ theme }) => theme.bg};
  border-radius: 12px;
  padding: 20px;
  outline: none;
`;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [products, setProducts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    completeAddress: "",
  });

  const getProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await getCart(token).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  const addCart = async (id) => {
    const token = localStorage.getItem("krist-app-token");
    await addToCart(token, { productId: id, quantity: 1 })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  const removeCart = async (id, quantity, type) => {
    const token = localStorage.getItem("krist-app-token");
    let qnt = quantity > 0 ? 1 : null;
    if (type === "full") qnt = null;
    await deleteFromCart(token, {
      productId: id,
      quantity: qnt,
    })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (total, item) => total + item.quantity * item?.product?.price?.org,
      0
    );
  };

  useEffect(() => {
    getProducts();
  }, [reload]);

  const convertAddressToString = (addressObj) => {
    // Convert the address object to a string representation
    return `${addressObj.firstName} ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;
  };

  const PlaceOrder = async () => {
    setButtonLoad(true);
    try {
      const isDeliveryDetailsFilled =
        deliveryDetails.firstName &&
        deliveryDetails.lastName &&
        deliveryDetails.completeAddress &&
        deliveryDetails.phoneNumber &&
        deliveryDetails.emailAddress;

      if (!isDeliveryDetailsFilled) {
        dispatch(
          openSnackbar({
            message: "Please fill in all required delivery details.",
            severity: "error",
          })
        );
        return;
      }

      // Navigate to Stripe checkout page with cart data
      navigate('/checkout', {
        state: {
          totalAmount: calculateSubtotal(),
          cartItems: products,
          deliveryDetails: deliveryDetails
        }
      });
    } catch (error) {
      setButtonLoad(false);
      dispatch(
        openSnackbar({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const token = localStorage.getItem("krist-app-token");
      const totalAmount = calculateSubtotal().toFixed(2);
      
      const formattedProducts = products.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));

      const orderDetails = {
        products: formattedProducts,
        address: convertAddressToString(deliveryDetails),
        totalAmount,
      };

      await placeOrder(token, orderDetails);
      setShowStripeModal(false);
      showOrderSuccessToast();
      navigate("/orders");
    } catch (error) {
      dispatch(
        openSnackbar({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("krist-app-token");
    await deleteFromCart(token, { productId })
      .then((res) => {
        showSuccessToast("Item removed from cart");
        getProducts();
      })
      .catch((err) => {
        showErrorToast(err.response?.data?.message || err.message);
      });
  };

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        <Section>
          <Title>Your Shopping Cart</Title>
          {products.length === 0 ? (
            <>Cart is empty</>
          ) : (
            <Wrapper>
              <Left>
                <Table>
                  <TableItem bold flex>
                    Product
                  </TableItem>
                  <TableItem bold>Price</TableItem>
                  <TableItem bold>Quantity</TableItem>
                  <TableItem bold>Subtotal</TableItem>
                  <TableItem></TableItem>
                </Table>
                {products?.map((item) => (
                  <Table>
                    <TableItem flex>
                      <Product>
                        <Img src={item?.product?.img} />
                        <Details>
                          <Protitle>{item?.product?.title}</Protitle>
                          <ProDesc>{item?.product?.name}</ProDesc>
                          <ProSize>Size: Xl</ProSize>
                        </Details>
                      </Product>
                    </TableItem>
                    <TableItem>${item?.product?.price?.org}</TableItem>
                    <TableItem>
                      <Counter>
                        <div
                          style={{
                            cursor: "pointer",
                            flex: 1,
                          }}
                          onClick={() =>
                            removeCart(item?.product?._id, item?.quantity - 1)
                          }
                        >
                          -
                        </div>
                        {item?.quantity}
                        <div
                          style={{
                            cursor: "pointer",
                            flex: 1,
                          }}
                          onClick={() => addCart(item?.product?._id)}
                        >
                          +
                        </div>
                      </Counter>
                    </TableItem>
                    <TableItem>
                      {" "}
                      ${(item.quantity * item?.product?.price?.org).toFixed(2)}
                    </TableItem>
                    <TableItem>
                      <DeleteOutline
                        sx={{ color: "red" }}
                        onClick={() =>
                          removeCart(
                            item?.product?._id,
                            item?.quantity - 1,
                            "full"
                          )
                        }
                      />
                    </TableItem>
                  </Table>
                ))}
              </Left>
              <Right>
                <Subtotal>
                  Subtotal : ${calculateSubtotal().toFixed(2)}
                </Subtotal>
                <Delivery>
                  Delivery Details:
                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      <TextInput
                        small
                        placeholder="First Name"
                        value={deliveryDetails.firstName}
                        handleChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            firstName: e.target.value,
                          })
                        }
                      />
                      <TextInput
                        small
                        placeholder="Last Name"
                        value={deliveryDetails.lastName}
                        handleChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <TextInput
                      small
                      value={deliveryDetails.emailAddress}
                      handleChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          emailAddress: e.target.value,
                        })
                      }
                      placeholder="Email Address"
                    />
                    <TextInput
                      small
                      value={deliveryDetails.phoneNumber}
                      handleChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="Phone no. +91 XXXXX XXXXX"
                    />
                    <TextInput
                      small
                      textArea
                      rows="5"
                      handleChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          completeAddress: e.target.value,
                        })
                      }
                      value={deliveryDetails.completeAddress}
                      placeholder="Complete Address (Address, State, Country, Pincode)"
                    />
                  </div>
                </Delivery>
                <Button
                  text="Place Order"
                  small
                  isLoading={buttonLoad}
                  isDisabled={buttonLoad}
                  onClick={PlaceOrder}
                />
              </Right>
            </Wrapper>
          )}
        </Section>
      )}
      
      <Modal
        open={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        aria-labelledby="stripe-modal"
      >
        <ModalBox>
          <StripeCheckout 
            onSuccess={handlePaymentSuccess} 
            totalAmount={calculateSubtotal()} 
          />
        </ModalBox>
      </Modal>
    </Container>
  );
};

export default Cart;
