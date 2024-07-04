import React from "react";
import MainPage from "@/components/Main/MainPage";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Layout({ children }: { children: React.ReactNode }) {
  // return <MainPage>{children}</MainPage>;

  return (
    <MainPage>
      <Dashboard>{children}</Dashboard>
    </MainPage>
  );
}
