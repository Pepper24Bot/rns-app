import Dashboard from "@/components/Dashboard/Dashboard";
import IdentitiesPage from "@/components/Main/IdentitiesPage";
import MainPage from "@/components/Main/MainPage";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainPage>
      <Dashboard>
        <IdentitiesPage />
        {children}
      </Dashboard>
    </MainPage>
  );
}
