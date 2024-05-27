import React, { useState } from "react";
import { Grid, IconButton, Link, alpha, darken, styled } from "@mui/material";
import { FAQ } from "@/constants/content";
import { FlexCenter, SecondaryLabel } from "@/components/Theme/StyledGlobal";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { scrollIntoElement } from "@/utils/common";
import { isEmpty } from "lodash";
import { FONT_WEIGHT } from "@/components/Theme/Global";

const Container = styled(Grid)(({ theme }) => ({
  margin: "35px 0",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "4px",
}));

const Content = styled(Grid)(({ theme }) => ({
  padding: "35px",
  height: "775px", // fixed height
  overflow: "hidden",

  "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
    width: "0",
    height: "0",
  },
}));

const Question = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
  color: theme.palette.primary.main,
}));

const AnswerBox = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  padding: "20px",
  backgroundColor: isActive
    ? alpha(theme.palette.primary.dark, 0.2)
    : alpha(theme.palette.primary.dark, 0.1),
  border: isActive
    ? `solid 1px ${alpha(theme.palette.primary.main, 0.75)}`
    : `solid 1px ${alpha(theme.palette.primary.dark, 0.5)}`,
  marginTop: "20px",
}));

const Answer = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: darken(theme.palette.text.primary, 0.35),
  whiteSpace: "pre-line",
  wordBreak: "break-word",
}));

const ArrowContainer = styled(FlexCenter)(({ theme }) => ({
  position: "absolute",
  left: "calc(50% - 38px)",
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  padding: "2px",
  margin: "8px",
}));

const ArrowDownIcon = styled(KeyboardArrowDown)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const ArrowUpIcon = styled(KeyboardArrowUp)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const Highlight = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: FONT_WEIGHT.Bold,
}));

export const FrequentlyAsked: React.FC = () => {
  const [moreIndex, setMoreIndex] = useState<number>(0);

  // TODO: Optimize this
  const getHighlightedTexts = (
    content: string,
    highlights: { text: string; isUrl: boolean }[] = [],
    index: number = 0
  ) => {
    const highlightedTexts = highlights.map((option) => {
      return `(${option.text})`;
    });

    const pattern = RegExp(highlightedTexts.join("|"));
    const texts = content.split(pattern);

    return texts;
  };

  // TODO: Optimize this
  const getHighlight = (
    text: string,
    highlights: { text: string; isUrl: boolean }[] = []
  ) => {
    const option = highlights.find((highlight) => {
      return highlight.text.match(text);
    });

    return option;
  };

  return (
    <Container>
      {moreIndex >= 1 && (
        <ArrowContainer>
          <ArrowButton
            className="fa-beat"
            onClick={() => {
              scrollIntoElement(`Question-${moreIndex - 1}`, {
                block: "nearest",
              });
              setMoreIndex(moreIndex - 1);
            }}
          >
            <ArrowUpIcon fontSize="large" />
          </ArrowButton>
        </ArrowContainer>
      )}
      <Content>
        {FAQ.map((item, index) => {
          const texts = !isEmpty(item.highlights)
            ? getHighlightedTexts(item.content, item.highlights, index)
            : [];
          return (
            <Grid id={`Question-${index}`} key={item.title} pb={5}>
              <Question>{item.title}</Question>
              <AnswerBox isActive={index === moreIndex}>
                {!isEmpty(texts) ? (
                  <Answer>
                    {texts.map((text, index) => {
                      const highlight = getHighlight(text, item.highlights);
                      return highlight && highlight.isUrl ? (
                        <Link
                          key={`link-${text}-${index}`}
                          href="https://www.docs.rootnameservice.com"
                          target="_blank"
                        >
                          <Highlight>{text}</Highlight>
                        </Link>
                      ) : highlight && !highlight.isUrl ? (
                        <Highlight key={`highlight-${text}-${index}`}>
                          {text}
                        </Highlight>
                      ) : (
                        text && <span key={`span-${index}`}>{text}</span>
                      );
                    })}
                  </Answer>
                ) : (
                  <Answer>{item.content}</Answer>
                )}
              </AnswerBox>
            </Grid>
          );
        })}
      </Content>
      {moreIndex !== FAQ.length - 1 && (
        <ArrowContainer>
          <ArrowButton
            className="fa-beat"
            onClick={() => {
              scrollIntoElement(`Question-${moreIndex + 1}`, {
                block: "nearest",
              });
              setMoreIndex(moreIndex + 1);
            }}
          >
            <ArrowDownIcon fontSize="large" />
          </ArrowButton>
        </ArrowContainer>
      )}
    </Container>
  );
};

export default FrequentlyAsked;
