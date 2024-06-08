import React from "react";
import { FlexCenter, Tip } from "../Theme/StyledGlobal";
import { Collapse, Link as MuiLink, styled } from "@mui/material";
import useNetworkConfig from "@/hooks/useNetworkConfig";

const TransactionTip = styled(Tip)(({ theme }) => ({
  width: "100%",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const Link = styled(MuiLink)(({ theme }) => ({
  textDecoration: "none",
  width: "calc(100% - 64px)",
}));

interface Transaction {
  isVisible: boolean;
  hash: string;
}

export const ViewTransaction: React.FC<Transaction> = (props: Transaction) => {
  const { isVisible, hash } = props;
  const { config } = useNetworkConfig();

  const getUrl = () => {
    return `${config.blockExplorers.default.url}/tx/${hash}`;
  };

  return (
    <Collapse in={isVisible}>
      <FlexCenter>
        <Link href={getUrl()} target="_blank">
          <TransactionTip isVisible={isVisible}>
            View Transaction
          </TransactionTip>
        </Link>
      </FlexCenter>
    </Collapse>
  );
};

export default ViewTransaction;
