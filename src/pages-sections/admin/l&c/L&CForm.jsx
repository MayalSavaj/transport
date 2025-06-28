import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";

const LCForm = (props) => {
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
          handleSubmit
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Text Field */}
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="textField"
                  label="Terms and Conditions"
                  color="info"
                  size="medium"
                  placeholder="Enter text"
                  multiline
                  minRows={4} // or use rows={4} if you want fixed height
                  value={values.textField}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.textField && !!errors.textField}
                  helperText={touched.textField && errors.textField}
                />

              </Grid>

              {/* Dropdown Field */}
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="dropdownField"
                  onBlur={handleBlur}
                  value={values.dropdownField}
                  onChange={handleChange}
                  label="T & C Type"
                  placeholder="Select Option"
                >
                  <MenuItem value="option1">Invoice</MenuItem>
                  <MenuItem value="option2">L-R</MenuItem>
                </TextField>
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
