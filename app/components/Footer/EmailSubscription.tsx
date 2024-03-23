import React, { useCallback, useEffect, useState } from "react";
import { CircularProgress, Grid, alpha, styled } from "@mui/material";
import {
  ActionButton,
  FlexCenter,
  Heading,
  ModalInputField,
} from "../Theme/StyledGlobal";
import { DEFAULT_DEBOUNCE } from "@/services/constants";
import { debounce as _debounce } from "lodash";
import { FONT_WEIGHT } from "../Theme/Global";
import { isEmailValid } from "@/services/utils";
import { useSubscribesEmailMutation } from "@/redux/airtable/airtableSlice";
import { green } from "@mui/material/colors";
import { Check } from "@mui/icons-material";

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

    "&.MuiOutlinedInput-root": {
      padding: "10px 24px",
    },
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
  const [email, setEmail] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setIsSuccess] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(true);

  const [subscribesEmail, result] = useSubscribesEmailMutation();

  const handleOnSubscribe = async () => {
    const isValid = isEmailValid(email);
    setIsValid(isValid);

    if (email && isValid) {
      setIsLoading(true);
      await subscribesEmail({ email });
      setIsLoading(false);
    }
  };

  const handleDebounceOnChange = (value: string) => {
    setEmail(value);
    setIsValid(true);

    // TODO: result.reset() does not work, why?
    setIsSuccess(false);
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );

  useEffect(() => {
    if (result.isSuccess) {
      setIsSuccess(true);
    }
  }, [result]);

  return (
    <Container>
      <Subscription>
        <Title>Stay in the Loop</Title>
        <SubTitle>
          Join our mailing list to stay in the loop with our newest feature
          releases, Partnership Announcements and special offers.{" "}
        </SubTitle>
        <FlexCenter sx={{ alignItems: "start" }}>
          <SubscribeField
            error={!isValid}
            helperText={!isValid ? "Email is not valid!" : ""}
            required
            variant="outlined"
            placeholder="Your Email Address here..."
            fullWidth
            value={inputValue}
            onChange={(event) => {
              const { value } = event.target;
              setInputValue(value);
              debounceFn(value);
            }}
            InputProps={{
              endAdornment:
                isLoading && !success ? (
                  <CircularProgress size={24} sx={{ ml: 2 }} />
                ) : success ? (
                  <Check sx={{ color: green[800] }} />
                ) : (
                  <></>
                ),
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
