import React from 'react';
import styled from 'styled-components';
import DetailsBar from './detailsbar';
import InputSide from './inputside';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  background-color: #F4F7F9;
  padding-left: 23vw;
  padding-right: 2vw;
  padding-top: 2vw;
  padding-bottom: 50px;
  box-sizing: border-box;
  width: 100%;
`;

const PageHeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const FormContainer = styled.div`
  width: 90%;
  max-width: 900px;
  display: flex;
  background-color: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  min-height: 60vh;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const TextOne = styled.b`
  font-size: 30px;
  color: rgb(4, 4, 59);
  text-align: center;
`;

const TextTwo = styled.p`
  color: rgb(4, 4, 34);
  font-size: 15px;
  text-align: center;
`;

const FormPage = () => {
  return (
    <PageWrapper>
      <PageHeadingWrapper>
        <TextOne>Contact US</TextOne>
        <TextTwo>Any Question or remarks? Just write us a message</TextTwo>
      </PageHeadingWrapper>
      <FormContainer>
        <DetailsBar/>
        <InputSide/>
      </FormContainer>
    </PageWrapper>
  );
};

export default FormPage;
