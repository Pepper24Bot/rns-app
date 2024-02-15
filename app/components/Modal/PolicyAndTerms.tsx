"use client";

import React, { useState } from "react";
import { Grid, styled } from "@mui/material";
import { pdfjs, Document, Page } from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const options = {
  standardFontDataUrl: "/standard_fonts/",
};

interface PolicyAndTerms {
  type: "Policy" | "Terms";
}

const PdfContainer = styled(Grid)(({ theme }) => ({
  height: "400px",
  maxWidth: "900px",
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
        return "/documents/rns-privacy-policy.pdf";
      case "Terms":
        return "/documents/rns-terms-of-service.pdf";
      default:
        return "";
    }
  };

  return (
    <PdfContainer>
      <div className="document-container">
        <Document
          file={getFileName()}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
          renderMode="canvas"
        >
          {Array.from(new Array(numPages), (_, index) => {
            return (
              numPages &&
              index !== numPages - 1 && (
                <Page key={`pdf_page_${index + 1}`} pageNumber={index + 1} />
              )
            );
          })}
        </Document>
      </div>
    </PdfContainer>
  );
};

export default PolicyAndTerms;
