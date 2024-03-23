"use client";

/**
 * Careful in updating this component.
 * This is tightly coupled (Policy and Terms)
 *
 * If you need another pdf renderer, create a new component instead.
 */

import React, { useState } from "react";
import { Grid, Typography, styled } from "@mui/material";
import { pdfjs, Document, Page } from "react-pdf";

import "react-pdf/dist/esm/Page/TextLayer.css";
import { BaseButton, FlexCenter, SecondaryLabel } from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import { grey } from "@mui/material/colors";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const options = {
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};

interface PolicyAndTerms {
  type: "Policy" | "Terms";
}

const PdfContainer = styled(Grid)(({ theme }) => ({}));

const Content = styled(Grid)(({ theme }) => ({
  height: "400px",
  width: "100%",
  overflow: "auto",
}));

const PageSteps = styled(FlexCenter)(({ theme }) => ({}));

const PageLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: FONT_WEIGHT.Bold,
  padding: "16px",
}));

const ButtonLabel = styled(SecondaryLabel, {
  shouldForwardProp: (prop) => prop !== "isDisabled",
})<{ isDisabled?: boolean }>(({ theme, isDisabled }) => ({
  fontSize: "14px",
  color: isDisabled ? grey[500] : theme.palette.primary.main,
}));

export const PolicyAndTerms: React.FC<PolicyAndTerms> = (
  props: PolicyAndTerms
) => {
  const { type } = props;

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const getFileName = () => {
    switch (type) {
      case "Policy":
        return "/documents/rns-privacy-policy.pdf";
      case "Terms":
        return "/documents/rns-terms-of-service.pdf";
      default:
        return "";
    }
  };

  const getHref = (url: string) => {
    if (url.toLocaleLowerCase() === "support@rootnameservice.com") {
      return "mailto:support@rootnameservice.com";
    } else {
      return url;
    }
  };

  const getTextRenderer = (options: any) => {
    const text = options.str;
    const height = options.height;

    // TODO: Enable case insensitivity
    // (?i:.rootnameservice.com) -- fix this
    const pattern = new RegExp(
      /(?:.ROOTNAMESERVICE.COM|.rootnameservice.com)/g
    );

    // this means it is a header
    if (height > 12) {
      return `<span class="custom_heading">${text}</span>`;
    } else if (text.match(pattern)) {
      return `
        <a class="custom-link" href="${getHref(text)}" target="_blank">
          <span class="custom_span">${text}</span>
        </a>
      `;
    } else {
      return `<span>${text}</span>`;
    }
  };

  return (
    <PdfContainer>
      <div className="document-container">
        <Content>
          <Document
            file={getFileName()}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            renderMode="canvas"
          >
            {/* {Array.from(new Array(numPages), (_, index) => {
            return (
              <Page
                className={type === "Policy" ? "Policy-Page" : ""}
                key={`pdf_page_${index + 1}`}
                pageNumber={index + 1}
                renderAnnotationLayer={false} // creating a custom annotation
                canvasBackground="transparent"
                customTextRenderer={(options) => {
                  return getTextRenderer(options);
                }}
              />
            );
          })} */}
            <Page
              pageNumber={pageNumber}
              renderAnnotationLayer={false} // creating a custom annotation
              canvasBackground="transparent"
              customTextRenderer={(options) => {
                return getTextRenderer(options);
              }}
            />
          </Document>
        </Content>
        <FlexCenter>
          <PageSteps>
            <BaseButton
              disabled={pageNumber <= 1}
              onClick={() => {
                previousPage();
              }}
            >
              <ButtonLabel isDisabled={pageNumber <= 1}>Previous</ButtonLabel>
            </BaseButton>
            <PageLabel>
              Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            </PageLabel>
            <BaseButton
              disabled={pageNumber >= numPages}
              onClick={() => {
                nextPage();
              }}
            >
              <ButtonLabel isDisabled={pageNumber >= numPages}>
                Next
              </ButtonLabel>
            </BaseButton>
          </PageSteps>
        </FlexCenter>
      </div>
    </PdfContainer>
  );
};

export default PolicyAndTerms;
