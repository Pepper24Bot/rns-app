"use client";

/**
 * Careful in updating this component.
 * This is tightly coupled (Policy and Terms)
 *
 * If you need another pdf renderer, create a new component instead.
 */

import React, { useState } from "react";
import { Grid, styled } from "@mui/material";
import { pdfjs, Document, Page } from "react-pdf";

import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const options = {
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};

interface PolicyAndTerms {
  type: "Policy" | "Terms";
}

const PdfContainer = styled(Grid)(({ theme }) => ({
  height: "400px",
  maxWidth: "560px",
  width: "100%",
  overflow: "auto",
}));

export const PolicyAndTerms: React.FC<PolicyAndTerms> = (
  props: PolicyAndTerms
) => {
  const { type } = props;

  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const getFileName = () => {
    switch (type) {
      case "Policy":
        return "/documents/rns-privacy-view.pdf";
      case "Terms":
        return "/documents/rns-terms-view.pdf";
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
    const pageNumber = options.pageNumber;
    const height = options.height;

    console.log("options:: ", options);

    // TODO: Enable case insensitivity
    // (?i:.rootnameservice.com) -- fix this
    const pattern = new RegExp(
      /(?:.ROOTNAMESERVICE.COM|.rootnameservice.com)/g
    );

    // this means it is a header
    if (height === 16) {
      return `<span class="${
        pageNumber > 1 ? "custom_heading" : "custom_top_heading"
      }">${text}</span>`;
    } else if (text.match(pattern)) {
      return `
        <a class="custom-link" href="${getHref(text)}" target="_blank">
          <span class="${
            pageNumber > 1 ? "custom_span" : "top_page_span"
          }">${text}</span>
        </a>
      `;
    } else if (pageNumber > 1) {
      return `<span style="top: -75px; left: -40px;">${text}</span>`;
    } else {
      return `<span style="left: -40px">${text}</span>`;
    }
  };

  return (
    <PdfContainer>
      <div className="document-container">
        <Document
          file={getFileName()}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
        >
          {Array.from(new Array(numPages), (_, index) => {
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
          })}
        </Document>
      </div>
    </PdfContainer>
  );
};

export default PolicyAndTerms;
