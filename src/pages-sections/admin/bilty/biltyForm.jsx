import React, { useState } from "react";
import {
  Button,
  Card,
  Grid,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Formik } from "formik";
import * as yup from "yup";

// Initial values and validation schema
const initialValues = {
  gstNumber: "",
  name: "",
  address1: "",
  address2: "",
  state: "",
  pincode: "",
  mobile: "",
  materialName: "",
  materialWeight: "",
};


const validationSchema = yup.object().shape({
  biltyNumber: yup.string().required("LR Number is required"),
  city: yup.string().required("City is required"),
});

const BiltyManager = () => {
  const [biltyList, setBiltyList] = useState([
    { city: "Surat", lrNumber: "LR-101" },
    { city: "Ahmedabad", lrNumber: "LR-102" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [partyType, setPartyType] = useState(null); // null | "consignee" | "consigner"
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenForm = () => {
    setModalOpen(true);
  };

  const handleCloseForm = () => {
    setModalOpen(false);
    setPartyType(null); // Reset selection when closing
  };

  const handleFormSubmit = (values, { resetForm }) => {
    const newEntry = {
      city: values.city,
      lrNumber: values.biltyNumber,
      name: values.name,
      surname: values.surname,
      type: partyType === "consignee" ? "Consignee" : "Consigner",
    };
    setBiltyList([...biltyList, newEntry]);
    resetForm();
    handleCloseForm();
  };

  const handleDownload = (bilty) => {
    alert(`Downloading ${bilty.city} - ${bilty.lrNumber}`);
  };

  const [tabAccess, setTabAccess] = useState([true, false, false]);

  const isTabValid = (tabIndex, values) => {
  if (tabIndex === 0) {
    // Consigner Tab
    return (
      values.consigner_name &&
      values.consigner_gstNumber &&
      values.consigner_address1 &&
      values.consigner_address2 &&
      values.consigner_state &&
      values.consigner_pincode &&
      values.consigner_mobile
    );
  }

  if (tabIndex === 1) {
    // Consignee Tab
    return (
      values.consignee_name &&
      values.consignee_gstNumber &&
      values.consignee_address1 &&
      values.consignee_address2 &&
      values.consignee_state &&
      values.consignee_pincode &&
      values.consignee_mobile
    );
  }

  if (tabIndex === 2) {
    // Material Tab
    return values.materialName && values.materialWeight;
  }

  return false;
};


  return (
    <>
      {/* Bilty List Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Bilty List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>City</TableCell>
              <TableCell>LR Number</TableCell>
              <TableCell>Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {biltyList.map((bilty, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell
                  sx={{ cursor: "pointer", color: "blue" }}
                  onClick={handleOpenForm}
                >
                  {bilty.city}
                </TableCell>
                <TableCell>{bilty.lrNumber}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleDownload(bilty)}
                  >
                    <DownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal with Selection & Form */}
      <Dialog open={modalOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}>
          Bilty
        </DialogTitle>
        <DialogContent>
          <Card sx={{ p: 3 }}>


            {/* Tab Navigation */}
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {["Consigner", "Consignee", "Material"].map((tab, index) => (
                <Grid item xs={4} key={tab}>
                  <Button
                    fullWidth
                    variant={activeTab === index ? "contained" : "outlined"}
                    disabled={!tabAccess[index]}
                    onClick={() => setActiveTab(index)}
                  >
                    {tab}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Formik Form */}
            <Formik
              initialValues={{
                consignee_mobile: "",
                consignee_name: "",
                consignee_gstNumber: "",
                consignee_address1: "",
                consignee_address2: "",
                consignee_state: "",
                consignee_pincode: "",
                consigner_mobile: "",
                consigner_name: "",
                consigner_gstNumber: "",
                consigner_address1: "",
                consigner_address2: "",
                consigner_state: "",
                consigner_pincode: "",
                materialName: "",
                materialWeight: "",
              }}
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
              }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    {/* Common Fields */}
                    {activeTab === 0 && (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label={partyType === "consignee" ? "Consignee Name" : "Consigner Name"}
                            name="consigner_name"
                            value={values.consigner_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="GST Number"
                            name="consigner_gstNumber"
                            value={values.consigner_gstNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.gstNumber && Boolean(errors.gstNumber)}
                            helperText={touched.gstNumber && errors.gstNumber}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Address"
                            name="consigner_address1"
                            value={values.consigner_address1}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.address1 && Boolean(errors.address1)}
                            helperText={touched.address1 && errors.address1}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="State"
                            name="consigner_state"
                            value={values.consigner_state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.state && Boolean(errors.state)}
                            helperText={touched.state && errors.state}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Pincode"
                            name="consigner_pincode"
                            value={values.consigner_pincode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.pincode && Boolean(errors.pincode)}
                            helperText={touched.pincode && errors.pincode}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Mobile Number"
                            name="consigner_mobile"
                            value={values.consigner_mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.mobile && Boolean(errors.mobile)}
                            helperText={touched.mobile && errors.mobile}
                          />
                        </Grid>
                      </>
                    )}

                    {/* Consigner / Consignee Info */}
                    {activeTab === 1 && (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label={partyType === "Consigner" ? "Consigner Name" : "Consignee Name"}
                            name="consignee_name"
                            value={values.consignee_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="GST Number"
                            name="consignee_gstNumber"
                            value={values.consignee_gstNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.gstNumber && Boolean(errors.gstNumber)}
                            helperText={touched.gstNumber && errors.gstNumber}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Address"
                            name="consignee_address1"
                            value={values.consignee_address1}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.address1 && Boolean(errors.address1)}
                            helperText={touched.address1 && errors.address1}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="State"
                            name="consignee_state"
                            value={values.consignee_state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.state && Boolean(errors.state)}
                            helperText={touched.state && errors.state}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Pincode"
                            name="consignee_pincode"
                            value={values.consignee_pincode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.pincode && Boolean(errors.pincode)}
                            helperText={touched.pincode && errors.pincode}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Mobile Number"
                            name="consignee_mobile"
                            value={values.consignee_mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.mobile && Boolean(errors.mobile)}
                            helperText={touched.mobile && errors.mobile}
                          />
                        </Grid>
                      </>
                    )}

                    {/* Material Info */}
                    {activeTab === 2 && (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Material Name"
                            name="materialName"
                            value={values.materialName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.materialName && Boolean(errors.materialName)}
                            helperText={touched.materialName && errors.materialName}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Material Weight"
                            name="materialWeight"
                            value={values.materialWeight}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.materialWeight && Boolean(errors.materialWeight)}
                            helperText={touched.materialWeight && errors.materialWeight}
                          />
                        </Grid>
                      </>
                    )}

                    {/* Action Button */}
                    <Grid item xs={12}>
                      {activeTab < 2 ? (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => {
                            if (isTabValid(activeTab, values)) {
                              const updatedAccess = [...tabAccess];
                              updatedAccess[activeTab + 1] = true;
                              setTabAccess(updatedAccess);
                              setActiveTab((prev) => prev + 1);
                            } else {
                              alert("Please fill all required fields before proceeding.");
                            }
                          }}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="success"
                        >
                          Save
                        </Button>
                      )}
                    </Grid>

                  </Grid>
                </form>
              )}
            </Formik>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BiltyManager;
