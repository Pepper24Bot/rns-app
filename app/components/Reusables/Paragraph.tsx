import React from "react";
import { Description } from "@/redux/modal/modalSlice";
import {
  Description as StyledDescription,
  HighlightText,
} from "../Theme/StyledGlobal";

export interface Paragraph {
  description?: Description | string;
}

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

  return (
    <StyledDescription>{getDescription(props?.description)}</StyledDescription>
  );
};

export default Paragraph;
