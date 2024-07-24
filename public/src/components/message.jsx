import React from 'react';
import styled from "styled-components";

function Message() {
  return (
    <Container>
      <h4>Hola como estas</h4>
    </Container>
  )
}

const Container = styled.div`
  height: 100%;
  color: white; // Asegúrate de que el texto sea visible
`;

export default Message;
