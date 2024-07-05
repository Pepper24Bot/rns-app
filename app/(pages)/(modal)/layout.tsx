import Dashboard from "@/components/Dashboard/Dashboard";
import MainPage from "@/components/Main/MainPage";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainPage>
      <Dashboard tab={0} hasMounted={true}>
        {children}
      </Dashboard>
    </MainPage>
  );
}
