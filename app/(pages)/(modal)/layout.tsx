import IdentitiesPage from "@/components/Main/IdentitiesPage";
import MainPage from "@/components/Main/MainPage";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainPage>
      <IdentitiesPage />
      {children}
    </MainPage>
  );
}
