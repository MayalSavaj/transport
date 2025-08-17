import React, { useEffect, useState } from "react";
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
import axios from "utils/axios"; // import the custom axios
import { useRouter } from "next/router";


// Initial values and validation schema

const validationSchema = yup.object().shape({
  // biltyNumber: yup.string().required("LR Number is required"),
  // city: yup.string().required("City is required"),
});

const BiltyManager = () => {
  const router = useRouter();
  const { id } = router.query;

  const [biltyList, setBiltyList] = useState([]);
  const [lrNumber, setLrNumber] = useState();

  useEffect(() => {
    const fetchOrderLr = async () => {
      try {
        const res = await axios.get(`/showBilty/${id}`);
        if (res.data) {

          console.log(res.data.data);
          setBiltyList(res.data.data);

          console.log("Party Payments Data:", res.data);
        }

      } catch (err) {
        console.error("Failed to fetch terms & conditions", err);
      } finally {
      }
    };

    fetchOrderLr();
  }, []);


  console.log("Bityt list ", biltyList);
  const [modalOpen, setModalOpen] = useState(false);
  const [partyType, setPartyType] = useState(null); // null | "consignee" | "consigner"
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenForm = (value) => {
    setLrNumber(value)
    setModalOpen(true);
  };

  const handleCloseForm = () => {
    setModalOpen(false);
    setPartyType(null); // Reset selection when closing
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    console.log("handleFormSubmit called ✅ with values:", values);
    try {
      const payload = {
        consigner_name: values.consigner_name,
        consigner_gst_number: values.consigner_gstNumber,
        consigner_address: values.consigner_address1,
        consigner_state: values.consigner_state,
        consigner_pincode: values.consigner_pincode,
        consigner_phone: values.consigner_mobile,

        consignee_name: values.consignee_name,
        consignee_gst_number: values.consignee_gstNumber,
        consignee_address: values.consignee_address1,
        consignee_state: values.consignee_state,
        consignee_pincode: values.consignee_pincode,
        consignee_phone: values.consignee_mobile,

        material_details: values.materialDetail,
        total_weight: values.totalWeight,
        e_bill_no: values.ewayBillNo,
        invoice_number: values.invoiceNo,
        amount: values.materialAmount,
      };

      const res = await axios.post(`/updateBilty/${lrNumber}`, payload);
      console.log("Update Bilty Response:", res.data);

      resetForm();
      handleCloseForm();
    } catch (err) {
      console.error("Failed to update Bilty:", err);
    }
  };


  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`/download-Bitty/${id}`, {
        responseType: "blob", // Important
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `consignment_note_${new Date().toISOString()}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };



  const [tabAccess, setTabAccess] = useState([true, false, false]);

  const isTabValid = (tabIndex, values) => {
    if (tabIndex === 0) {
      // Consigner Tab
      return (
        values.consigner_name &&
        values.consigner_gstNumber &&
        values.consigner_address1 &&
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
        values.consignee_state &&
        values.consignee_pincode &&
        values.consignee_mobile
      );
    }

    if (tabIndex === 2) {
      return (
        values.materialDetail &&
        values.totalWeight &&
        values.ewayBillNo &&
        values.invoiceNo &&
        values.materialAmount
      );
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
            {biltyList?.lrNumbers?.map((bilty, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell
                  sx={{ cursor: "pointer", color: "blue" }}
                  onClick={() => handleOpenForm(bilty?.id)}
                >
                  {bilty.drop_location}
                </TableCell>
                <TableCell>{bilty.lr_number}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleDownload(bilty?.id)}
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
                consignee_mobile: biltyList?.consignee?.contact_number ?? "",
                consignee_name: biltyList?.consignee?.name ?? "",
                consignee_gstNumber: biltyList?.consignee?.gst_number ?? "",
                consignee_address1: biltyList?.consignee?.address ?? "",
                consignee_address2: "",
                consignee_state: biltyList?.consignee?.state ?? "",
                consignee_pincode: biltyList?.consignee?.pincode ?? "",
                consigner_mobile: biltyList?.consigner?.contact_number,
                consigner_name: biltyList?.consigner?.name,
                consigner_gstNumber: biltyList?.consigner?.gst_number,
                consigner_address1: biltyList?.consigner?.address,
                consigner_address2: "",
                consigner_state: biltyList?.consigner?.state,
                consigner_pincode: biltyList?.consigner?.pincode,
                materialDetail: "",
                totalWeight: "",
                ewayBillNo: "",
                invoiceNo: biltyList?.order?.invoice_number ?? "",
                materialAmount: "",
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
                            multiline
                            minRows={3}
                            label="Material Detail"
                            name="materialDetail"
                            value={values.materialDetail}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.materialDetail && Boolean(errors.materialDetail)}
                            helperText={touched.materialDetail && errors.materialDetail}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Total Weight"
                            name="totalWeight"
                            value={values.totalWeight}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.totalWeight && Boolean(errors.totalWeight)}
                            helperText={touched.totalWeight && errors.totalWeight}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="E-Way Bill No"
                            name="ewayBillNo"
                            value={values.ewayBillNo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.ewayBillNo && Boolean(errors.ewayBillNo)}
                            helperText={touched.ewayBillNo && errors.ewayBillNo}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Invoice Number"
                            name="invoiceNo"
                            value={values.invoiceNo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.invoiceNo && Boolean(errors.invoiceNo)}
                            helperText={touched.invoiceNo && errors.invoiceNo}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Material Amount"
                            name="materialAmount"
                            value={values.materialAmount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.materialAmount && Boolean(errors.materialAmount)}
                            helperText={touched.materialAmount && errors.materialAmount}
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
