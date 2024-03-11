"use client";

import React from "react";
import { Grid, Link, Typography, alpha, styled } from "@mui/material";
import { useModalState } from "@/redux/modal/modalSlice";
import {
  FlexCenter,
  FlexJustified,
  Relative,
  SocialButton,
} from "../Theme/StyledGlobal";
import { grey } from "@mui/material/colors";
import { FeatureList } from "@/hooks/useFeatureToggle";

import Image from "next/image";
import EmailSubscription from "./EmailSubscription";
import FeatureToggle from "../Reusables/FeatureToggle";
import { FONT_WEIGHT } from "../Theme/Global";

const Page = styled(Grid)(({ theme }) => ({
  width: "100%",
}));

const Footer = styled(FlexCenter)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  textAlign: "center",
}));

const Logo = styled(Grid)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.dark, 0.05),
  padding: "20px",
}));

const Content = styled(Grid)(({ theme }) => ({
  paddingTop: "16px",
}));

const Terms = styled(FlexJustified)(({ theme }) => ({
  padding: "20px 50px",
}));

const Copyright = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: FONT_WEIGHT.Regular,
  color: alpha(grey[50], 0.75),
}));

const TermsPolicy = styled(Link)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: FONT_WEIGHT.Regular,
  color: alpha(grey[50], 0.35),
  padding: "0 8px",
}));

export const PageFooter: React.FC = () => {
  const { toggleModal } = useModalState();

  return (
    <Relative>
      <FeatureToggle feature={FeatureList.Subscription}>
        <EmailSubscription />
      </FeatureToggle>
      <Footer>
        <Page>
          <Logo>
            <Image
              src="/images/rns-logo-4.png"
              alt="RNS Icon"
              width={400}
              height={30}
            />
            <Content>
              <FlexCenter>
                <Link
                  href="https://twitter.com/RootNameService"
                  target="_blank"
                >
                  <SocialButton variant="outlined">
                    <i className="fa-brands fa-discord fa-xl" />
                  </SocialButton>
                </Link>
                <Link
                  href="https://twitter.com/RootNameService"
                  target="_blank"
                >
                  <SocialButton variant="outlined">
                    <i className="fa-brands fa-x-twitter fa-xl" />
                  </SocialButton>
                </Link>
                <Link
                  href="https://twitter.com/RootNameService"
                  target="_blank"
                >
                  <SocialButton variant="outlined">
                    <i className="fa-solid fa-envelope fa-lg" />
                  </SocialButton>
                </Link>
              </FlexCenter>
            </Content>
          </Logo>
          <Terms>
            <Copyright>©2024 All Rights Reserved</Copyright>
            <FlexCenter>
              <TermsPolicy
                onClick={() => {
                  toggleModal({
                    id: "Policy",
                    title: "Privacy Policy",
                    isXDisabled: true,
                    isFooterEnabled: true,
                    isHeaderEnabled: true,
                    downloadFile: "/documents/rns-privacy-policy.pdf",
                  });
                }}
              >
                Privacy Policy
              </TermsPolicy>
              <TermsPolicy
                onClick={() => {
                  toggleModal({
                    id: "Terms",
                    title: "Terms of Service",
                    isXDisabled: true,
                    isFooterEnabled: true,
                    isHeaderEnabled: true,
                    downloadFile: "/documents/rns-terms-of-service.pdf",
                  });
                }}
              >
                Terms of Service
              </TermsPolicy>
            </FlexCenter>
          </Terms>
        </Page>
      </Footer>
    </Relative>
  );
};

export default PageFooter;
