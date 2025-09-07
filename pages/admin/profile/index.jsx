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
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import { Person } from "@mui/icons-material";
import axios from "utils/axios"; // custom axios

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

// Styled components
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

  // NEW required validations
  profile_photo: Yup.mixed().required("Profile photo is required"),
  signature_stamp: Yup.mixed().required("Signature with stamp is required"),
});


export default function Profile() {
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({});
  const [signatureFile, setSignatureFile] = useState([]);
  const [profilePhotoFile, setProfilePhotoFile] = useState([]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Fetch city & state data from API
  useEffect(() => {
    axios.get("/cities").then((response) => {
      const cityList = response?.data?.city || [];
      setCities(cityList);

      // Extract unique states from city list
      const uniqueStates = [...new Set(cityList.map((item) => item.city_state))];
      setStates(uniqueStates);
    }).catch((err) => {
      console.error("Failed to fetch cities:", err);
    });
  }, []);

  useEffect(() => {
    const fetchUser = () => {
      axios
        .get(`/myprofile`)
        .then((res) => {
          const fetchedUser = res.data.user || {};
          const sanitizedUser = {};
          for (const key in fetchedUser) {
            sanitizedUser[key] =
              fetchedUser[key] === null ? "" : fetchedUser[key];
          }
          setUser(sanitizedUser);
          formik.setValues(sanitizedUser);

          console.log(user?.profile_photo);
          console.log(sanitizedUser);
          // preload profile photo + signature if available
          if (sanitizedUser.profile_photo) {

            setProfilePhotoFile([
              {
                name: "profile_photo.jpg",
                preview: "http://127.0.0.1:8000/storage/" + sanitizedUser?.profile_photo,
                uploaded: true,
              },
            ]);
          }
          if (sanitizedUser.signature_stamp) {

            setSignatureFile([
              {
                name: "signature_stamp.jpg",
                preview: "http://127.0.0.1:8000/storage/" + sanitizedUser?.signature_stamp,
                uploaded: true,
              },
            ]);
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          setLoading(false);
        });
    };

    fetchUser();
  }, []);

  // Filter cities when state changes or user data loads
  useEffect(() => {
    if (user.state && cities.length > 0) {
      const filtered = cities.filter((c) => c.city_state === user.state);
      setFilteredCities(filtered);
    }
  }, [user.state, cities]);

  // Handle State Change
  const handleStateChange = (selectedState) => {
    formik.setFieldValue("state", selectedState);
    formik.setFieldValue("city", ""); // Reset city when state changes

    // Filter cities based on selected state
    const filtered = cities.filter((c) => c.city_state === selectedState);
    setFilteredCities(filtered);
  };

  const handleFileDelete = (fileToRemove, type) => () => {
    if (type === "profile") {
      setProfilePhotoFile([]);
      formik.setFieldValue("profile_photo", null); // ✅ clear from formik
    } else {
      setSignatureFile([]);
      formik.setFieldValue("signature_stamp", null); // ✅ clear from formik
    }
  };


  const handleSave = async (values) => {
    try {
      const formData = new FormData();

      // Append all form fields
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key] ?? "");
      });

      // Append profile photo
      if (profilePhotoFile.length > 0 && !profilePhotoFile[0].uploaded) {
        formData.append("profile_photo", profilePhotoFile[0]);
      }

      // Append signature stamp
      if (signatureFile.length > 0 && !signatureFile[0].uploaded) {
        formData.append("signature_stamp", signatureFile[0]);
      }

      const res = await axios.post(`/update-profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Profile updated:", res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const formik = useFormik({
    initialValues: user,
    validationSchema: validationSchema,
    onSubmit: handleSave,
    enableReinitialize: true,
  });

  const HEADER_LINK = (
    <Box display="flex" gap={2}>
      {editMode ? (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={formik.handleSubmit}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setEditMode(false);
              formik.resetForm({ values: user });
              if (user.profile_photo) {
                setProfilePhotoFile([
                  {
                    name: "profile_photo.jpg",
                    preview: "http://127.0.0.1:8000/storage/profile/7_68a590150de47.jpg",
                    uploaded: true,
                  },
                ]);
              } else {
                setProfilePhotoFile([]);
              }
              if (user.signature_stamp) {
                setSignatureFile([
                  {
                    name: "signature_stamp.jpg",
                    preview: "http://127.0.0.1:8000/storage/profile/7_68a590150de47.jpg",
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
              {/* Profile Photo Section */}
              <Section title="Profile Photo">
                <Grid item xs={12}>
                  {!profilePhotoFile.length ? (
                    editMode && (
                      <DropZone
                        title="Upload Profile Photo"
                        maxFiles={1}
                        accept={{ "image/*": [] }}
                        onChange={(selectedFiles) => {
                          const file = selectedFiles[0];
                          if (file) {
                            const updatedFile = Object.assign(file, {
                              preview: URL.createObjectURL(file),
                            });
                            setProfilePhotoFile([updatedFile]);
                            setImgLoaded(false);
                            formik.setFieldValue("profile_photo", updatedFile); // ✅ update formik

                          }
                        }}


                      />
                    )
                  ) : (
                    <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                      {profilePhotoFile.map((file, index) => (
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
                            alt="Profile"
                            style={{ objectFit: "cover" }}
                            onLoad={() => setImgLoaded(true)}
                          />
                          {editMode && (
                            <StyledClear
                              onClick={handleFileDelete(file, "profile")}
                            >
                              <ClearIcon fontSize="small" />
                            </StyledClear>
                          )}
                        </UploadImageBox>
                      ))}



                    </FlexBox>

                  )}
                </Grid>
                {formik.touched.profile_photo && formik.errors.profile_photo && (
                  <Typography color="error" fontSize={12}>
                    {formik.errors.profile_photo}
                  </Typography>
                )}
              </Section>

              {/* Business Details */}
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
                  <ProfileDropdownItem
                    name="state"
                    title="State"
                    formik={formik}
                    editMode={editMode}
                    options={states}
                    onChange={handleStateChange}
                  />
                  <ProfileDropdownItem
                    name="city"
                    title="City"
                    formik={formik}
                    editMode={editMode}
                    options={filteredCities.map(city => city.city_name)}
                    disabled={!formik.values.state}
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

              {/* Bank Details */}
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

            {/* Signature Section */}
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
                          formik.setFieldValue("signature_stamp", updatedFile); // ✅ update formik

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
                          <StyledClear
                            onClick={handleFileDelete(file, "signature")}
                          >
                            <ClearIcon fontSize="small" />
                          </StyledClear>
                        )}
                      </UploadImageBox>
                    ))}
                  </FlexBox>
                )}
              </Grid>
              {formik.touched.signature_stamp && formik.errors.signature_stamp && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.signature_stamp}
                </Typography>
              )}
            </Section>
          </Card>
        </Box>
      </>
    </CustomerDashboardLayout>
  );
}

// --- ProfileItem helper ---
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

// --- ProfileDropdownItem helper ---
const ProfileDropdownItem = ({ title, name, formik, editMode, options, onChange, disabled = false }) => (
  <Grid item xs={12} md={6}>
    <Typography color="grey.600" fontSize={13}>
      {title}
    </Typography>
    {editMode ? (
      <TextField
        select
        fullWidth
        size="small"
        name={name}
        value={formik.values[name] || ""}
        onChange={onChange ? (e) => onChange(e.target.value) : formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={disabled}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    ) : (
      <Typography fontWeight={500}>{formik.values[name] || "-"}</Typography>
    )}
  </Grid>
);

// --- Section Wrapper ---
const Section = ({ title, children }) => (
  <Box mb={4}>
    <H4 mb={2}>{title}</H4>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Box>
);

// --- Layout Wrapper ---
Profile.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
