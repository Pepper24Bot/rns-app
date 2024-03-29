import React, { useEffect, useState } from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import {
  ActionButton,
  Flex,
  FlexCenter,
  ModalInputField,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import { useSearchParams } from "next/navigation";
import { useCreateAccessTokenMutation } from "@/redux/twitter/twitterSlice";
import { isEmpty } from "lodash";

const Container = styled(Grid)(({ theme }) => ({
  padding: "50px 30px 40px 30px",
}));

const Content = styled(Grid)(({ theme }) => ({
  minHeight: "235px", // fixed width
  maxWidth: "225px",
  alignContent: "space-between",
}));

const TweetContainer = styled(Container)(({ theme }) => ({
  backgroundColor: darken(theme.palette.background.darker, 0.25),
}));

const StepLabel = styled(SecondaryLabel)(({ theme }) => ({
  textAlign: "center",
  fontSize: "20px",
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

  const [createAccessToken, result] = useCreateAccessTokenMutation();
  const params = useSearchParams();

  const handleLink = () => {
    // TODO: Move these constants in an env file
    const twitterUrl = "https://twitter.com/i/oauth2/authorize";
    const clientId = "QmczejlDYjJkT25wWEpKN3Fyb1A6MTpjaQ";
    // const redirectUri = "http://localhost:3000"; //
    const redirectUri = "http://127.0.0.1:3001/auth/twitter?path=`/`";
    const scope = "tweet.read%20tweet.write%20users.read";

    const url = `${twitterUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=modal-Share RNS&code_challenge=challenge&code_challenge_method=plain`;

    if (typeof window !== "undefined") {
      window.open(url, "_self");
    }
  };

  const handleTweet = () => {
    const content = `I just registered my new @RootNameService (RNS) Cross Platform, Social and Data Identity on @therootnetwork.
    %0D%0DSecure your RNS Idenity today and be eligible for @Futureverse Quest Rewards.
    %0D%0DMore info  https://futureverse.com/futurepass/quests/ `;

    const url = `http://twitter.com/intent/tweet?text=${content}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  // useEffect(() => {
  //   console.log("params:: ", params.get("code"));
  //   if (!isEmpty(params.get("code"))) {
  //     createAccessToken({ code: params.get("code") || "" });
  //   }
  // }, [params.get("code")]);

  return (
    <FlexCenter container position="relative">
      <Container item xs={4}>
        <Content container>
          <Grid item xs={12} height="fit-content">
            <Bullet index={1} />
            <StepLabel>Link your Twitter Account</StepLabel>
          </Grid>
          <ButtonContainer item xs={12}>
            <ShareButton
              variant="contained"
              onClick={() => {
                handleLink();
              }}
            >
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
            <ShareButton
              variant="contained"
              onClick={() => {
                handleTweet();
              }}
            >
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
