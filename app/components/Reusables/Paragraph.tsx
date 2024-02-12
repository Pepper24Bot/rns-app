import React from "react";
import { Description } from "@/redux/modal/modalSlice";
import { HighlightText } from "../Theme/StyledGlobal";
import { Grid, styled } from "@mui/material";

export interface Paragraph {
  description?: Description | string;
}

const Description = styled(Grid)(({ theme }) => ({
  fontFamily: "Roboto Mono",
  textAlign: "center",
  fontSize: "12px",
  fontWeight: 200,
  color: theme.palette.secondary.main,
}));

export const Paragraph: React.FC<Paragraph> = (props: Paragraph) => {
  const getDescription = (desc?: Description | string) => {
    if (typeof desc === "object") {
      const pattern = new RegExp(`(${desc.highlights?.join("|")})`);
      const texts = desc.content.split(pattern);

      return (
        <>
          {texts.map((text) => {
            return (
              <React.Fragment key={text}>
                {desc.highlights?.includes(text) ? (
                  <HighlightText>{text}</HighlightText>
                ) : (
                  <>{text}</>
                )}
              </React.Fragment>
            );
          })}
        </>
      );
    } else {
      return desc;
    }
  };

  return <Description>{getDescription(props?.description)}</Description>;
};

export default Paragraph;
