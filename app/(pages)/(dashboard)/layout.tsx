import { Suspense } from "react";
import { Grid } from "@mui/material";
import { Dashboard } from "@mui/icons-material";
import SearchForm from "@/components/Search/SearchForm";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<></>}>
      <Grid pt="80px">
        <SearchForm />
        <Dashboard />
      </Grid>
    </Suspense>
  );
}
