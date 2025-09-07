import { Button, Card, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";

const PartysForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit } = props;

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [country] = useState("India"); // Country fixed as India

  // ✅ Fetch city & state data from API
  useEffect(() => {
    axios.get("/cities").then((response) => {
      const cityList = response?.data?.city || [];
      setCities(cityList);

      // ✅ Extract unique states from city list
      const uniqueStates = [...new Set(cityList.map((item) => item.city_state))];
      setStates(uniqueStates);
    });
  }, []);

  // ✅ Handle State Change
  const handleStateChange = (selectedState, setFieldValue) => {
    setFieldValue("state", selectedState);
    setFieldValue("city", ""); // Reset city when state changes

    // ✅ Filter cities based on selected state
    const filtered = cities.filter((c) => c.city_state === selectedState);
    setFilteredCities(filtered);
  };

  // ✅ When editing (update mode) - prepopulate cities list for selected state
  useEffect(() => {
    if (initialValues.state) {
      const filtered = cities.filter((c) => c.city_state === initialValues.state);
      setFilteredCities(filtered);
    }
  }, [initialValues.state, cities]);

  console.log("intial valus", initialValues);


  return (
    <Card sx={{ p: 6 }}>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize // ✅ Ensures form updates when initialValues change
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
              {/* GST & PAN */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={800} mb={1}>
                  Party Details
                </Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="gst_number"
                  label="GST Number"
                  color="info"
                  size="medium"
                  placeholder="GST Number"
                  value={values.gst_number}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.gst_number && !!errors.gst_number}
                  helperText={touched.gst_number && errors.gst_number}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="pan_number"
                  label="PAN Number"
                  color="info"
                  size="medium"
                  placeholder="PAN Number"
                  value={values.pan_number}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.pan_number && !!errors.pan_number}
                  helperText={touched.pan_number && errors.pan_number}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="vendor_code"
                  label="Vendor Code"
                  color="info"
                  size="medium"
                  placeholder="Vendor Code"
                  value={values.vendor_code}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.vendor_code && !!errors.vendor_code}
                  helperText={touched.vendor_code && errors.vendor_code}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  color="info"
                  size="medium"
                  placeholder="Party Name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>

              {/* Contact Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={800} mb={1}>
                  Contact & Address
                </Typography>
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="contact_person"
                  label="Contact Person"
                  color="info"
                  size="medium"
                  placeholder="Contact Person"
                  value={values.contact_person}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.contact_person && !!errors.contact_person}
                  helperText={touched.contact_person && errors.contact_person}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="contact_number"
                  label="Contact Number"
                  color="info"
                  size="medium"
                  placeholder="Contact Number"
                  value={values.contact_number}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.contact_number && !!errors.contact_number}
                  helperText={touched.contact_number && errors.contact_number}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  color="info"
                  size="medium"
                  placeholder="Address"
                  value={values.address}
                  onBlur={handleBlur}
                  onChange={handleChange}
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
                  color="info"
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
                  color="info"
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

              {/* Country */}
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="country"
                  label="Country"
                  color="info"
                  size="medium"
                  value={country}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="pincode"
                  label="Pincode"
                  color="info"
                  size="medium"
                  placeholder="Pincode"
                  value={values.pincode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.pincode && !!errors.pincode}
                  helperText={touched.pincode && errors.pincode}
                />
              </Grid>

              {/* Other Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={800} mb={1}>
                  Other Information
                </Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="period_days"
                  label="Create Period (Days)"
                  color="info"
                  size="medium"
                  placeholder="Create Period"
                  value={values.period_days}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.period_days && !!errors.period_days}
                  helperText={touched.period_days && errors.period_days}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button variant="contained" color="info" type="submit">
                  {values?.id ? "Update Party" : "Create Party"}
                </Button>

              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default PartysForm;
