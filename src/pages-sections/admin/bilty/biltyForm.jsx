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
  <DialogTitle sx={{ textAlign: "center" }}> Bilty {partyType}</DialogTitle>
  <DialogContent>
    <Card sx={{ p: 3 }}>
      {/* Party Type Toggle Buttons */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {["consignee", "consigner"].map((type) => (
          <Grid item xs={6} key={type}>
            <Button
              fullWidth
              variant={partyType === type ? "contained" : "outlined"}
              color={partyType === type ? "primary" : "inherit"}
              onClick={() => setPartyType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Formik
        initialValues={initialValues}
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
              {[
                { label: "GST Number", name: "gstNumber" },
                {
                  label:
                    partyType === "consignee"
                      ? "Consignee Name"
                      : "Consigner Name",
                  name: "name",
                },
                { label: "Address Line 1", name: "address1" },
                { label: "Address Line 2", name: "address2" },
                { label: "State", name: "state" },
                { label: "Pincode", name: "pincode" },
                { label: "Mobile Number", name: "mobile" },
                { label: "Material Name", name: "materialName" },
                { label: "Material Weight", name: "materialWeight" },
              ].map((field) => (
                <Grid item xs={12} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched[field.name] && Boolean(errors[field.name])}
                    helperText={touched[field.name] && errors[field.name]}
                  />
                </Grid>
              ))}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="success"
                >
                  Save {partyType === "consignee" ? "Consignee" : "Consigner"}
                </Button>
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
