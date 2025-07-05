import Link from "next/link";
import { useRouter } from "next/router";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { CameraEnhance, Person } from "@mui/icons-material";
import { CustomerDashboardLayout } from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import Card1 from "components/Card1";
import { FlexBox } from "components/flex-box";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import api from "utils/__api__/users";
import { useState } from "react";

const ProfileEditor = ({ user }) => {
  const router = useRouter();
  const [signaturePreview, setSignaturePreview] = useState(null);

  const INITIAL_VALUES = {
    name: user?.name || "",
    pan_number: user?.pan_number || "",
    gst_number: user?.gst_number || "",
    contact_person: user?.contact_person || "",
    contact_mobile: user?.contact_mobile || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pin_code: user?.pin_code || "",
    msme_number: user?.msme_number || "",
    bank_name: user?.bank_name || "",
    ifsc_code: user?.ifsc_code || "",
    account_number: user?.account_number || "",
    branch: user?.branch || "",
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    pan_number: yup
      .string()
      .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),
  });

  const handleFormSubmit = async (values) => {
    // API call here
    console.log("Submitted values:", values);
    alert("Profile updated successfully!");
    router.push("/profile");
  };

  const HEADER_LINK = (
    <Link href="/profile" passHref>
      <Button color="primary" sx={{ px: 4, bgcolor: "primary.light" }}>
        Back to Profile
      </Button>
    </Link>
  );

  if (router.isFallback) return <h1>Loading...</h1>;

  return (
    <CustomerDashboardLayout>
      <UserDashboardHeader
        icon={Person}
        title="Edit Profile"
        button={HEADER_LINK}
        navigation={<CustomerDashboardNavigation />}
      />

      <Box display="flex" justifyContent="center" mt={4}>
        <Card1 sx={{ maxWidth: 900, width: "100%" }}>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Avatar Upload */}
                  <Grid item xs={12}>
                    <FlexBox alignItems="flex-end" mb={3}>
                      <Avatar
                        src="/assets/images/faces/ralph.png"
                        sx={{ height: 64, width: 64 }}
                      />
                      <Box ml={-2.5}>
                        <label htmlFor="profile-image">
                          <Button
                            component="span"
                            color="secondary"
                            sx={{
                              p: "8px",
                              bgcolor: "grey.300",
                              borderRadius: "50%",
                            }}
                          >
                            <CameraEnhance fontSize="small" />
                          </Button>
                        </label>
                      </Box>
                      <Box display="none">
                        <input
                          id="profile-image"
                          accept="image/*"
                          type="file"
                          onChange={(e) => console.log(e.target.files)}
                        />
                      </Box>
                    </FlexBox>
                  </Grid>

                  {/* All Form Fields */}
                  {[
                    { name: "name", label: "Name" },
                    { name: "pan_number", label: "PAN Number" },
                    { name: "gst_number", label: "GST Number" },
                    { name: "contact_person", label: "Contact Person" },
                    { name: "contact_mobile", label: "Contact Mobile" },
                    { name: "address", label: "Address" },
                    { name: "city", label: "City" },
                    { name: "state", label: "State" },
                    { name: "pin_code", label: "Pin Code" },
                    { name: "msme_number", label: "MSME Number" },
                    { name: "bank_name", label: "Bank Name" },
                    { name: "ifsc_code", label: "IFSC Code" },
                    { name: "account_number", label: "Account Number" },
                    { name: "branch", label: "Branch" },
                  ].map((field) => (
                    <Grid item md={6} xs={12} key={field.name}>
                      <TextField
                        fullWidth
                        name={field.name}
                        label={field.label}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values[field.name]}
                        error={!!touched[field.name] && !!errors[field.name]}
                        helperText={touched[field.name] && errors[field.name]}
                      />
                    </Grid>
                  ))}

                  {/* Signature Upload */}
                  <Grid item xs={12}>
                    <Typography fontWeight={500} mb={1}>
                      Upload Signature with Stamp
                    </Typography>
                    <input
                      accept="image/*"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setSignaturePreview(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {signaturePreview && (
                      <Box mt={2}>
                        <img
                          src={signaturePreview}
                          alt="Signature with Stamp"
                          style={{
                            width: "200px",
                            border: "1px solid #ddd",
                            padding: 4,
                          }}
                        />
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Card1>
      </Box>
    </CustomerDashboardLayout>
  );
};

// Replace static functions with server-side rendering
export const getServerSideProps = async () => {
  const user = await api.getUser();
  return { props: { user } };
};

export default ProfileEditor;
