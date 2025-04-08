import React, { useState } from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { Email, LocationOn, Phone } from "@mui/icons-material";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

const Container = styled.div`
  padding: 40px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.bg};
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
`;

const Wrapper = styled.div`
  max-width: 1200px;
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
  max-width: 700px;
  margin: 0 auto 40px auto;
`;

const ContactSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
  margin-top: 30px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ContactInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 10px;
  background: ${({ theme }) => theme.card};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IconContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary + "15"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InfoTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const InfoText = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
`;

const ContactForm = styled.form`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  border-radius: 10px;
  background: ${({ theme }) => theme.card};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text_primary};
`;

const InputGroup = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary + "40"};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 15px;
  outline: none;
  transition: border 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary + "40"};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 15px;
  min-height: 150px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: border 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  margin-top: 10px;

  &:hover {
    background: ${({ theme }) => theme.primary + "e0"};
  }

  &:disabled {
    background: ${({ theme }) => theme.text_secondary + "80"};
    cursor: not-allowed;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  margin-top: 60px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Contact = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
      showErrorToast("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Here you would typically send the data to your server
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      showSuccessToast("Thank you for your message! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Container>
      <Wrapper>
        <Title>Contact Us</Title>
        <Subtitle>
          Have a question or need assistance? We're here to help. Fill out the
          form below or use our contact information to get in touch with us.
        </Subtitle>

        <ContactSection>
          <ContactInfo>
            <InfoCard>
              <IconContainer>
                <LocationOn style={{ fontSize: '24px' }} />
              </IconContainer>
              <InfoContent>
                <InfoTitle>Our Location</InfoTitle>
                <InfoText>123 Fashion Street, New York, NY 10001, USA</InfoText>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <IconContainer>
                <Email style={{ fontSize: '24px' }} />
              </IconContainer>
              <InfoContent>
                <InfoTitle>Email Us</InfoTitle>
                <InfoText>support@krist.com</InfoText>
                <InfoText>info@krist.com</InfoText>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <IconContainer>
                <Phone style={{ fontSize: '24px' }} />
              </IconContainer>
              <InfoContent>
                <InfoTitle>Call Us</InfoTitle>
                <InfoText>+1 (555) 123-4567</InfoText>
                <InfoText>+1 (555) 987-6543</InfoText>
              </InfoContent>
            </InfoCard>
          </ContactInfo>

          <ContactForm onSubmit={handleSubmit}>
            <FormTitle>Send Us a Message</FormTitle>

            <InputGroup>
              <InputWrapper>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>

              <InputWrapper>
                <Label htmlFor="email">Your Email *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputWrapper>
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </InputWrapper>

            <InputWrapper>
              <Label htmlFor="message">Your Message *</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </InputWrapper>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Message"
              )}
            </SubmitButton>
          </ContactForm>
        </ContactSection>

        <MapContainer>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304605!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1661794047039!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Krist Store Location"
          ></iframe>
        </MapContainer>
      </Wrapper>
    </Container>
  );
};

export default Contact; 