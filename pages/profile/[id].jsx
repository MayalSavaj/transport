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
} from "@mui/material";
import { CameraEnhance, Person } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Card1 from "components/Card1";
import { FlexBox } from "components/flex-box";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import api from "utils/__api__/users";

const ProfileEditor = ({ user }) => {
  const router = useRouter();

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
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    contact: yup.string().required("Phone is required"),
    birth_date: yup.date().required("Birth date is required"),
    pan_number: yup
      .string()
      .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),
  });

 const handleFormSubmit = async (values) => {
  console.log("Submitted values:", values);

  // Optional: Perform API call or local storage update here
  alert("Form submitted successfully!");

  // Navigate to profile page
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

      <Card1>
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
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
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
                          sx={{ p: "8px", bgcolor: "grey.300", borderRadius: "50%" }}
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

                <Grid item md={6} xs={12}><TextField fullWidth name="name" label="Name" onBlur={handleBlur} onChange={handleChange} value={values.name} error={!!touched.name && !!errors.name} helperText={touched.name && errors.name} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="pan_number" label="PAN Number" onBlur={handleBlur} onChange={handleChange} value={values.pan_number} error={!!touched.pan_number && !!errors.pan_number} helperText={touched.pan_number && errors.pan_number} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="gst_number" label="GST Number" onBlur={handleBlur} onChange={handleChange} value={values.gst_number} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="contact_person" label="Contact Person" onBlur={handleBlur} onChange={handleChange} value={values.contact_person} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="contact_mobile" label="Contact Mobile" onBlur={handleBlur} onChange={handleChange} value={values.contact_mobile} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="address" label="Address" onBlur={handleBlur} onChange={handleChange} value={values.address} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="city" label="City" onBlur={handleBlur} onChange={handleChange} value={values.city} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="state" label="State" onBlur={handleBlur} onChange={handleChange} value={values.state} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="pin_code" label="Pin Code" onBlur={handleBlur} onChange={handleChange} value={values.pin_code} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="msme_number" label="MSME Number" onBlur={handleBlur} onChange={handleChange} value={values.msme_number} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="bank_name" label="Bank Name" onBlur={handleBlur} onChange={handleChange} value={values.bank_name} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="ifsc_code" label="IFSC Code" onBlur={handleBlur} onChange={handleChange} value={values.ifsc_code} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="account_number" label="Account Number" onBlur={handleBlur} onChange={handleChange} value={values.account_number} /></Grid>
                <Grid item md={6} xs={12}><TextField fullWidth name="branch" label="Branch" onBlur={handleBlur} onChange={handleChange} value={values.branch} /></Grid>

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
    </CustomerDashboardLayout>
  );
};

export const getStaticPaths = async () => {
  const paths = await api.getUserIds();
  return { paths, fallback: "blocking" };
};

export const getStaticProps = async () => {
  const user = await api.getUser();
  return { props: { user } };
};

export default ProfileEditor;
