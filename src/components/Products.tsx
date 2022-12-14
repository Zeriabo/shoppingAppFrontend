import React from "react";
import styled from "styled-components";
import Product from "./Product";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Products = (products: any) => {
  return (
    <Container>
      {products.products.map((item: any) => (
        <Product item={item} key={item.id} />
      ))}
    </Container>
  );
};

export default Products;
