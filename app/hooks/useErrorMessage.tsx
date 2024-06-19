import { SecondaryLabel } from "@/components/Theme/StyledGlobal";
import { ErrorResponse } from "@/services/interfaces";
import { Grid, darken, styled } from "@mui/material";

const Reason = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
}));

const Details = styled(Reason)(({ theme }) => ({
  fontSize: "13px",
  paddingTop: "10px",
  color: darken(theme.palette.text.secondary, 0.35),
}));

export default function useErrorMessage() {
  const getErrorDisplay = (reason: string, value: string = "") => {
    return (
      <Grid>
        <Reason>{reason}</Reason>
        {value && <Details>{`${value}`}</Details>}
      </Grid>
    );
  };

  /**
   *
   * @param reason
   */
  const getErrorMessage = (error: ErrorResponse) => {
    if (error.message.includes("invalid address")) {
      return getErrorDisplay("Invalid Address", error.value);
    } else {
      return error.shortMessage || error.message;
    }
  };

  const getProxyErrorMessage = (error: string) => {
    const details = error.split("Details: ");
    const reason = details[1].split("Version")[0];

    return reason || error;
  };

  return { getErrorMessage, getProxyErrorMessage, getErrorDisplay };
}
