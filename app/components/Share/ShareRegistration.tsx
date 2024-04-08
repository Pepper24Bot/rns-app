import React, { useEffect, useState } from "react";
import { CircularProgress, Grid, alpha, darken, styled } from "@mui/material";
import {
  ActionButton,
  FlexCenter,
  ModalInputField,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import { useSearchParams } from "next/navigation";
import {
  useGetAccessTokenQuery,
  useGetTweetByIdQuery,
  useGetUserDetailsQuery,
} from "@/redux/twitter/twitterSlice";
import { isEmpty } from "lodash";
import { green, red, yellow } from "@mui/material/colors";
import { TWITTER_AUTH } from "@/services/apis";
import { parseCookie } from "@/services/utils";
import { TWEET_RNS } from "@/services/content";

const Container = styled(Grid)(({ theme }) => ({
  padding: "50px 30px 40px 30px",
}));

const Content = styled(Grid)(({ theme }) => ({
  minHeight: "250px", // fixed width
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

const ButtonLabel = styled(SecondaryLabel, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ status, theme }) => ({
  fontWeight: FONT_WEIGHT.Bold,
  color:
    status === "denied"
      ? red[500]
      : status === "disabled"
      ? alpha(theme.palette.text.disabled, 0.15)
      : theme.palette.primary.main,
  fontSize: "14px",
  textTransform: "uppercase",
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

const ButtonContainer = styled(FlexCenter)(({ theme }) => ({
  height: "fit-content",
}));

const ShareButton = styled(ActionButton)(({ theme }) => ({
  "&.MuiButton-contained": {
    border: `solid 1px ${alpha(theme.palette.primary.main, 0.5)}`,
    backgroundColor: theme.palette.background.paper,
    padding: "8px 24px",

    "&.Mui-disabled": {
      border: `solid 1px ${theme.palette.background.dark}`,
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
  const params = useSearchParams();

  const redirectUri = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_CLIENT_URI;
  const clientId = process.env.NEXT_PUBLIC_TWITTER_API_CLIENT_ID;

  const isAccessDenied = params.get("error") === "access_denied";
  const authCode = params.get("code");

  const userId = parseCookie("username") || "";
  const isGranted = parseCookie("isAccessGranted") || "";

  const [link, setLink] = useState<string>("");
  const [tweetId, setTweetId] = useState<string>("");
  const [twitterId, setTwitterId] = useState<string>(userId);

  /**
   * After the user authorized the app, request for access token,
   * skip this query when the user has authorized rns app, call refreshToken instead
   */
  const { data: tokenResponse } = useGetAccessTokenQuery(
    { code: authCode || "", redirect: redirectUri, state: "modal-Share RNS" },
    { skip: isEmpty(authCode) || !isEmpty(userId) }
  );

  const accessToken =
    tokenResponse?.token?.access_token || parseCookie("access_token") || "";

  /**
   * Get the user data after successful authorization and token request,
   * Skip this query if there is already a user stored in cookie
   *
   * This will return the userid
   */
  const { data: userResponse } = useGetUserDetailsQuery(
    { token: accessToken },
    { skip: isEmpty(accessToken) || !isEmpty(twitterId) }
  );

  /**
   * Verify the link provided.
   * Skip this call when there is no tweetId and access_token provided
   */
  const {
    data: tweetResponse,
    isFetching: isVerifying,
    isSuccess: isVerified,
    isError: isVerifyFailed,
  } = useGetTweetByIdQuery(
    { tweetId: tweetId || "", token: accessToken },
    { skip: isEmpty(accessToken) || isEmpty(tweetId) }
  );

  const handleLink = () => {
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
    const isSuccess = tokenResponse?.isSuccess || false;

    if (isSuccess) {
      // TODO: add security
      // document.cookie = `access_token=${tokenResponse?.token?.access_token}; path=/`;
    }
  }, [tokenResponse]);

  useEffect(() => {
    const isSuccess = userResponse?.isSuccess || false;
    if (isSuccess) {
      // TODO: add security
      document.cookie = `username=@${userResponse?.data?.username}; path=/`;
      setTwitterId(userResponse?.data?.username || "");
    }
  }, [userResponse]);

  useEffect(() => {
    if (isAccessDenied) {
      document.cookie = `access=denied; path=/`;
    } else {
      document.cookie = `access=granted; path=/`;
    }
  }, [isAccessDenied]);

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
              disabled={!isEmpty(userId)}
              onClick={() => {
                handleLink();
              }}
            >
              <FlexCenter>
                <ButtonLabel
                  status={
                    isAccessDenied
                      ? "denied"
                      : !isEmpty(userId)
                      ? "disabled"
                      : ""
                  }
                >
                  {isAccessDenied
                    ? "Denied"
                    : !isEmpty(userId)
                    ? "Linked"
                    : "Link"}
                </ButtonLabel>
                {!isEmpty(authCode) && isEmpty(userId) && (
                  <CircularProgress size="16px" sx={{ ml: "8px" }} />
                )}
              </FlexCenter>
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
              disabled={isEmpty(userId) || isVerified}
              variant="contained"
              onClick={() => {
                handleTweet();
              }}
            >
              <ButtonLabel
                status={isEmpty(userId) || isVerified ? "disabled" : ""}
              >
                Tweet
              </ButtonLabel>
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
            <ShareButton
              disabled={isEmpty(userId)}
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
                <ButtonLabel status={false ? "disabled" : ""}>
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
