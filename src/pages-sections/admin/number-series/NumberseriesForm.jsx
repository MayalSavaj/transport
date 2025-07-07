import {
  Button,
  Card,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  TextField
} from "@mui/material";
import { Formik } from "formik";

const NumberseriesForm = (props) => {
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
              {/* Radio Buttons */}
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Select Series Type</FormLabel>
                  <RadioGroup
                    row
                    name="seriesType"
                    value={values.seriesType}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="invoice"
                      control={<Radio color="info" />}
                      label="Invoice Number"
                    />
                    <FormControlLabel
                      value="lr"
                      control={<Radio color="info" />}
                      label="LR Number"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Invoice Fields */}
              {values.seriesType === "invoice" && (
                <>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name="numberFormat"
                      label="Number Format"
                      placeholder="e.g. INV-####"
                      color="info"
                      size="medium"
                      value={values.numberFormat}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.numberFormat && !!errors.numberFormat}
                      helperText={touched.numberFormat && errors.numberFormat}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name="startingNumber"
                      label="Starting Number"
                      placeholder="e.g. 1001"
                      type="number"
                      color="info"
                      size="medium"
                      value={values.startingNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.startingNumber && !!errors.startingNumber}
                      helperText={touched.startingNumber && errors.startingNumber}
                    />
                  </Grid>
                </>
              )}

              {/* LR Field */}
              {values.seriesType === "lr" && (
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    name="startingNumber"
                    label="Starting Number"
                    placeholder="e.g. 5001"
                    type="number"
                    color="info"
                    size="medium"
                    value={values.startingNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.startingNumber && !!errors.startingNumber}
                    helperText={touched.startingNumber && errors.startingNumber}
                  />
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button variant="contained" color="info" type="submit">
                  {values.seriesType === "invoice"
                    ? "Save Invoice Number"
                    : values.seriesType === "lr"
                      ? "Save LR Number"
                      : "Save"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default NumberseriesForm;
