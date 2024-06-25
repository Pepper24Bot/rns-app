import React from "react";
import {
  Tab,
  alpha,
  styled,
  Collapse,
  Grid,
  Tabs as MuiTabs,
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
import useFeatureToggle from "@/hooks/useFeatureToggle";
import Toolbar from "./Toolbar";

export const GridContainer = styled(FlexCenter)(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha(theme.palette.background.darker, 0.35),
  marginBottom: "10px",
}));

export const Container = styled(Grid)(({ theme }) => ({
  maxWidth: "1400px",
  width: "100%",
  padding: "30px 80px",

  [theme.breakpoints.down("sm")]: {
    padding: "30px 20px",
  },
}));

export const ContentContainer = styled(Grid)(({ theme }) => ({
  marginTop: "30px",
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

export const Tabs = styled(MuiTabs)(({ theme }) => ({
  borderBottom: `solid 1px ${alpha(theme.palette.text.primary, 0.25)}`,

  "&.MuiTabs-root": {
    minHeight: 0,
  },
}));

export const TabItem = styled(Tab)(({ theme }) => ({
  textTransform: "capitalize",
  color: theme.palette.text.primary,

  "&.MuiTab-root": {
    padding: "8px 30px",
    backgroundColor: alpha(theme.palette.primary.dark, 0.05),
    fontSize: "16px",
    fontFamily: "var(--secondary-font)",
    minHeight: 0,

    "&:not(:first-of-type)": {
      borderLeft: `solid 2px ${theme.palette.background.paper}`,
    },

    "&:first-of-type": {
      borderRadius: "8px 0 0 0",
    },

    "&:last-child": {
      borderRadius: "0 8px 0 0",
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
}

export const Content: React.FC<ContentProps> = (props: ContentProps) => {
  const { isVisible, title, tabs, content, activeTab, onTabChange } = props;

  const { isFeatureEnabled } = useFeatureToggle();

  return (
    <Collapse in={isVisible}>
      <GridContainer id={`${title}-Container`}>
        <Container>
          <FlexJustified container>
            <Grid>
              <Title id={`${title}`}>{title}</Title>
            </Grid>
            <Grid item md={6} lg={5}>
              <Toolbar />
            </Grid>
          </FlexJustified>
          <ContentContainer>
            <Grid>
              <Tabs
                value={activeTab}
                onChange={(_, value) => {
                  onTabChange(value);
                }}
              >
                {tabs?.map((item, index) => {
                  return (
                    isFeatureEnabled(item) && (
                      <TabItem key={item} label={item.toUpperCase()} />
                    )
                  );
                })}
              </Tabs>
            </Grid>
            <Grid id="Tab-Content">{content}</Grid>
          </ContentContainer>
        </Container>
      </GridContainer>
    </Collapse>
  );
};

export default Content;
