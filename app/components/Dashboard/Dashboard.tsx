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
import { FONT_SIZE } from "../Theme/Global";
import {
  useGetNamesByIdQuery,
  useGetNamesByUserAndLabelQuery,
} from "@/redux/graphql/graphqlSlice";
import { Name, useDashboardState } from "@/redux/dashboard/dashboardSlice";
import { Address, formatEther } from "viem";

import Names from "./Tab/Names";
import Favorites from "./Tab/Favorites";
import LoyaltyPoints from "./Tab/Loyalty";
import Notifications from "./Tab/Notifications";
import useFeatureToggle, { FeatureList } from "@/hooks/useFeatureToggle";
import FeatureToggle from "../Reusables/FeatureToggle";
import FilterOption from "../Reusables/FilterOption";

const Container = styled(FlexCenter)(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha(theme.palette.background.darker, 0.35),
  marginBottom: "10px",
}));

const DashboardContainer = styled(Grid)(({ theme }) => ({
  maxWidth: "1400px",
  width: "100%",
  padding: "30px 80px",

  [theme.breakpoints.down("sm")]: {
    padding: "30px 40px",
  },
}));

const Content = styled(Grid)(({ theme }) => ({
  marginTop: "30px",
}));

const Toolbar = styled(Grid)(({ theme }) => ({
  paddingTop: "10px",
}));

const SearchField = styled(BaseInputField)(({ theme }) => ({
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

const SearchIcon = styled(MuiSearchIcon)(({ theme }) => ({
  height: "24px",
  width: "24px",
}));

const IconButton = styled(BaseIconButton)(({ theme }) => ({
  marginLeft: "8px",
}));

const Title = styled(Heading)(({ theme }) => ({
  fontSize: "36px",

  [theme.breakpoints.down("lg")]: {
    fontSize: FONT_SIZE.Xlarge,
  },
}));

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

export const Dashboard: React.FC = () => {
  const { address, status } = useAccount();
  const { isFeatureEnabled } = useFeatureToggle();
  const { updateNameList, toggleNamesLoading, useFilters } =
    useDashboardState();

  const options = useFilters();

  const [activeTab, setActiveTab] = useState<number>(0); // tab-index
  const [searchValue, setSearchValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isDashboardVisible, setIsDashboardVisible] = useState<boolean>(true); // show by default

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [viewAnchor, setViewAnchor] = useState<HTMLButtonElement | null>(null);

  const {
    data: searchedName,
    isLoading: searchedNameLoading,
    refetch,
  } = useGetNamesByUserAndLabelQuery(
    { labelName: searchValue, id: address?.toLowerCase() as Address },
    {
      skip: isEmpty(searchValue) || isEmpty(address),
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const { data: namesList, isLoading: namesListLoading } = useGetNamesByIdQuery(
    { id: address?.toLowerCase() || "" },
    { skip: address === null || activeTab !== 0 }
  );

  const handleDebounceOnChange = (value: string) => {
    setSearchValue(value);
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );

  // TODO: Make this sorting function reusable and move to util
  const getSortedNames = (list: Name[]) => {
    const sortBy = options?.sort?.by;
    const orderBy = options?.sort?.order;

    switch (sortBy) {
      case "Name":
        return list?.sort((a, b) => {
          return orderBy === "Ascending"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        });

      case "Created Date":
        return list?.sort((a, b) => {
          return orderBy === "Ascending"
            ? b.domain?.createdAt - a.domain?.createdAt
            : a.domain?.createdAt - b.domain?.createdAt;
        });

      case "Cost":
        return list?.sort((a, b) => {
          const costA = Number(
            formatEther(BigInt(a.domain?.registration?.cost))
          );
          const costB = Number(
            formatEther(BigInt(b.domain?.registration?.cost))
          );

          return orderBy === "High" ? costB - costA : costA - costB;
        });

      case "Length":
        return list?.sort((a, b) => {
          return orderBy === "High"
            ? b.name.length - a.name.length
            : a.name.length - b.name.length;
        });

      default:
        return list?.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const getFilteredNames = () => {
    let list: Name[] = [];

    // #1. Filter based on the name being searched
    if (searchValue !== "") {
      list = (searchedName?.nameWrappeds as Name[]) || [];
    } else {
      // #2. Then apply the filter options - TODO
      // #3. If there are no filters, return the whole list
      list = namesList?.nameWrappeds?.filter((item) => {
        return item.name !== null;
      }) as Name[];
    }

    // #4. Sort the list based on the options
    const sortedList = getSortedNames(list);
    updateNameList(sortedList);
  };

  const getList = () => {
    switch (activeTab) {
      // Names Tab
      case 0:
        getFilteredNames();
      // Favorites Tab
      case 1:
      default:
        return getFilteredNames();
    }
  };

  useEffect(() => {
    setIsDashboardVisible(!isEmpty(address));
  }, [address, status]);

  useEffect(() => {
    toggleNamesLoading(namesListLoading || searchedNameLoading);
  }, [namesListLoading, searchedNameLoading]);

  useEffect(() => {
    getList();
  }, [
    namesListLoading,
    namesList,
    searchedNameLoading,
    searchValue,
    searchedName,
    options,
  ]);

  return (
    <Collapse in={isDashboardVisible}>
      <Container id="Dashboard-Container">
        <DashboardContainer>
          <FlexJustified container>
            <Grid>
              <Title>My Dashboard</Title>
            </Grid>
            <Toolbar item md={6} lg={5} container>
              <Grid item xs>
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
              </Grid>
              <Grid item>
                <IconButton
                  onClick={(event) => {
                    setIsFilterOpen(!isFilterOpen);
                    setIsViewOpen(false);
                    setFilterAnchor(event.currentTarget);
                  }}
                >
                  <Settings />
                </IconButton>
                <FeatureToggle feature={FeatureList.ViewOptions}>
                  <IconButton
                    onClick={(event) => {
                      setIsViewOpen(!isViewOpen);
                      setIsFilterOpen(false);
                      setViewAnchor(event.currentTarget);
                    }}
                  >
                    <Tune />
                  </IconButton>
                </FeatureToggle>
              </Grid>
            </Toolbar>
          </FlexJustified>
          {/* Menu Popper */}
          <FilterOption
            toggleMenu={setIsFilterOpen}
            isOpen={isFilterOpen}
            anchorEl={filterAnchor}
          />
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
