import React, { useState } from "react";
import { Grid, Typography, alpha, styled } from "@mui/material";
import {
  ActionButton,
  FlexCenter,
  Heading,
  ModalInputField,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";

const Container = styled(FlexCenter)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.dark, 0.1),
  textAlign: "center",
  padding: "100px 0",
}));

const Subscription = styled(Grid)(({ theme }) => ({
  maxWidth: "430px",
}));

const Title = styled(Heading)(({ theme }) => ({
  fontSize: "32px",
  textAlign: "center",
  marginBottom: "10px",
  textTransform: "uppercase",
  color: theme.palette.primary.main,
}));

const SubTitle = styled(Title)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: FONT_WEIGHT.Regular,
  marginBottom: "36px",
  textTransform: "unset",
  color: alpha(theme.palette.text.primary, 0.75),
}));

const SubscribeField = styled(ModalInputField)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  ".MuiInputBase-root": {
    borderRadius: "8px 0 0 8px",
    boxShadow: `0px 0px 20px 0px ${theme.palette.background.paper}`,
  },
}));

const SubscribeButton = styled(ActionButton)(({ theme }) => ({
  color: theme.palette.text.primary,

  "&.MuiButtonBase-root": {
    padding: "9px 24px",
    borderRadius: "0 16px 16px 0",
    boxShadow: `0px 0px 20px 0px ${theme.palette.background.paper}`,
  },

  "&.MuiButton-contained": {
    border: "none",
  },
}));

export const EmailSubscription: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleOnSubscribe = () => {
    console.log("inputValue:: ", inputValue);
    // TODO: Add field validation here -- implement validator (e.g yup)
    // TODO: Call API here to submit
  };

  return (
    <Container>
      <Subscription>
        <Title>Stay in the Loop</Title>
        <SubTitle>
          Join our mailing list to stay in the loop with our newest feature
          releases, Partnership Announcements and special offers.{" "}
        </SubTitle>
        <FlexCenter>
          <SubscribeField
            required
            variant="outlined"
            placeholder="Your Email Address here..."
            fullWidth
            onChange={(event) => {
              const { value } = event.target;
              setInputValue(value);
            }}
          />
          <SubscribeButton
            variant="contained"
            onClick={() => {
              return handleOnSubscribe();
            }}
          >
            Subscribe
          </SubscribeButton>
        </FlexCenter>
      </Subscription>
    </Container>
  );
};

export default EmailSubscription;
