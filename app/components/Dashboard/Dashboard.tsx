import React, { useEffect, useState } from "react";
import { Collapse, Grid } from "@mui/material";
import { useAccount } from "wagmi";
import { debounce as _debounce } from "lodash";
import { FlexJustified } from "../Theme/StyledGlobal";
import { Notifications } from "@mui/icons-material";
import { DASHBOARD_TAB_ITEMS } from "@/constants/components";
import { useDashboardState } from "@/redux/dashboard/dashboardSlice";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import {
  Container,
  Content,
  DashboardContainer,
  TabItem,
  Title,
  Tabs,
} from "./StyledDashboard";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import useFeatureToggle, { FeatureList } from "@/hooks/useFeatureToggle";
import FeatureToggle from "../Reusables/FeatureToggle";
import FrequentlyAsked from "./Tab/Faq/Faq";
import Favorites from "./Tab/Favorites";
import LoyaltyPoints from "./Tab/Loyalty";
import Names from "./Tab/Names";
import Toolbar from "./Toolbar";

export interface DashboardProps {
  children?: React.ReactNode;
  hasMounted?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { hasMounted } = props;

  const { status } = useAccount();
  const { isFeatureEnabled } = useFeatureToggle();
  const { useFilters } = useDashboardState();

  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { address },
  } = useRootNetwork();

  const router = useRouter();
  const pathName = usePathname();
  const options = useFilters();

  const getSelectedTab = () => {
    switch (pathName) {
      case "/identities":
        return 0;
      case "/faq":
        return 1;
      default:
        return 0;
    }
  };

  const [activeTab, setActiveTab] = useState<number>(getSelectedTab()); // tab-index
  const [isDashboardVisible, setIsDashboardVisible] = useState<boolean>(true); // show by default

  // const { data: searchedName, isLoading: searchedNameLoading } =
  //   useGetNamesByUserAndLabelQuery(
  //     {
  //       labelName: searchValue.toLowerCase(),
  //       id: address?.toLowerCase() as Address,
  //     },
  //     {
  //       skip: isEmpty(searchValue) || isEmpty(address) || !hasMounted,
  //       refetchOnMountOrArgChange: true,
  //       refetchOnFocus: true,
  //     }
  //   );

  // const { data: namesList, isLoading: namesListLoading } = useGetNamesByIdQuery(
  //   { id: address?.toLowerCase() || "" },
  //   { skip: address === null || activeTab !== 0 || !hasMounted }
  // );

  // const { names, isLoading: isNamesLoading } = useNamesForAddress({
  //   address: root.address || "0x",
  // });

  // const areNamesLoading = isNamesLoading || searchedNameLoading || !hasMounted;

  // const handleDebounceOnChange = (value: string) => {
  //   setSearchValue(value);
  // };

  // const debounceFn = useCallback(
  //   _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
  //   []
  // );

  // TODO: Make this sorting function reusable and move to util
  // const getSortedNames = (list: Name[]) => {
  //   const sortBy = options?.sort?.by;
  //   const orderBy = options?.sort?.order;

  //   switch (sortBy) {
  //     case "Name":
  //       return list?.sort((a, b) => {
  //         return orderBy === "Ascending"
  //           ? a.name.localeCompare(b.name)
  //           : b.name.localeCompare(a.name);
  //       });

  //     case "Created Date":
  //       return list?.sort((a, b) => {
  //         return orderBy === "Ascending"
  //           ? b.domain?.createdAt - a.domain?.createdAt
  //           : a.domain?.createdAt - b.domain?.createdAt;
  //       });

  //     case "Cost":
  //       return list?.sort((a, b) => {
  //         const costA = Number(
  //           formatEther(BigInt(a.domain?.registration?.cost))
  //         );
  //         const costB = Number(
  //           formatEther(BigInt(b.domain?.registration?.cost))
  //         );

  //         return orderBy === "High" ? costB - costA : costA - costB;
  //       });

  //     case "Expiry":
  //       return list?.sort((a, b) => {
  //         const expiryA = getExpiration(
  //           a?.domain?.createdAt,
  //           a?.domain?.expiryDate
  //         ).distanceToExpiration.split(" days")[0];

  //         const expiryB = getExpiration(
  //           b?.domain?.createdAt,
  //           b?.domain?.expiryDate
  //         ).distanceToExpiration.split(" days")[0];

  //         return orderBy === "High"
  //           ? Number(expiryB) - Number(expiryA)
  //           : Number(expiryA) - Number(expiryB);
  //       });

  //     case "Length":
  //       return list?.sort((a, b) => {
  //         return orderBy === "High"
  //           ? b.name.length - a.name.length
  //           : a.name.length - b.name.length;
  //       });

  //     default:
  //       return list?.sort((a, b) => a.name.localeCompare(b.name));
  //   }
  // };

  // const getFilteredNames = () => {
  //   let list: Name[] = [];

  //   // #1. Filter based on the name being searched
  //   if (searchValue !== "") {
  //     list = (searchedName?.wrappedDomains as Name[]) || [];
  //   } else {
  //     // For now, the only filter option we have is the views
  //     list = names?.wrappedDomains
  //       // #2. Then apply the filter options
  //       ?.filter((item) => {
  //         const views = options?.filter?.views;
  //         const length = views?.length;

  //         if (length === 2 || length === 0) {
  //           return item;
  //         } else {
  //           const filteredView = !isEmpty(views) && views![0];
  //           const remainingDays = getExpiration(
  //             item?.domain?.createdAt,
  //             item?.domain?.expiryDate
  //           ).distanceToExpiration.split(" days")[0];

  //           return filteredView === "Active" && Number(remainingDays) > 0
  //             ? item
  //             : filteredView === "Expired" && Number(remainingDays) <= 0
  //             ? item
  //             : false;
  //         }
  //       })
  //       // #3. If there are no filters, return the whole list
  //       ?.filter((item) => {
  //         return item.name !== null;
  //       }) as Name[];
  //   }

  //   // #4. Sort the list based on the options
  //   // const sortedList = !isEmpty(list) ? getSortedNames([...list]) : [];
  //   // updateNameList(sortedList);
  // };

  // const getList = () => {
  //   switch (activeTab) {
  //     // Names Tab
  //     case 0:
  //       getFilteredNames();
  //     // Favorites Tab
  //     case 1:
  //     default:
  //       return getFilteredNames();
  //   }
  // };

  const setPathNameFromTab = (tab: number) => {
    switch (tab) {
      case 0:
        return router.replace("/identities", { scroll: false });
      case 1:
        return router.replace("/faq", { scroll: false });
      default:
        return router.replace("/", { scroll: false });
    }
  };

  useEffect(() => {
    if (hasMounted && status === "connected" && address) {
      setIsDashboardVisible(true);
    } else if (hasMounted && status === "disconnected" && !address) {
      setIsDashboardVisible(false);
    }
  }, [address, status, hasMounted]);

  // useEffect(() => {
  //   if (hasMounted) {
  //     // getList();
  //     // updateNameList(sortedList);
  //   }
  // }, [
  //   isNamesLoading,
  //   names,
  //   searchedNameLoading,
  //   searchValue,
  //   searchedName,
  //   options,
  //   hasMounted,
  // ]);

  return (
    <Collapse in={isDashboardVisible}>
      <Container id="Dashboard-Container">
        <DashboardContainer>
          <FlexJustified container>
            <Grid>
              <Title id="my-dashboard">My Dashboard</Title>
            </Grid>
            <Grid item md={6} lg={5}>
              <Toolbar />
            </Grid>
          </FlexJustified>
          <Content>
            <Grid>
              <Tabs
                value={activeTab}
                onChange={(_, value) => {
                  setActiveTab(value);
                  setPathNameFromTab(value);
                }}
              >
                {DASHBOARD_TAB_ITEMS.map((item, index) => {
                  return (
                    isFeatureEnabled(item) && (
                      <TabItem key={item} label={item.toUpperCase()} />
                    )
                  );
                })}
              </Tabs>
            </Grid>
            <Grid id="Tab-Content">
              <FeatureToggle feature={FeatureList.Identities}>
                {activeTab === 0 && <Names hasMounted={hasMounted} />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.FAQ}>
                {activeTab === 1 && <FrequentlyAsked />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.Identities}>
                {activeTab === 2 && <Favorites />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.Identities}>
                {activeTab === 3 && <LoyaltyPoints />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.Identities}>
                {activeTab === 4 && <Notifications />}
              </FeatureToggle>
            </Grid>
          </Content>
        </DashboardContainer>
      </Container>
    </Collapse>
  );
};

export default Dashboard;
