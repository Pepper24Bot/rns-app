import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  alpha,
  darken,
  styled,
} from "@mui/material";
import {
  ActionButton,
  ButtonLabel,
  FlexCenter,
  ModalInputField,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import {
  useGetTweetByIdQuery,
  useGetUserDetailsQuery,
  useTriggerWebhookMutation,
} from "@/redux/share/shareApi";
import { isEmpty } from "lodash";
import { green, red, yellow } from "@mui/material/colors";
import { TWITTER_AUTH } from "@/services/url";
import { parseCookie } from "@/services/utils";
import { TWEET_RNS } from "@/services/content";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { useModalState } from "@/redux/modal/modalSlice";
import { useShareState } from "@/redux/share/shareSlice";

const Container = styled(Grid)(({ theme }) => ({
  padding: "50px 30px 40px 30px",
}));

const Content = styled(Grid)(({ theme }) => ({
  minHeight: "250px", // fixed width
  maxWidth: "225px",
  alignContent: "space-between",
}));

const TweetContainer = styled(Container)(({ theme }) => ({
  backgroundColor: darken(theme.palette.background.darker, 0.6),
}));

const StepLabel = styled(SecondaryLabel)(({ theme }) => ({
  textAlign: "center",
  fontSize: "20px",
}));

const Verifying = styled(ButtonLabel)(({ theme }) => ({
  color: yellow[800],
}));

const Verified = styled(ButtonLabel)(({ theme }) => ({
  color: green[800],
}));

const Failed = styled(ButtonLabel)(({ theme }) => ({
  color: red[600],
}));

const Divider = styled(MuiDivider)(({ theme }) => ({
  borderColor: alpha(theme.palette.primary.main, 0.15),
}));

const ButtonContainer = styled(FlexCenter)(({ theme }) => ({
  height: "fit-content",
}));

const ShareButton = styled(ActionButton)(({ theme }) => ({
  "&.MuiButton-contained": {
    border: `solid 1px ${alpha(theme.palette.primary.main, 0.5)}`,
    backgroundColor: theme.palette.background.paper,
    padding: "8px 24px",

    "&.Mui-disabled": {
      border: `solid 1px ${alpha(theme.palette.primary.dark, 0.5)}`,
    },

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.dark, 0.2),
    },
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
  const redirectUri = `${process.env.NEXT_PUBLIC_TWITTER_API_URL}/auth/twitter`;
  const clientId = process.env.NEXT_PUBLIC_TWITTER_API_CLIENT_ID;

  const [link, setLink] = useState<string>("");
  const [tweetId, setTweetId] = useState<string>("");

  const isAccessRequested = parseCookie("isAccessRequested") === "true";

  const { updateShareStatus } = useShareState();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { futurePassAddress },
  } = useRootNetwork();

  const { data: userResponse } = useGetUserDetailsQuery(
    {},
    { skip: !isAccessRequested }
  );
  const isGranted = !isEmpty(userResponse?.data?.id);

  /**
   * Verify the link provided.
   * Skip this call when there is no tweetId and access_token provided
   */
  const {
    data: verifyResponse,
    isFetching: isVerifying,
    isSuccess: isVerified,
    isError: isVerifyFailed,
  } = useGetTweetByIdQuery(
    { tweetId: tweetId || "" },
    { skip: !isGranted || isEmpty(tweetId) }
  );

  const [triggerWebhook, result] = useTriggerWebhookMutation();

  const handleLink = () => {
    document.cookie = `isAccessRequested=${true}; path=/`;
    const scope = "tweet.read%20tweet.write%20users.read";

    const url =
      `${TWITTER_AUTH}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}` +
      `&scope=${scope}&state=modal-Share RNS&code_challenge=challenge&code_challenge_method=plain`;

    if (typeof window !== "undefined") {
      window.open(url, "_self");
    }
  };

  const handleTweet = () => {
    const content = TWEET_RNS;

    const url = `http://twitter.com/intent/tweet?text=${content}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  const handleVerify = () => {
    const pattern = new RegExp(/status\//g);
    const tweetId = link.toLowerCase().split(pattern)[1];

    setTweetId(tweetId);
  };

  useEffect(() => {
    const twitterId = verifyResponse?.data?.id;

    updateShareStatus({
      isLoading: isVerifying,
      isError: isVerifyFailed,
    });

    if (twitterId && futurePassAddress) {
      triggerWebhook({ futurePass: futurePassAddress });
    }
  }, [isVerifying]);

  useEffect(() => {
    if (result.isSuccess) {
      document.cookie = `isTweetVerified=${true}; path=/`;
    }
    updateShareStatus({
      isLoading: result.isLoading,
      isSuccess: result.isSuccess,
      isError: result.isError,
    });
  }, [result.isLoading]);

  return (
    <FlexCenter container position="relative">
      <Container item xs={3.95}>
        <Content container>
          <Grid item xs={12} height="fit-content">
            <Bullet index={1} />
            <StepLabel>Link your Twitter Account</StepLabel>
          </Grid>
          <ButtonContainer item xs={12}>
            <ShareButton
              variant="contained"
              disabled={isGranted}
              onClick={() => {
                handleLink();
              }}
            >
              <FlexCenter>
                <ButtonLabel status={isGranted ? "disabled" : ""}>
                  {isGranted ? "Linked" : "Link"}
                </ButtonLabel>
              </FlexCenter>
            </ShareButton>
          </ButtonContainer>
        </Content>
      </Container>
      <Divider orientation="vertical" flexItem />
      <TweetContainer item xs={3.95}>
        <Content container>
          <Grid item xs={12} height="fit-content">
            <Bullet index={2} />
            <StepLabel>Tweet your newly registered RNS! </StepLabel>
          </Grid>
          <ButtonContainer item xs={12}>
            <ShareButton
              disabled={!isGranted}
              variant="contained"
              onClick={() => {
                handleTweet();
              }}
            >
              <ButtonLabel status={!isGranted ? "disabled" : ""}>
                Tweet
              </ButtonLabel>
            </ShareButton>
          </ButtonContainer>
        </Content>
      </TweetContainer>
      <Divider orientation="vertical" flexItem />
      <Container item xs={3.95}>
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
            <ShareButton
              disabled={!isGranted || isEmpty(link)}
              variant="contained"
              onClick={() => {
                handleVerify();
              }}
            >
              {isVerifying ? (
                <Verifying>Verifying</Verifying>
              ) : isVerified ? (
                <Verified>Verified</Verified>
              ) : isVerifyFailed ? (
                <Failed>Verfication Failed</Failed>
              ) : (
                <ButtonLabel
                  status={!isGranted || isEmpty(link) ? "disabled" : ""}
                >
                  Verify
                </ButtonLabel>
              )}
              {isVerifying && (
                <CircularProgress size="16px" sx={{ ml: "8px" }} />
              )}
            </ShareButton>
          </ButtonContainer>
        </Content>
      </Container>
    </FlexCenter>
  );
};

export default ShareRegistration;
