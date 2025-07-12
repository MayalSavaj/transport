import { useState } from "react";
import {
  Button,
  Card,
  Grid,
  TextField
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

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
  pin_code: yup.string().required("Pin code is required"),
  contact_person: yup.string().required("Contact person is required"),
  contact_number: yup.string().required("Contact number is required"),
});

const initialValues = {
  name: "",
  pan_number: "",
  gst_number: "",
  route_name: "",
  root: "",
  address: "",
  city: "",
  state: "",
  pin_code: "",
  contact_person: "",
  contact_number: "",
};

const SuppliersForm = ({ handleFormSubmit }) => {
  const [files, setFiles] = useState([]);

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
          handleSubmit
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Name */}
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

              {/* PAN Number */}
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="pan_number"
                  label="PAN Number"
                  size="medium"
                  placeholder="PAN Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.pan_number}
                  error={!!touched.pan_number && !!errors.pan_number}
                  helperText={touched.pan_number && errors.pan_number}
                />
              </Grid>

              {/* GST Number */}
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="gst_number"
                  label="GST Number"
                  size="medium"
                  placeholder="GST Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.gst_number}
                  error={!!touched.gst_number && !!errors.gst_number}
                  helperText={touched.gst_number && errors.gst_number}
                />
              </Grid>

              {/* Route Name */}
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="route_name"
                  label="Route Name"
                  size="medium"
                  placeholder="Route Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.route_name}
                  error={!!touched.route_name && !!errors.route_name}
                  helperText={touched.route_name && errors.route_name}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="rood"
                  label="Rood"
                  size="medium"
                  placeholder="Rood"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.rood}
                  error={!!touched.route_name && !!errors.route_name}
                  helperText={touched.route_name && errors.route_name}
                />
              </Grid>

              {/* Address */}
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  size="medium"
                  placeholder="Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  error={!!touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                />
              </Grid>

              {/* City */}
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="city"
                  label="City"
                  size="medium"
                  placeholder="City"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.city}
                  error={!!touched.city && !!errors.city}
                  helperText={touched.city && errors.city}
                />
              </Grid>

              {/* State */}
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="state"
                  label="State"
                  size="medium"
                  placeholder="State"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.state}
                  error={!!touched.state && !!errors.state}
                  helperText={touched.state && errors.state}
                />
              </Grid>

              {/* Pin Code */}
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="pin_code"
                  label="Pin Code"
                  size="medium"
                  placeholder="Pin Code"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.pin_code}
                  error={!!touched.pin_code && !!errors.pin_code}
                  helperText={touched.pin_code && errors.pin_code}
                />
              </Grid>

              {/* Contact Person */}
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="contact_person"
                  label="Contact Person"
                  size="medium"
                  placeholder="Contact Person"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contact_person}
                  error={!!touched.contact_person && !!errors.contact_person}
                  helperText={touched.contact_person && errors.contact_person}
                />
              </Grid>

              {/* Contact Number */}
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="contact_number"
                  label="Contact Number"
                  size="medium"
                  placeholder="Contact Number"
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
                  Save Supplier
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
