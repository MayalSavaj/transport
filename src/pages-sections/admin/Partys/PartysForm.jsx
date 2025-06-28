import { useState } from "react";
import { Button, Card, Grid, TextField } from "@mui/material";
import { Formik } from "formik";

const PartysForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit } = props;

  return (
    <Card sx={{ p: 6 }}>
      <Formik
        onSubmit={handleFormSubmit}
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
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* GST & PAN */}
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

              {/* Name, Contact Person */}
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

              {/* Contact Number, Address */}
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

              {/* City, State */}
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="city"
                  label="City"
                  color="info"
                  size="medium"
                  placeholder="City"
                  value={values.city}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.city && !!errors.city}
                  helperText={touched.city && errors.city}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="state"
                  label="State"
                  color="info"
                  size="medium"
                  placeholder="State"
                  value={values.state}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.state && !!errors.state}
                  helperText={touched.state && errors.state}
                />
              </Grid>

              {/* Pincode, Create Period */}
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
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="create_period"
                  label="Create Period"
                  color="info"
                  size="medium"
                  placeholder="Create Period"
                  value={values.create_period}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.create_period && !!errors.create_period}
                  helperText={touched.create_period && errors.create_period}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button variant="contained" color="info" type="submit">
                  Save Party
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
