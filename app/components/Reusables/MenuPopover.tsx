import { Box, Grid, Popover, darken, styled } from "@mui/material";
import React from "react";

export interface MenuPopover {
  children?: React.ReactNode;
  isOpen: boolean;
  anchorEl: (EventTarget & HTMLElement) | HTMLButtonElement | null;
  toggleClose: () => void;
}

const Container = styled(Grid)(({ theme }) => ({
  background: "linear-gradient(180deg, #000000 32.5%, #c2185b 100%)",
  borderRadius: "8px",
  padding: "1px",
  minWidth: "250px",
}));

const Content = styled(Grid)(({ theme }) => ({
  padding: "20px",
  borderRadius: "8px",
  backgroundColor: darken(theme.palette.background.darker, 0.5),
}));

export const MenuPopover: React.FC<MenuPopover> = (props: MenuPopover) => {
  const { children, isOpen, anchorEl, toggleClose } = props;

  return (
    <Box>
      <Popover
        sx={{
          ".MuiPaper-root": {
            marginTop: "8px",
          },
        }}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={toggleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Container>
          <Content>{children}</Content>
        </Container>
      </Popover>
    </Box>
  );
};

export default MenuPopover;
