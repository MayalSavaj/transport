import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  MenuItem
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "utils/axios";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  pan_number: yup
    .string()
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number")
    .required("PAN number is required"),
  gst_number: yup.string().required("GST number is required"),
  route_name: yup.string().required("Route name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pincode: yup.string().required("Pin code is required"),
  contact_person: yup.string().required("Contact person is required"),
  contact_number: yup.string().required("Contact number is required"),
});

const SuppliersForm = (props) => {
  const [files, setFiles] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const { initialValues, handleFormSubmit } = props;

  // Fetch states and cities from API
  useEffect(() => {
    axios.get("/cities").then((response) => {
      const cityList = response?.data?.city || [];
      setCities(cityList);

      // Extract unique states
      const uniqueStates = [...new Set(cityList.map((item) => item.city_state))];
      setStates(uniqueStates);

      // Pre-filter cities if state is already selected (edit mode)
      if (initialValues.state) {
        const filtered = cityList.filter((c) => c.city_state === initialValues.state);
        setFilteredCities(filtered);
      }
    });
  }, [initialValues.state]);

  const handleStateChange = (selectedState, setFieldValue) => {
    setFieldValue("state", selectedState);
    setFieldValue("city", ""); // Reset city when state changes
    const filtered = cities.filter((c) => c.city_state === selectedState);
    setFilteredCities(filtered);
  };

  const handleChangeDropZone = (files) => {
    files.forEach((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(files);
  };

  const handleFileDelete = (file) => () => {
    setFiles((files) => files.filter((item) => item.name !== file.name));
  };

  return (
    <Card sx={{ p: 6 }}>
      <Formik
        onSubmit={(values) => {
          console.log("Form Values:", values);
          console.log("Uploaded Files:", files);
          if (handleFormSubmit) handleFormSubmit(values, files);
        }}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={800} mb={1}>
                  Supplier Details
                </Typography>
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  size="medium"
                  placeholder="Supplier Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="pan_number"
                  label="PAN Number"
                  placeholder="PAN Number"
                  size="medium"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.pan_number}
                  error={!!touched.pan_number && !!errors.pan_number}
                  helperText={touched.pan_number && errors.pan_number}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="gst_number"
                  label="GST Number"
                  placeholder="GST Number"
                  size="medium"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.gst_number}
                  error={!!touched.gst_number && !!errors.gst_number}
                  helperText={touched.gst_number && errors.gst_number}
                />
              </Grid>

              {/* Route Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={800} mb={1}>
                  Route Details
                </Typography>
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="route_name"
                  label="Route Name"
                  placeholder="Route Name"
                  size="medium"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.route_name}
                  error={!!touched.route_name && !!errors.route_name}
                  helperText={touched.route_name && errors.route_name}
                />
              </Grid>

              {/* Address Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={800} mb={1}>
                  Address Information
                </Typography>
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  placeholder="Address"
                  size="medium"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  error={!!touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                />
              </Grid>

              {/* State Dropdown */}
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  name="state"
                  label="State"
                  size="medium"
                  value={values.state}
                  onBlur={handleBlur}
                  onChange={(e) => handleStateChange(e.target.value, setFieldValue)}
                  error={!!touched.state && !!errors.state}
                  helperText={touched.state && errors.state}
                >
                  {states.map((state, index) => (
                    <MenuItem key={index} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* City Dropdown */}
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  name="city"
                  label="City"
                  size="medium"
                  value={values.city}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!values.state}
                  error={!!touched.city && !!errors.city}
                  helperText={touched.city && errors.city}
                >
                  {filteredCities.map((city) => (
                    <MenuItem key={city.id} value={city.city_name}>
                      {city.city_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="pincode"
                  label="Pin Code"
                  placeholder="Pin Code"
                  size="medium"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.pincode}
                  error={!!touched.pincode && !!errors.pincode}
                  helperText={touched.pincode && errors.pincode}
                />
              </Grid>

              {/* Contact Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={800} mb={1}>
                  Contact Details
                </Typography>
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="contact_person"
                  label="Contact Person"
                  placeholder="Contact Person"
                  size="medium"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contact_person}
                  error={!!touched.contact_person && !!errors.contact_person}
                  helperText={touched.contact_person && errors.contact_person}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="contact_number"
                  label="Contact Number"
                  placeholder="Contact Number"
                  size="medium"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contact_number}
                  error={!!touched.contact_number && !!errors.contact_number}
                  helperText={touched.contact_number && errors.contact_number}
                />
              </Grid>

              {/* Submit */}
              <Grid item xs={12}>
                <Button variant="contained" color="info" type="submit">
                  {values?.id ? "Update Supplier" : "Save Supplier"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default SuppliersForm;
