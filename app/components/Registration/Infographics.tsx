import React, { useState } from "react";
import { Grid, alpha, styled } from "@mui/material";
import {
  ActionButton,
  FieldContainer,
  Flex,
  FlexCenter,
  FlexRight,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import { REGISTRATION_PROCESS } from "@/services/content";
import { parseCookie } from "@/services/utils";
import { useModalState } from "@/redux/modal/modalSlice";

const Container = styled(Grid)(({ theme }) => ({
  maxWidth: "1000px",
}));

const StepContainer = styled(Flex)(({ theme }) => ({
  alignItems: "start",
  [theme.breakpoints.down("md")]: {
    display: "block",
  },
}));

const StepItemContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "&.MuiGrid-root": {
      "&.MuiGrid-item": {
        paddingTop: "8px",
      },
    },
  },
}));

const Step = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    alignItems: "center",
  },
}));

const StepTitle = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  textAlign: "center",
  padding: "10px 20px",
  fontWeight: FONT_WEIGHT.Bold,
}));

const Process = styled(FieldContainer)(({ theme }) => ({
  minWidth: "150px",
  justifyContent: "center",
  padding: "10px",
  margin: "20px 0",
}));

const ProcessText = styled(StepTitle)(({ theme }) => ({
  fontSize: "14px",
  textTransform: "uppercase",
  padding: "0 10px",
  color: theme.palette.primary.main,
  fontWeight: FONT_WEIGHT.Bold,
}));

const Content = styled(FieldContainer)(({ theme }) => ({
  marginTop: "10px",
  padding: "20px",
  backgroundColor: theme.palette.background.paper,
}));

const ContentText = styled(StepTitle)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.75),
  padding: "0",
  fontWeight: FONT_WEIGHT.Regular,
}));

export const Infographics: React.FC = () => {
  const { toggleModal } = useModalState();

  const isInformationHidden =
    parseCookie("registration_process_hidden") === "true";

  const [isInfoHidden, setInfoHidden] = useState<boolean>(isInformationHidden);

  const handleDoNotShow = () => {
    setInfoHidden(true);
    document.cookie = `registration_process_hidden=${true}; path=/`;
  };

  return (
    <Container>
      <StepContainer container my={4} spacing={4}>
        {REGISTRATION_PROCESS.map((item, index) => {
          return (
            <StepItemContainer item xs>
              <Step>
                <StepTitle>{`Step ${index + 1}`}</StepTitle>
                <FlexCenter>
                  <Process>
                    <ProcessText>{item.label}</ProcessText>
                  </Process>
                </FlexCenter>
              </Step>
              <Content>
                <ContentText>{item.description}</ContentText>
              </Content>
            </StepItemContainer>
          );
        })}
      </StepContainer>
      <FlexRight>
        <Grid mr={1}>
          <ActionButton
            disabled={isInfoHidden}
            onClick={() => {
              handleDoNotShow();
            }}
          >
            Do not show again
          </ActionButton>
        </Grid>
        <Grid>
          <ActionButton
            variant="contained"
            onClick={() => {
              toggleModal({
                id: "Register Name",
                title: "Register",
              });
            }}
          >
            Proceed
          </ActionButton>
        </Grid>
      </FlexRight>
    </Container>
  );
};

export default Infographics;
