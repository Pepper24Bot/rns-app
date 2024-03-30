import React from "react";
import {
  Menu as MuiMenu,
  styled,
  alpha,
  Divider,
  Grid,
  MenuItem,
} from "@mui/material";
import { BaseIconButton, SecondaryLabel } from "../Theme/StyledGlobal";

export interface Option {
  label: string;
  icon?: React.ReactNode;
}

export type DropdownType = "Menu" | "Options";

export interface DropdownProps {
  arrow?: boolean;
  type?: DropdownType;
  isSelected?: boolean;
}

export interface DropDown {
  selectedOption?: string;
  options: Option[];
  arrow?: boolean;
  type?: DropdownType;
  hasButton?: boolean;
  /** if hasButton is true, this should be provided */
  iconButton?: React.ReactNode;
  handleSelect: (option: string) => void | any;

  /** if hasButton is true, these are no longer necessary */
  isOpen?: boolean;
  anchorRef?: React.RefObject<HTMLButtonElement>;
  handleClose?: (event: Event | React.SyntheticEvent) => void;
  handleOpen?: () => void;
}

const Menu = styled(MuiMenu, {
  shouldForwardProp: (prop) => prop !== "props",
})<{ props?: DropdownProps }>(({ theme, props }) => ({
  marginTop: props?.type === "Menu" ? "10px" : "20px",
  marginLeft: props?.type === "Menu" ? "5px" : "25px",

  ".MuiPaper-root": {
    borderRadius: "4px 4px 8px 8px",
    filter: `drop-shadow(0px 0px 10px ${alpha(
      theme.palette.primary.main,
      0.1
    )})`,
    background: `linear-gradient(180deg, #000000 32.5%, ${alpha(
      theme.palette.primary.main,
      0.5
    )} 100%)`,
  },

  ".MuiMenu-list": {
    backgroundColor:
      props?.type === "Options"
        ? theme.palette.background.paper
        : theme.palette.background.darker,
    margin: "1px",
    borderRadius: "4px 4px 8px 8px",
    padding: "8px 0",
  },

  ".MuiMenuItem-root": {
    padding: "10px 20px",
  },

  ".MuiDivider-root": {
    margin: "0 15px !important", // override inline styling of mui
  },
}));

const Label = styled(SecondaryLabel, {
  shouldForwardProp: (prop) => prop !== "props",
})<{ props?: DropdownProps }>(({ theme, props }) => ({
  marginLeft: "5px",
  fontSize: props?.type === "Options" ? "16px" : "14px",
  minWidth: "100px",
  color: props?.isSelected
    ? theme.palette.primary.main
    : theme.palette.text.primary,
}));

const ArrowButton = styled(BaseIconButton)(({ theme }) => ({
  borderRadius: "32px",
  backgroundColor: "transparent",
  padding: "4px",
}));

export const DropDownMenu: React.FC<DropDown> = (props: DropDown) => {
  const btnAnchorRef = React.useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const {
    arrow,
    options,
    iconButton,
    hasButton = false,
    selectedOption = "",
    anchorRef = btnAnchorRef,
    isOpen = isMenuOpen,
    type = "Options",
    handleClose,
    handleOpen,
    handleSelect,
  } = props;

  const handleOnOpen = () => {
    if (handleOpen !== undefined) {
      handleOpen();
    } else {
      setIsMenuOpen((prevOpen) => !prevOpen);
    }
  };

  const onClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setIsMenuOpen(false);
  };

  const handleOnClose = (event: Event | React.SyntheticEvent) => {
    if (handleClose !== undefined) {
      handleClose(event);
    } else {
      onClose(event);
    }
  };

  return (
    <>
      {hasButton && (
        <ArrowButton onClick={handleOnOpen} ref={btnAnchorRef}>
          {iconButton}
        </ArrowButton>
      )}
      <Menu
        props={{ arrow, type }}
        anchorEl={anchorRef.current}
        open={isOpen}
        onClose={handleOnClose}
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
            <Grid key={`field-item-${option.label}`}>
              <MenuItem
                // disabled={option.label === selectedOption}
                onClick={(event) => {
                  if (option.label !== selectedOption) {
                    handleOnClose(event);
                    handleSelect(option.label);
                  }
                }}
              >
                {option.icon}
                <Label
                  props={{
                    isSelected: option.label === selectedOption,
                    type,
                  }}
                >
                  {option.label}
                </Label>
              </MenuItem>
              {index !== options.length - 1 && <Divider />}
            </Grid>
          );
        })}
      </Menu>
    </>
  );
};

export default DropDownMenu;
