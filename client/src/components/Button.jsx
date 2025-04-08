import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  border-radius: 10px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: min-content;
  padding: 16px 26px;
  box-shadow: 1px 20px 35px 0px ${({ theme }) => theme.primary + 40};
  border: 1px solid ${({ theme }) => theme.primary};
  background: ${({ theme, $type }) =>
    $type === "secondary" ? theme.secondary : theme.primary};
  opacity: ${({ $isDisabled, $isLoading }) =>
    ($isDisabled || $isLoading) ? 0.8 : 1};
  cursor: ${({ $isDisabled, $isLoading }) =>
    ($isDisabled || $isLoading) ? 'not-allowed' : 'pointer'};
  flex: ${({ $flex }) => ($flex ? 1 : 'initial')};
  padding: ${({ $small }) => ($small ? '10px 28px' : '16px 26px')};
  background: ${({ $outlined, theme }) =>
    $outlined ? 'transparent' : theme.primary};
  color: ${({ $outlined, theme }) =>
    $outlined ? theme.primary : 'white'};
  box-shadow: ${({ $outlined }) =>
    $outlined ? 'none' : 'inherit'};
  width: ${({ $full }) => ($full ? '100%' : 'auto')};

  @media (max-width: 600px) {
    padding: 8px 12px;
  }
`;

const Button = ({
  text,
  isLoading,
  isDisabled,
  rightIcon,
  leftIcon,
  type,
  onClick,
  flex,
  small,
  outlined,
  full,
}) => {
  return (
    <StyledButton
      onClick={() => !isDisabled && !isLoading && onClick()}
      $isDisabled={isDisabled}
      $type={type}
      $isLoading={isLoading}
      $flex={flex}
      $small={small}
      $outlined={outlined}
      $full={full}
      disabled={isDisabled || isLoading}
      type="button"
    >
      {isLoading && (
        <CircularProgress
          style={{ width: "18px", height: "18px", color: "inherit" }}
        />
      )}
      {leftIcon}
      {text}
      {isLoading && <> . . .</>}
      {rightIcon}
    </StyledButton>
  );
};

export default Button;
