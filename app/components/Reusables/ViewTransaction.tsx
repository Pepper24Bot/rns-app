import React from "react";
import { FlexCenter, Tip } from "../Theme/StyledGlobal";
import { Link as MuiLink, styled } from "@mui/material";
import useNetworkConfig from "@/hooks/useNetworkConfig";

const TransactionTip = styled(Tip)(({ theme }) => ({
  width: "100%",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const Link = styled(MuiLink)(({ theme }) => ({
  textDecoration: "none",
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
    <FlexCenter>
      <Link href={getUrl()} target="_blank" sx={{ width: "calc(100% - 64px)" }}>
        <TransactionTip isVisible={isVisible}>View Transaction</TransactionTip>
      </Link>
    </FlexCenter>
  );
};

export default ViewTransaction;
