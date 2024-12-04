import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import SideBar from './sidebar';

function Help() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <SideBar />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          mt: 8,
        }}
      >
        {/* Primer iframe */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "90%", sm: "70%", md: "60%" },
            height: 0,
            paddingBottom: "50%", // Relación de aspecto
            overflow: "hidden",
            mb: 4, // Espaciado entre los iframes
          }}
        >
          <Typography
            variant={isSmallScreen ? "subtitle1" : "h6"}
            gutterBottom
            sx={{
              textAlign: "center",
            }}
          >
            Guía registro de equipos
          </Typography>
          <iframe
            id="9r228xxfzr"
            src="https://app.guideflow.com/embed/9r228xxfzr"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            scrolling="no"
            allow="clipboard-read; clipboard-write"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
            title="Guía registro de equipos" 
          ></iframe>
        </Box>

        {/* Segundo iframe */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "90%", sm: "70%", md: "60%" },
            height: 0,
            paddingBottom: "50%", // Relación de aspecto
            overflow: "hidden",
          }}
        >
          <Typography
            variant={isSmallScreen ? "subtitle1" : "h6"}
            gutterBottom
            sx={{
              textAlign: "center",
            }}
          >
            Guía registro de préstamo
          </Typography>
          <iframe
            id="np161g2fzr"
            src="https://app.guideflow.com/embed/np161g2fzr"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            scrolling="no"
            allow="clipboard-read; clipboard-write"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
            title="Guía registro de préstamo"
          ></iframe>
        </Box>
        <Box
          sx={{
            position: "relative",
            width: { xs: "90%", sm: "70%", md: "60%" },
            height: 0,
            paddingBottom: "50%", // Relación de aspecto
            overflow: "hidden",
          }}
        >
          <Typography
            variant={isSmallScreen ? "subtitle1" : "h6"}
            gutterBottom
            sx={{
              textAlign: "center",
            }}
          >
            Guía actualizacion de prestamo
          </Typography>
          <iframe
            id="np161g2fzr"
            src="https://app.guideflow.com/embed/qkqg3qoi4p"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            scrolling="no"
            allow="clipboard-read; clipboard-write"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
            title="Guía actualizacion de prestamo"
          ></iframe>
        </Box>
      </Box>
    </Box>
  );
}

export default Help;
