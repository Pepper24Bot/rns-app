import React, { useCallback, useEffect, useState } from "react";
import {
  Collapse,
  Grid,
  Tab,
  alpha,
  styled,
  InputAdornment,
  Tabs as MuiTabs,
} from "@mui/material";
import { useAccount } from "wagmi";
import { debounce as _debounce, isEmpty } from "lodash";
import {
  BaseIconButton,
  BaseInputField,
  FlexCenter,
  FlexJustified,
  Heading,
} from "../Theme/StyledGlobal";
import { Search as MuiSearchIcon, Settings, Tune } from "@mui/icons-material";
import { DASHBOARD_TAB_ITEMS, DEFAULT_DEBOUNCE } from "@/services/constants";

import Names from "./Tab/Names";
import Favorites from "./Tab/Favorites";
import LoyaltyPoints from "./Tab/Loyalty";
import Notifications from "./Tab/Notifications";
import useFeatureToggle, { FeatureList } from "@/hooks/useFeatureToggle";
import FeatureToggle from "../Reusables/FeatureToggle";

const Container = styled(FlexCenter)(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha(theme.palette.background.darker, 0.35),
  marginBottom: "10px",
}));

const DashboardContainer = styled(Grid)(({ theme }) => ({
  maxWidth: "1240px",
  width: "100%",
  padding: "30px 80px",
}));

const Content = styled(Grid)(({ theme }) => ({
  marginTop: "30px",
}));

const SearchField = styled(BaseInputField)(({ theme }) => ({
  ".MuiInputBase-input": {
    padding: "10px 16px 10px 25px",
    width: "300px",
  },

  ".MuiInputBase-root": {
    backgroundColor: theme.palette.background.darker,
  },
}));

const SearchIcon = styled(MuiSearchIcon)(({ theme }) => ({
  height: "24px",
  width: "24px",
}));

const IconButton = styled(BaseIconButton)(({ theme }) => ({
  marginLeft: "8px",
}));

const Title = styled(Heading)(({ theme }) => ({}));

const Tabs = styled(MuiTabs)(({ theme }) => ({
  borderBottom: `solid 1px ${alpha(theme.palette.text.primary, 0.25)}`,

  "&.MuiTabs-root": {
    minHeight: 0,
  },
}));

const TabItem = styled(Tab)(({ theme }) => ({
  textTransform: "capitalize",
  color: theme.palette.text.primary,

  "&.MuiTab-root": {
    padding: "8px 30px",
    backgroundColor: alpha(theme.palette.primary.dark, 0.05),
    fontSize: "16px",
    fontFamily: "var(--secondary-font)",
    minHeight: 0,

    "&:not(:first-child)": {
      borderLeft: `solid 2px ${theme.palette.background.paper}`,
    },

    "&:first-child": {
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

export const Dashboard: React.FC = () => {
  const { address } = useAccount();
  const { isFeatureEnabled } = useFeatureToggle();

  const [activeTab, setActiveTab] = useState<number>(0); // tab-index
  const [searchValue, setSearchValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isDashboardVisible, setIsDashboardVisible] = useState<boolean>(false);

  /**
   * TODO:
   * Use RTK Query
   * This is an API call -- pending
   *
   * Should call api and search for the name inputted
   * @param value
   */
  const handleDebounceOnChange = (value: string) => {
    setSearchValue(value);
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );

  useEffect(() => {
    setIsDashboardVisible(!isEmpty(address));
  }, [address]);

  return (
    <Collapse in={isDashboardVisible}>
      <Container>
        <DashboardContainer>
          <FlexJustified>
            <Title>My Dashboard</Title>
            <Grid>
              <SearchField
                variant="filled"
                placeholder="Search..."
                value={inputValue}
                onChange={(event) => {
                  const { value } = event.target;
                  setInputValue(value);
                  debounceFn(value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton>
                <Settings />
              </IconButton>
              <IconButton>
                <Tune />
              </IconButton>
            </Grid>
          </FlexJustified>
          <Content>
            <Grid>
              <Tabs
                value={activeTab}
                onChange={(_, value) => {
                  setActiveTab(value);
                }}
              >
                {DASHBOARD_TAB_ITEMS.map((item, index) => {
                  return (
                    isFeatureEnabled(item) && (
                      <TabItem key={item} label={item} />
                    )
                  );
                })}
              </Tabs>
            </Grid>
            <Grid>
              {/* TODO: Add page routing */}
              <FeatureToggle feature={FeatureList.Names}>
                {activeTab === 0 && <Names />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.Names}>
                {activeTab === 1 && <Favorites />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.Names}>
                {activeTab === 2 && <LoyaltyPoints />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.Names}>
                {activeTab === 3 && <Notifications />}
              </FeatureToggle>
            </Grid>
          </Content>
        </DashboardContainer>
      </Container>
    </Collapse>
  );
};

export default Dashboard;
