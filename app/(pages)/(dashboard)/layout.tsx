import { Suspense } from "react";
import { Grid } from "@mui/material";
import SearchForm from "@/components/Search/SearchForm";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<></>}>
      <Grid pt="80px">
        <SearchForm />
        {children}
      </Grid>
    </Suspense>
  );
}
