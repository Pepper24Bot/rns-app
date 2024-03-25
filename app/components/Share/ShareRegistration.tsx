import React, { useState } from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import {
  ActionButton,
  Flex,
  FlexCenter,
  ModalInputField,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";

const Container = styled(Grid)(({ theme }) => ({
  padding: "50px 30px 40px 30px",
}));

const Content = styled(Grid)(({ theme }) => ({
  minHeight: "260px", // fixed width
  maxWidth: "225px",
  alignContent: "space-between",
}));

const TweetContainer = styled(Container)(({ theme }) => ({
  backgroundColor: darken(theme.palette.background.darker, 0.25),
}));

const StepLabel = styled(SecondaryLabel)(({ theme }) => ({
  textAlign: "center",
  fontSize: "14px",
}));

const ButtonLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Bold,
  color: theme.palette.primary.main,
  fontSize: "14px",
  textTransform: "uppercase",
}));

const ButtonContainer = styled(FlexCenter)(({ theme }) => ({
  height: "fit-content",
}));

const ShareButton = styled(ActionButton)(({ theme }) => ({
  "&.MuiButton-contained": {
    border: `solid 1px ${alpha(theme.palette.primary.main, 0.5)}`,
    backgroundColor: theme.palette.background.paper,
    padding: "8px 24px",
  },
}));

const BulletLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Bold,
}));

const BulletContainer = styled(FlexCenter)(({ theme }) => ({
  width: "60px",
  height: "60px",
  border: `dashed 2px ${theme.palette.primary.dark}`,
  borderRadius: "30px",
  marginBottom: "30px",
  filter: `drop-shadow(0px 0px 5px ${theme.palette.background.paper})`,
  backgroundColor: theme.palette.background.darker,
}));

interface BulletProps {
  index: number;
}

const Bullet: React.FC<BulletProps> = (props: BulletProps) => {
  const { index } = props;
  return (
    <FlexCenter>
      <BulletContainer>
        <BulletLabel>{index}</BulletLabel>
      </BulletContainer>
    </FlexCenter>
  );
};

export const ShareRegistration: React.FC = () => {
  const [link, setLink] = useState<string>("");

  return (
    <FlexCenter container position="relative">
      <Container item xs={4}>
        <Content container>
          <Grid item xs={12} height="fit-content">
            <Bullet index={1} />
            <StepLabel>Link your Twitter Account</StepLabel>
          </Grid>
          <ButtonContainer item xs={12}>
            <ShareButton variant="contained" onClick={() => {}}>
              <ButtonLabel>Link</ButtonLabel>
            </ShareButton>
          </ButtonContainer>
        </Content>
      </Container>
      <TweetContainer item xs={4}>
        <Content container>
          <Grid item xs={12} height="fit-content">
            <Bullet index={2} />
            <StepLabel>Tweet your newly registered RNS! </StepLabel>
          </Grid>
          <ButtonContainer item xs={12}>
            <ShareButton variant="contained" onClick={() => {}}>
              <ButtonLabel>Tweet</ButtonLabel>
            </ShareButton>
          </ButtonContainer>
        </Content>
      </TweetContainer>
      <Container item xs={4}>
        <Content container>
          <Grid item xs={12} height="fit-content">
            <Bullet index={3} />
            <StepLabel>Verify your shared post</StepLabel>
            <ModalInputField
              value={link}
              onChange={(event) => {
                const { value } = event.target;
                setLink(value);
              }}
            />
          </Grid>
          <ButtonContainer item xs={12}>
            <ShareButton variant="contained" onClick={() => {}}>
              <ButtonLabel>Verify</ButtonLabel>
            </ShareButton>
          </ButtonContainer>
        </Content>
      </Container>
    </FlexCenter>
  );
};

export default ShareRegistration;
