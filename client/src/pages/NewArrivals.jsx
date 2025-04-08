import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../api';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/reducers/snackbarSlice';

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 40px;
  text-align: center;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  padding: 20px 0;
`;

const ProductCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text_primary};
`;

const ProductPrice = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const Badge = styled.span`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  margin-left: 10px;
`;

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts('sort=-createdAt&limit=12');
        setProducts(response.data);
      } catch (error) {
        dispatch(
          openSnackbar({
            message: 'Failed to fetch new arrivals',
            severity: 'error',
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  if (loading) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Wrapper>
        <Title>New Arrivals</Title>
        <Subtitle>Discover our latest collection of trendy products</Subtitle>
        <ProductGrid>
        
          {products.map((product) => (
            <ProductCard
              key={product._id}
              onClick={() => navigate(`/shop/${product._id}`)}
            >
              <ProductImage src={product.img} alt={product.title} />
              <ProductInfo>
                <ProductName>{product.title}</ProductName>
                <ProductPrice>
                  ${product.price.org}
                  <Badge>New</Badge>
                </ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </Wrapper>
    </Container>
  );
};

//collects data from database and prints in a loop

export default NewArrivals; 