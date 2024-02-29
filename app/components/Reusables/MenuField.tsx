import React from "react";
import {
  BaseIconButton,
  FieldContainer,
  Flex,
  FlexCenter,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import {
  styled,
  alpha,
  MenuItem,
  Menu as MuiMenu,
  Grid,
  Divider,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";

export interface Menu {
  options: string[];
  label: string;
  selectedOption: string;
  arrow?: boolean;
  handleOptionSelect: (option: string) => void | any;
}

const PaymentLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  color: alpha(theme.palette.primary.contrastText, 0.5),
}));

const MenuLabel = styled(PaymentLabel, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  minWidth: "100px",
  color: isSelected
    ? theme.palette.primary.main
    : theme.palette.primary.contrastText,
}));

const ArrowDownIcon = styled(ArrowDropDown)(({ theme }) => ({
  cursor: "pointer",
}));

const ArrowButton = styled(BaseIconButton)(({ theme }) => ({
  borderRadius: "32px",
  backgroundColor: "transparent",
  padding: 0,
}));

const Menu = styled(MuiMenu, {
  shouldForwardProp: (prop) => prop !== "arrow",
})<{ arrow?: boolean }>(({ theme, arrow }) => ({
  marginTop: arrow ? "" : "25px",
  marginLeft: arrow ? "" : "25px",

  ".MuiPaper-root": {
    borderRadius: "4px 4px 8px 8px",
    background: `linear-gradient(180deg, #000000 32.5%, ${alpha(
      theme.palette.primary.main,
      0.25
    )} 100%)`,
  },

  ".MuiMenu-list": {
    backgroundColor: theme.palette.background.paper,
    margin: "1px",
    borderRadius: "4px 4px 8px 8px",
    padding: "8px 0",
  },

  ".MuiMenuItem-root": {
    padding: "10px 25px",
  },

  ".MuiDivider-root": {
    margin: "0 15px !important", // override inline styling of mui
  },
}));

export const MenuField: React.FC<Menu> = (props: Menu) => {
  const { label, options, selectedOption, arrow, handleOptionSelect } = props;

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setIsMenuOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setIsMenuOpen(false);
  };

  return (
    <Flex>
      <FlexCenter container>
        <Grid item xs={4.75}>
          <PaymentLabel>{label}</PaymentLabel>
        </Grid>
        <FieldContainer item xs>
          {selectedOption}
          <ArrowButton ref={anchorRef}>
            <ArrowDownIcon onClick={handleToggle} />
          </ArrowButton>
        </FieldContainer>
      </FlexCenter>
      <Menu
        arrow={arrow}
        anchorEl={anchorRef.current}
        open={isMenuOpen}
        onClose={handleClose}
        slotProps={{
          paper: arrow
            ? {
                elevation: 0,
                sx: {
                  backgroundColor: "black",
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 10,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }
            : {},
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {options?.map((option, index) => {
          return (
            <Grid>
              <MenuItem
                disabled={option === selectedOption}
                onClick={(event) => {
                  if (option !== selectedOption) {
                    handleClose(event);
                    handleOptionSelect(option);
                  }
                }}
              >
                <MenuLabel isSelected={option === selectedOption}>
                  {option}
                </MenuLabel>
              </MenuItem>
              {index !== options.length - 1 && <Divider />}
            </Grid>
          );
        })}
      </Menu>
    </Flex>
  );
};

export default MenuField;
