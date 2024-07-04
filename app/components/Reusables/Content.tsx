import React from "react";
import {
  Tab,
  alpha,
  styled,
  Collapse,
  Grid,
  Tabs as MuiTabs,
  Box,
} from "@mui/material";
import { Search as MuiSearchIcon } from "@mui/icons-material";
import {
  BaseIconButton,
  BaseInputField,
  FlexCenter,
  FlexJustified,
  Heading,
} from "../Theme/StyledGlobal";
import { FONT_SIZE } from "../Theme/Global";
import useFeatureToggle, { FeatureList } from "@/hooks/useFeatureToggle";

export const GridContainer = styled(FlexCenter, {
  shouldForwardProp: (prop) => prop !== "isTransparent",
})<{ isTransparent?: boolean }>(({ isTransparent = false, theme }) => ({
  position: "relative",
  backgroundColor: isTransparent
    ? "transparent"
    : alpha(theme.palette.background.darker, 0.35),
  marginBottom: "10px",
}));

export const Container = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "fullWidth",
})<{ fullWidth?: boolean }>(({ fullWidth = false, theme }) => ({
  maxWidth: "1400px",
  width: "100%",
  padding: fullWidth ? "0 0 20px 0" : "30px 50px",

  [theme.breakpoints.down("sm")]: {
    padding: fullWidth ? "0 0 20px 0" : "30px 20px",
  },
}));

export const ContentContainer = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "fullWidth",
})<{ fullWidth?: boolean }>(({ fullWidth = false, theme }) => ({
  marginTop: fullWidth ? 0 : "30px",
}));

export const SearchField = styled(BaseInputField)(({ theme }) => ({
  ".MuiInputBase-input": {
    padding: "10px 16px 10px 25px",
  },

  ".MuiInputBase-root": {
    backgroundColor: theme.palette.background.darker,
  },

  "&.MuiFormControl-root": {
    width: "100%",
  },
}));

export const SearchIcon = styled(MuiSearchIcon)(({ theme }) => ({
  height: "24px",
  width: "24px",
}));

export const IconButton = styled(BaseIconButton)(({ theme }) => ({
  marginLeft: "8px",
}));

export const Title = styled(Heading)(({ theme }) => ({
  fontSize: "36px",

  [theme.breakpoints.down("lg")]: {
    fontSize: FONT_SIZE.Xlarge,
  },
}));

export const Tabs = styled(MuiTabs)(
  ({ orientation = "horizontal", theme }) => ({
    borderBottom:
      orientation === "horizontal"
        ? `solid 1px ${alpha(theme.palette.primary.dark, 0.25)}`
        : "none",

    borderRight:
      orientation === "vertical"
        ? `solid 1px ${alpha(theme.palette.primary.dark, 0.25)}`
        : "none",

    "&.MuiTabs-root": {
      overflow: "overlay",
      minWidth: "135px",
      minHeight: 0,
    },
  })
);

export const TabItem = styled(Tab, {
  shouldForwardProp: (prop) => prop !== "orientation",
})<{ orientation?: string }>(({ orientation = "horizontal", theme }) => ({
  textTransform: "capitalize",
  color: theme.palette.text.primary,

  "&.MuiTab-root": {
    padding: orientation === "horizontal" ? "8px 30px" : "8px",
    backgroundColor: alpha(theme.palette.primary.dark, 0.05),
    fontSize: orientation === "horizontal" ? "16px" : "14px",
    textAlign: "end",
    fontFamily: "var(--secondary-font)",
    minHeight: 0,
    alignSelf: "end",

    "&:not(:first-of-type)": {
      borderLeft:
        orientation === "horizontal"
          ? `solid 2px ${theme.palette.background.paper}`
          : "none",
    },

    "&:not(:last-of-type)": {
      borderBottom:
        orientation === "vertical"
          ? `solid 2px ${theme.palette.background.paper}`
          : "none",
    },

    "&:first-of-type": {
      marginTop: orientation === "horizontal" ? "" : "50px",
      borderRadius: orientation === "horizontal" ? "8px 0 0 0" : "0",
    },

    "&:last-child": {
      borderRadius: orientation === "horizontal" ? "0 8px 0 0" : "0",
    },

    "&.Mui-selected": {
      color: theme.palette.text.primary,
      backgroundColor: alpha(theme.palette.primary.dark, 0.5),
    },
  },
}));

export interface ContentProps {
  title?: string;
  isVisible?: boolean;
  tabs?: string[];
  content: React.ReactNode;
  activeTab?: number;
  onTabChange: (tab: number) => void;
  toolbar: React.ReactNode;
  isSubTabs?: boolean;
  orientation?: "horizontal" | "vertical";
}

export const Content: React.FC<ContentProps> = (props: ContentProps) => {
  const {
    isVisible = true,
    title,
    tabs,
    content,
    activeTab,
    onTabChange,
    toolbar,
    isSubTabs,
    orientation,
  } = props;

  const { isFeatureEnabled } = useFeatureToggle();

  return (
    <Collapse in={isVisible}>
      <GridContainer id={`${title}-Container`} isTransparent={isSubTabs}>
        <Container fullWidth={isSubTabs}>
          <FlexJustified container>
            <Grid>
              <Title id={`${title}`}>{title}</Title>
            </Grid>
            <Grid item md={6} lg={5}>
              {toolbar}
            </Grid>
          </FlexJustified>
          <ContentContainer fullWidth={isSubTabs}>
            <Grid display={orientation === "vertical" ? "flex" : "inherit"}>
              <Tabs
                orientation={orientation}
                value={activeTab}
                onChange={(_, value) => {
                  onTabChange(value);
                }}
                // variant="scrollable"
                // scrollButtons
                // allowScrollButtonsMobile
              >
                {tabs?.map((item) => {
                  return (
                    isFeatureEnabled(
                      FeatureList[item as keyof typeof FeatureList]
                    ) && (
                      <TabItem
                        key={item}
                        label={item}
                        orientation={orientation}
                      />
                    )
                  );
                })}
              </Tabs>
              <Grid
                id="Tab-Content"
                sx={{
                  width: "-webkit-fill-available",
                  // backgroundColor:
                  //   orientation === "vertical"
                  //     ? "background.paper"
                  //     : "transparent",
                }}
              >
                {content}
              </Grid>
            </Grid>
          </ContentContainer>
        </Container>
      </GridContainer>
    </Collapse>
  );
};

export default Content;
