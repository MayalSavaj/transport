import React from "react";
import { Box, Backdrop, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`;

const textShimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1,
  backdropFilter: "blur(8px)",
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)",
  animation: `${fadeIn} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
  animation: `${fadeIn} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  minWidth: "280px",
  position: "relative",
  overflow: "hidden",
}));

const SpinnerContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 80,
  height: 80,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const PrimarySpinner = styled("div")(({ theme }) => ({
  width: "60px",
  height: "60px",
  border: `3px solid ${theme.palette.grey[200]}`,
  borderTop: `3px solid ${theme.palette.primary.main}`,
  borderRadius: "50%",
  animation: `${spin} 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite`,
  position: "relative",
  zIndex: 2,
}));

const RippleEffect = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30px",
  height: "30px",
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: "50%",
  animation: `${ripple} 2s linear infinite`,
  opacity: 0.6,
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-2px",
    left: "-2px",
    right: "-2px",
    bottom: "-2px",
    border: `2px solid ${theme.palette.secondary.main}`,
    borderRadius: "50%",
    animation: `${ripple} 2s linear infinite 0.5s`,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-2px",
    left: "-2px",
    right: "-2px",
    bottom: "-2px",
    border: `2px solid ${theme.palette.primary.light}`,
    borderRadius: "50%",
    animation: `${ripple} 2s linear infinite 1s`,
  },
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: "1.1rem",
  textAlign: "center",
  letterSpacing: "0.5px",
  background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${theme.palette.primary.main}, ${theme.palette.text.primary})`,
  backgroundSize: "200% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: `${textShimmer} 2s ease-in-out infinite`,
  marginTop: theme.spacing(1),
}));

const SubText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.85rem",
  textAlign: "center",
  opacity: 0.8,
  fontWeight: 400,
}));

const DotsContainer = styled(Box)({
  display: "flex",
  gap: "4px",
  marginTop: "8px",
  justifyContent: "center",
  alignItems: "center",
});

const Dot = styled("div")(({ theme, delay }) => ({
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: theme.palette.primary.main,
  animation: `${pulse} 1.5s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}));

const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
`;

const LoadingOverlay = ({ open = false, message = "Loading..." }) => {
  return (
    <StyledBackdrop open={open}>
      <LoadingContainer>
        <SpinnerContainer>
          <RippleEffect />
          <PrimarySpinner />
        </SpinnerContainer>
        
        <Box textAlign="center">
          <LoadingText variant="h6">{message}</LoadingText>
          <SubText>Please wait a moment</SubText>
          <DotsContainer>
            <Dot delay={0} />
            <Dot delay={0.2} />
            <Dot delay={0.4} />
          </DotsContainer>
        </Box>
      </LoadingContainer>
    </StyledBackdrop>
  );
};

export default LoadingOverlay;