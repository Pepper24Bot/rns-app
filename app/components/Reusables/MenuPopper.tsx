import React from "react";
import { Box, Fade, Grid, Paper, Popper, styled } from "@mui/material";

export interface MenuPopper {
  children?: React.ReactNode;
  isOpen: boolean;
  anchorEl: HTMLButtonElement | null;
}

const Container = styled(Grid)(({ theme }) => ({
  background: "linear-gradient(180deg, #000000 32.5%, #c2185b 100%)",
  borderRadius: "8px",
  marginTop: "8px",
  padding: "1px",
}));

const Content = styled(Paper)(({ theme }) => ({
  padding: "50px 30px 40px 30px",
  borderRadius: "8px",
}));

export const MenuPopper: React.FC<MenuPopper> = (props: MenuPopper) => {
  const { children, isOpen, anchorEl } = props;

  return (
    <Box>
      <Popper
        sx={{ zIndex: 1200 }}
        open={isOpen}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Container>
              <Content>{children}</Content>
            </Container>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default MenuPopper;
