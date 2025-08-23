import { useState } from "react";
import {
  Button,
  Card,
  Box,
  styled,
  Tabs,
  Tab,
  useTheme,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { H1 } from "components/Typography";
import BazaarImage from "components/BazaarImage";
import BazaarTextField from "components/BazaarTextField";
import OtpInput from "react-otp-input";
import axios from "utils/axios";

// Styled card wrapper
const Wrapper = styled(Card)(({ theme }) => ({
  width: 500,
  padding: "2rem 3rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    padding: "2rem 1.5rem",
  },
}));

const initialValues = {
  mobile: "",
  otp: "",
  userType: "",
  panNumber: "",
  gstNumber: "",
  firmname: "",
  name: ""
};

const Login = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const [showSignUpOtp, setShowSignUpOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const theme = useTheme();
  const router = useRouter();

  const handleTabChange = (_, newValue) => {
    setTabIndex(newValue);
    setShowOtp(false);
    setShowSignUpOtp(false);
    resetForm();
  };

  const startResendCountdown = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validationSchema = yup.object().shape({
    mobile: yup
      .string()
      .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number")
      .required("Mobile number is required"),

    otp: yup.string().when([], {
      is: () => (tabIndex === 0 && showOtp) || (tabIndex === 1 && showSignUpOtp),
      then: (schema) => schema.required("OTP is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    userType: tabIndex === 1
      ? yup.string().required("Please select user type")
      : yup.string().notRequired(),

    gstNumber: yup.string().when("userType", {
      is: "company",
      then: (schema) => schema.required("GST Number is required"),
    }),

    panNumber: yup.string().when("userType", {
      is: "transportor",
      then: (schema) =>
        schema
          .required("PAN Number is required")
          .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number"),
    }),

    name: yup.string().when("userType", {
      is: (val) => val === "company" || val === "transportor",
      then: (schema) => schema.required("Firm Name is required"),
    }),
    firmname: yup.string().when("userType", {
      is: (val) => val === "company" || val === "transportor",
      then: (schema) => schema.required("Firm Name is required"),
    }),
  });

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        console.log("Form Values:", values);
        if (tabIndex === 0) {
          // === Sign In Flow ===

          if (!showOtp) {

            console.log("Sending OTP to:", values.mobile);
            // Send OTP
            await axios.post("/send-otp", {
              mobile_number: values.mobile,
            });
            setShowOtp(true);
            startResendCountdown();
          } else {
            // Verify OTP
            const { data } = await axios.post("/verify-otp", {
              mobile_number: values.mobile,
              otp: values.otp,
            });

            localStorage.setItem("token", data.access_token); // Save token
            router.push("/admin/orders");
          }

        } else {
          // === Sign Up Flow ===

          if (!showSignUpOtp) {
            await axios.post("/register", {
              mobile_number: values.mobile,
              user_type: values.userType == "transportor" ? 1 : 2,
              gst_number: values.gstNumber,
              pan_number: values.panNumber,
              firm_name: 'dadas',
            });

            setShowSignUpOtp(true);
          } else {
            const { data } = await axios.post("/verify-otp", {
              mobile_number: values.mobile,
              otp: values.otp,
            });

            localStorage.setItem("token", data.access_token);
            alert("Sign up successful!");
            router.push("/admin/orders");
            resetForm();
            setShowSignUpOtp(false);
          }
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    },
  });

  return (
    <Wrapper elevation={3}>
      <BazaarImage
        src="/assets/images/bazaar-black-sm.svg"
        sx={{ m: "auto", mb: 2 }}
      />

      <H1 textAlign="center" fontSize={18} mb={2}>
        Welcome to Bazaar
      </H1>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        variant="fullWidth"
        sx={{
          mb: 3,
          borderRadius: "8px",
          backgroundColor: "#F3F5F9",
          minHeight: 40,
          "& .MuiTabs-indicator": {
            height: "100%",
            borderRadius: "8px",
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <Tab label="Sign In" sx={tabStyles} />
        <Tab label="Sign Up" sx={tabStyles} />
      </Tabs>

      <form onSubmit={handleSubmit}>
        {/* Mobile Input */}
        <BazaarTextField
          mb={2}
          fullWidth
          name="mobile"
          size="small"
          type="tel"
          variant="outlined"
          onBlur={handleBlur}
          value={values.mobile}
          onChange={handleChange}
          label="Mobile Number"
          placeholder="Enter your mobile number"
          error={!!touched.mobile && !!errors.mobile}
          helperText={touched.mobile && errors.mobile}
          disabled={(tabIndex === 0 && showOtp) || (tabIndex === 1 && showSignUpOtp)}
          sx={{
            '& .MuiInputBase-input.Mui-disabled': {
              color: 'black',
              fontWeight: 'bold',
              WebkitTextFillColor: 'black',
            },
            '& .MuiInputLabel-root.Mui-disabled': {
              color: 'black',
              fontWeight: 'bold',
            },
          }}
        />



        {/* User Type Selection */}
        {tabIndex === 1 && !showSignUpOtp && (
          <Box mb={2}>
            <Typography fontWeight={600} mb={1}>
              Select User Type
            </Typography>
            <Box display="flex" gap={2}>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="transportor"
                  onChange={handleChange}
                  checked={values.userType === "transportor"}
                />{" "}
                Transportor
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="company"
                  onChange={handleChange}
                  checked={values.userType === "company"}
                />{" "}
                Company
              </label>
            </Box>
            {touched.userType && errors.userType && (
              <Typography color="error" mt={1} fontSize={12}>
                {errors.userType}
              </Typography>
            )}
          </Box>
        )}

        {/* Company Fields */}
        {tabIndex === 1 && values.userType === "company" && !showSignUpOtp && (
          <>
            <BazaarTextField
              mb={2}
              fullWidth
              name="gstNumber"
              size="small"
              variant="outlined"
              onBlur={handleBlur}
              value={values.gstNumber}
              onChange={handleChange}
              label="GST Number"
              placeholder="Enter GST number"
              error={!!touched.gstNumber && !!errors.gstNumber}
              helperText={touched.gstNumber && errors.gstNumber}
            />

            <BazaarTextField
              mb={2}
              fullWidth
              name="firmname"
              size="small"
              variant="outlined"
              onBlur={handleBlur}
              value={values.name}
              onChange={handleChange}
              label="Firm Name"
              placeholder="Name as per GST"
              error={!!touched.firmname && !!errors.firmname}
              helperText={touched.firmname && errors.firmname}
            />
          </>
        )}

        {/* Transportor Fields */}
        {tabIndex === 1 && values.userType === "transportor" && !showSignUpOtp && (
          <>
            <BazaarTextField
              mb={2}
              fullWidth
              name="panNumber"
              size="small"
              variant="outlined"
              onBlur={handleBlur}
              value={values.panNumber}
              onChange={handleChange}
              label="PAN Number"
              placeholder="Enter your PAN number"
              error={!!touched.panNumber && !!errors.panNumber}
              helperText={touched.panNumber && errors.panNumber}
            />
            <BazaarTextField
              mb={2}
              fullWidth
              name="firmname"
              size="small"
              variant="outlined"
              onBlur={handleBlur}
              value={values.name}
              onChange={handleChange}
              label="Firm Name"
              placeholder="Name as Per PAN"
              error={!!touched.firmname && !!errors.firmname}
              helperText={touched.firmname && errors.firmname}
            />
          </>
        )}

        {/* OTP Input */}
        {((tabIndex === 0 && showOtp) || (tabIndex === 1 && showSignUpOtp)) && (
          <>
            <Typography mb={1}>Enter the OTP sent to {values.mobile}</Typography>
            <Box mb={2} display="flex" justifyContent="center">
              <OtpInput
                value={values.otp}
                onChange={(otp) => setFieldValue("otp", otp)}
                numInputs={6}
                shouldAutoFocus
                isInputNum
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "45px",
                      height: "50px",
                      margin: "0 4px",
                      fontSize: "22px",
                      borderRadius: "8px",
                      border: "2px solid #00796b",
                      textAlign: "center",
                      backgroundColor: "#ffffff",
                      outline: "none",
                    }}
                  />
                )}
              />
            </Box>
            {touched.otp && errors.otp && (
              <Typography color="error" mt={1} fontSize={12} textAlign="center">
                {errors.otp}
              </Typography>
            )}
            {/* Resend OTP Button (only for Sign In) */}
            {tabIndex === 0 && showOtp && (
              <Box textAlign="center" mt={1}>
                <Button
                  size="small"
                  onClick={() => {
                    console.log("Resend OTP:", values.mobile);
                    startResendCountdown();
                  }}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Submit */}
        <Button
          fullWidth
          type="submit"
          color="primary"
          variant="contained"
          sx={{ height: 44, mt: 2 }}
        >
          {tabIndex === 0
            ? showOtp
              ? "Verify OTP"
              : "Send OTP"
            : showSignUpOtp
              ? "Verify OTP"
              : "Register"}
        </Button>
      </form>
    </Wrapper>
  );
};

const tabStyles = {
  fontWeight: 600,
  fontSize: 14,
  minHeight: 40,
  zIndex: 1,
  color: "#2B3445",
  "&.Mui-selected": {
    color: "#fff",
  },
};

export default Login;
