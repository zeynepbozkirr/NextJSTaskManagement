"use client";
import styles from "./page.module.css";
import Board from "@/components/board";
import Header from "@/components/header";
import { Box, useMediaQuery, useTheme } from "@mui/material";

export default function Home() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Küçük ekranları tespit et
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md")); // Orta ekranları tespit et

  const marginTopValue = isSmallScreen
    ? "135px"
    : isMediumScreen
      ? "90px"
      : "50px";

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <Box
          sx={{
            marginTop: marginTopValue,
          }}
        >
          <Board />
        </Box>
      </main>
    </div>
  );
}
