import { useState, useEffect } from "react";
import Router from "next/router";
import {
  Box,
  Card,
  Grid,
  Divider,
  Avatar,
  Typography,
  Button,
  TextField,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import { Person } from "@mui/icons-material";
import axios from "utils/axios"; // import the custom axios

// --- Formik & Yup Imports ---
import { useFormik } from "formik";
import * as Yup from "yup";

import DropZone from "components/DropZone";
import { FlexBox } from "components/flex-box";
import BazaarImage from "components/BazaarImage";
import { H4, H5 } from "components/Typography";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";

// Styled components (no changes here)
const UploadImageBox = styled("div")(() => ({
  position: "relative",
  width: 120,
  height: 120,
  border: "1px solid #ccc",
  borderRadius: 8,
  overflow: "hidden",
}));

const StyledClear = styled(IconButton)(() => ({
  position: "absolute",
  top: 4,
  right: 4,
  background: "#fff",
  zIndex: 2,
  "&:hover": {
    background: "#f1f1f1",
  },
}));

// --- Yup Validation Schema ---
const validationSchema = Yup.object().shape({
  pan_number: Yup.string().required("PAN Number is required"),
  email: Yup.string().required("Email Account is required"),

  gst_number: Yup.string().required("GST Number is required"),
  contact_person: Yup.string().required("Contact Person is required"),
  mobile_number: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Contact Mobile is required"),
  adress: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pin_code: Yup.string().required("Pin Code is required"),
  msme_number: Yup.string(),
  bank_name: Yup.string().required("Bank Name is required"),
  ifsc_code: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .required("IFSC Code is required"),
  ac_number: Yup.string().required("Account Number is required"),
  branch: Yup.string().required("Branch is required"),
});

export default function Profile() {
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({});
  const [signatureFile, setSignatureFile] = useState([]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
      axios
        .get(`/myprofile`)
        .then((res) => {
          const fetchedUser = res.data.user || {};

          // ++ START: Sanitize the fetched data ++
          // Create a new object to hold the cleaned data
          const sanitizedUser = {};
          // Loop over the keys of the fetched user object
          for (const key in fetchedUser) {
            // If the value is null, replace it with an empty string, otherwise keep it
            sanitizedUser[key] =
              fetchedUser[key] === null ? "" : fetchedUser[key];
          }
          // ++ END: Sanitize the fetched data ++

          setUser(sanitizedUser);
          formik.setValues(sanitizedUser); // Use the clean data for Formik
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          setLoading(false);
        });
    };

    fetchUser();
  }, []); // The empty dependency array is correct here

  const handleFileDelete = (fileToRemove) => () => {
    setSignatureFile((prev) =>
      prev.filter((file) => file.preview !== fileToRemove.preview)
    );
  };

  const handleSave = (values) => {
    axios
      .put(`/update-profile`, values)
      .then((res) => {
        setUser(values);
        setEditMode(false);
        Router.push("/admin/profile");
      })
      .catch((err) => {
        console.error("Failed to update profile:", err);
      });
  };

  // --- Initialize Formik ---
  const formik = useFormik({
    initialValues: user,
    validationSchema: validationSchema,
    onSubmit: handleSave,
    enableReinitialize: true, // This allows the form to update when `user` state changes
  });

  const HEADER_LINK = (
    <Box display="flex" gap={2}>
      {editMode ? (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={formik.handleSubmit} // Use formik's submit handler
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setEditMode(false);
              formik.resetForm({ values: user }); // Reset form to original user data
              if (user.signature_url) {
                setSignatureFile([
                  {
                    name: "signature.jpg",
                    preview: user.signature_url,
                    uploaded: true,
                  },
                ]);
              } else {
                setSignatureFile([]);
              }
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button
          color="primary"
          sx={{ px: 3, bgcolor: "primary.light" }}
          onClick={() => setEditMode(true)}
        >
          Edit Profile
        </Button>
      )}
    </Box>
  );

  return (
    <CustomerDashboardLayout>
      <>
        <UserDashboardHeader
          icon={Person}
          title="My Profile"
          button={HEADER_LINK}
          navigation={<CustomerDashboardNavigation />}
        />
        <Box mb={4}>
          <Card sx={{ p: 4 }}>
            <form onSubmit={formik.handleSubmit}>
              <FlexBox alignItems="center" mb={4}>
                <Avatar src={user?.avatar} sx={{ height: 80, width: 80 }} />
                <Box ml={2}>
                  <H5>{user?.name}</H5>
                </Box>
              </FlexBox>

              <Section title="Business Details">
                <Grid container spacing={2}>
                  <ProfileItem
                    name="pan_number"
                    title="PAN Number"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="gst_number"
                    title="GST Number"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="contact_person"
                    title="Contact Person"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="email"
                    title="Email"
                    formik={formik}
                    editMode={editMode}
                  />

                  <ProfileItem
                    name="mobile_number"
                    title="Contact Mobile"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="adress"
                    title="Address"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="city"
                    title="City"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="state"
                    title="State"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="pin_code"
                    title="Pin Code"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="msme_number"
                    title="MSME Number"
                    formik={formik}
                    editMode={editMode}
                  />
                </Grid>
              </Section>

              <Section title="Bank Details">
                <Grid container spacing={2}>
                  <ProfileItem
                    name="bank_name"
                    title="Bank Name"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="ifsc_code"
                    title="IFSC Code"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="ac_number"
                    title="Account Number"
                    formik={formik}
                    editMode={editMode}
                  />
                  <ProfileItem
                    name="branch"
                    title="Branch"
                    formik={formik}
                    editMode={editMode}
                  />
                </Grid>
              </Section>
            </form>

            {/* Signature section remains outside the formik form tag as it's handled separately */}
            <Section title="Signature with Stamp">
              <Grid item xs={12}>
                {!signatureFile.length ? (
                  editMode && (
                    <DropZone
                      title="Upload Signature with Stamp"
                      maxFiles={1}
                      accept={{ "image/*": [] }}
                      onChange={(selectedFiles) => {
                        const file = selectedFiles[0];
                        if (file) {
                          const updatedFile = Object.assign(file, {
                            preview: URL.createObjectURL(file),
                          });
                          setSignatureFile([updatedFile]);
                          setImgLoaded(false);
                        }
                      }}
                    />
                  )
                ) : (
                  <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                    {signatureFile.map((file, index) => (
                      <UploadImageBox key={index}>
                        {!imgLoaded && (
                          <CircularProgress
                            size={24}
                            sx={{
                              position: "absolute",
                              top: "40%",
                              left: "40%",
                            }}
                          />
                        )}
                        <BazaarImage
                          src={file.preview}
                          width="100%"
                          height="100%"
                          alt="Signature"
                          style={{ objectFit: "contain" }}
                          onLoad={() => setImgLoaded(true)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-signature.png";
                          }}
                        />
                        {editMode && (
                          <StyledClear onClick={handleFileDelete(file)}>
                            <ClearIcon fontSize="small" />
                          </StyledClear>
                        )}
                      </UploadImageBox>
                    ))}
                  </FlexBox>
                )}
              </Grid>
            </Section>
          </Card>
        </Box>
      </>
    </CustomerDashboardLayout>
  );
}

// --- Updated ProfileItem to handle Formik props ---
const ProfileItem = ({ title, name, formik, editMode }) => (
  <Grid item xs={12} md={6}>
    <Typography color="grey.600" fontSize={13}>
      {title}
    </Typography>
    {editMode ? (
      <TextField
        fullWidth
        size="small"
        name={name}
        value={formik.values[name] || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
      />
    ) : (
      <Typography fontWeight={500}>{formik.values[name] || "-"}</Typography>
    )}
  </Grid>
);

// Section wrapper (no changes here)
const Section = ({ title, children }) => (
  <Box mb={4}>
    <H4 mb={2}>{title}</H4>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Box>
);

// Dashboard layout wrapper (no changes here)
Profile.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
