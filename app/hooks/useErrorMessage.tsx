import { SecondaryLabel } from "@/components/Theme/StyledGlobal";
import { ErrorResponse } from "@/services/interfaces";
import { Grid, darken, styled } from "@mui/material";

const Reason = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
}));

const Details = styled(Reason)(({ theme }) => ({
  fontSize: "13px",
  paddingTop: "16px",
  color: darken(theme.palette.text.secondary, 0.35),
}));

export default function useErrorMessage() {
  const getInvalidAddress = (error: ErrorResponse) => {
    return (
      <Grid>
        <Reason>{`Invalid Address!`}</Reason>
        <Details>{`${error.value}`}</Details>
      </Grid>
    );
  };

  /**
   *
   * @param reason
   */
  const getErrorMessage = (error: ErrorResponse) => {
    if (error.message.includes("invalid address")) {
      return getInvalidAddress(error);
    } else {
      return error.shortMessage || error.message;
    }
  };

  const getProxyErrorMessage = (error: string) => {
    const details = error.split("Details: ");
    const reason = details[1].split("Version")[0];

    return reason || error;
  };

  return { getErrorMessage, getProxyErrorMessage };
}
