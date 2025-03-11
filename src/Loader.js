import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
`;

const Spinner = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #4299e1;
  border-radius: 50%;
  animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #4299e1 transparent transparent transparent;
`;

function Loader() {
  return (
    <LoaderContainer>
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    </LoaderContainer>
  );
}

export default Loader;
