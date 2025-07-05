import { useState } from "react";
import { Button, Card, Grid, TextField } from "@mui/material";
import { Formik } from "formik";
import DropZone from "components/DropZone";
import { UploadImageBox, StyledClear } from "../StyledComponents";
import BazaarImage from "components/BazaarImage";
import { FlexBox } from "components/flex-box";


const PartysForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit } = props;
  const [files, setFiles] = useState([]);

  const handleChangeDropZone = files => {
    files.forEach(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(files);
  };

  const handleFileDelete = file => () => {
    setFiles(files => files.filter(item => item.name !== file.name));
  };

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

              <Grid item xs={12}>
                {!files.length ? (
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
                        setFiles([updatedFile]);
                      }
                    }}
                  />
                ) : (
                  <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                    {files.map((file, index) => (
                      <UploadImageBox key={index}>
                        <BazaarImage src={file.preview} width="100%" />
                        <StyledClear onClick={handleFileDelete(file)} />
                      </UploadImageBox>
                    ))}
                  </FlexBox>
                )}
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
