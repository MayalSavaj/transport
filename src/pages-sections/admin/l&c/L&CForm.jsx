import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";

const LCForm = ({ initialValues, validationSchema, handleFormSubmit }) => {
  return (
    <Card sx={{ p: 6 }}>
      <Formik
        enableReinitialize
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
          handleSubmit
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Dropdown Field */}
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="type"
                  onBlur={handleBlur}
                  value={values.type == "invoice" ? "Invoice" : "L-R"}
                  onChange={handleChange}
                  label="T & C Type"
                  placeholder="Select Option"
                  error={!!touched.type && !!errors.type}
                  helperText={touched.type && errors.type}
                >
                  <MenuItem value="Invoice">Invoice</MenuItem>
                  <MenuItem value="L-R">L-R</MenuItem>
                </TextField>
              </Grid>

              {/* Text Field */}
              <Grid item sm={12} xs={12}>
                <TextField
                  fullWidth
                  name="terms"
                  label="Terms and Conditions"
                  color="info"
                  size="medium"
                  placeholder="Enter text"
                  multiline
                  minRows={10}
                  value={values.terms}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.terms && !!errors.terms}
                  helperText={touched.terms && errors.terms}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button variant="contained" color="info" type="submit">
                  Save T & C
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default LCForm;
