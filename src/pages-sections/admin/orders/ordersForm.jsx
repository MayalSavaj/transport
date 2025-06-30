import {
  Button,
  Card,
  Grid,
  MenuItem,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { ToWords } from 'to-words';
import DownloadIcon from "@mui/icons-material/Download";

// Initial form values
const initialValues = {
  partyName: "",
  truckType: "",
  truckNo: "",
  payBy: "",
  pickup: "",
  dropPoints: [""],
  market: "",
  own: "no",
  settleSupplier: "",
  freight: "",
  hiringCost: ""
};

// Simple validation schema
const validationSchema = Yup.object().shape({
  partyName: Yup.string().required("Required"),
  truckType: Yup.string().required("Required"),
  truckNo: Yup.string().required("Required"),
  payBy: Yup.string().required("Required"),
  settleSupplier: Yup.string().required("Required"),
  freight: Yup.number().required("Required"),
  hiringCost: Yup.number().required("Required")
});
const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: false,
    ignoreDecimal: true,
    ignoreZeroCurrency: false,
  },
});

const OrdersForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [t3lrModalOpen, setT3lrModalOpen] = useState(false);
  const [form, setForm] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [t3lrForm, setT3lrForm] = useState({
    
    consignee: "",
    consigner: "",
  });
  const [lrInnerModalOpen, setLrInnerModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
 

  const handleDownload = (item) => {
    // Replace this with real download logic if needed
    console.log(`Downloading ${item.city} - ${item.lrNumber}`);
  };
  const handleCityClick = (item) => {
    setSelectedCity(item.city);
    setT3lrForm({ consignee: "", consigner: "" }); // Reset form when opened
  };

  const handleCloseCityModal = () => {
    setSelectedCity(null);
  };

  const handleChangeinvoice = (e) => {
    const { name, value } = e.target;

    const gstWords =
      name === "totalGst" && value
        ? toWords.convert(Number(value))
        : invoiceData.totalGstWords || "";

    setInvoiceData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "totalGst" && { totalGstWords: gstWords }),
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleFormSubmit = (values, { resetForm }) => {
    setFormData(values);
    setActiveTab(1);
  };

  const handleDelete = () => {
    setFormData(null);
    setActiveTab(0);
  };
  const handleFormChange = (field) => (event) => {
    setT3lrForm((prev) => ({ ...prev, [field]: event.target.value }));
  };
   const handleSave = () => {
    console.log("Saved Data:", { city: selectedCity, ...formData });
    setSelectedCity(null);
  };
  const lrDataList = [
    { city: "Surat", lrNumber: "LR101" },
    { city: "Rajkot", lrNumber: "LR205" },
    { city: "Ahmedabad", lrNumber: "LR309" },
  ];
  return (
    <Card sx={{ p: 3 }}>
      {/* Tabs UI */}
      <Paper elevation={1} sx={{ borderRadius: 2, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "16px",
              py: 1.5
            },
            "& .Mui-selected": {
              color: "#1976d2",
              backgroundColor: "#f5faff",
              borderBottom: "2px solid #1976d2"
            },
            "& .MuiTabs-indicator": {
              height: 0
            }
          }}
        >
          <Tab label="A1" />
          <Tab label="A2" />
          <Tab label="A3" />
          <Tab label="A4" />
        </Tabs>
      </Paper>

      {/* A1 Form */}
      {activeTab === 0 && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setFormData(values);
            setActiveTab(1); // Go to A2
          }}
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
              <Card
                elevation={2}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                {/* Section Title */}
                <Typography variant="h5" fontWeight={600} mb={3}>
                  Create New Order - A1
                </Typography>

                {/* Order Information */}
                <Typography variant="subtitle1" fontWeight={500} mb={2}>
                  Order Information
                </Typography>
                <Grid container spacing={3} mb={4}>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Party Name"
                      name="partyName"
                      value={values.partyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.partyName && !!errors.partyName}
                      helperText={touched.partyName && errors.partyName}
                    >
                      <MenuItem value="Party A">Party A</MenuItem>
                      <MenuItem value="Party B">Party B</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Truck Type"
                      name="truckType"
                      value={values.truckType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.truckType && !!errors.truckType}
                      helperText={touched.truckType && errors.truckType}
                    >
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="Container">Container</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Truck Number"
                      name="truckNo"
                      value={values.truckNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.truckNo && !!errors.truckNo}
                      helperText={touched.truckNo && errors.truckNo}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <Typography fontWeight={500} mb={1}>
                      Pay By
                    </Typography>
                    <RadioGroup
                      row
                      name="payBy"
                      value={values.payBy}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="billed" control={<Radio />} label="Billed" />
                      <FormControlLabel value="toPay" control={<Radio />} label="To Pay" />
                    </RadioGroup>
                  </Grid>
                </Grid>

                {/* Pickup & Drop */}
                <Typography variant="subtitle1" fontWeight={500} mb={2}>
                  Pickup & Drop Points
                </Typography>
                <Grid container spacing={3} mb={4}>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Pickup Location"
                      name="pickup"
                      value={values.pickup}
                      onChange={handleChange}
                    />
                  </Grid>

                  {values.dropPoints.map((drop, index) => (
                    <Grid item sm={6} xs={12} key={index}>
                      <TextField
                        fullWidth
                        label={`Drop Point ${index + 1}`}
                        name={`dropPoints[${index}]`}
                        value={drop}
                        onChange={handleChange}
                      />
                    </Grid>
                  ))}

                  {values.dropPoints.length < 3 && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setFieldValue("dropPoints", [...values.dropPoints, ""])
                        }
                      >
                        + Add Drop Point
                      </Button>
                    </Grid>
                  )}
                </Grid>

                {/* Additional Info */}
                <Typography variant="subtitle1" fontWeight={500} mb={2}>
                  Additional Details
                </Typography>
                <Grid container spacing={3} mb={4}>
                  <Grid item sm={6} xs={12}>
                    <Typography mb={1}>Market</Typography>
                    <RadioGroup
                      row
                      name="market"
                      value={values.market}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Selected" />
                      <FormControlLabel value="no" control={<Radio />} label="Not Selected" />
                    </RadioGroup>
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <Typography mb={1}>Own</Typography>
                    <RadioGroup row name="own" value={values.own}>
                      <FormControlLabel value="yes" control={<Radio />} label="Selected" disabled />
                      <FormControlLabel value="no" control={<Radio />} label="Not Selected" disabled />
                    </RadioGroup>
                  </Grid>
                </Grid>

                {/* Charges */}
                <Typography variant="subtitle1" fontWeight={500} mb={2}>
                  Charges & Supplier
                </Typography>
                <Grid container spacing={3} mb={4}>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Settle Supplier"
                      name="settleSupplier"
                      value={values.settleSupplier}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.settleSupplier && !!errors.settleSupplier}
                      helperText={touched.settleSupplier && errors.settleSupplier}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Freight Charges (₹)"
                      name="freight"
                      value={values.freight}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.freight && !!errors.freight}
                      helperText={touched.freight && errors.freight}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Hiring Cost (₹)"
                      name="hiringCost"
                      value={values.hiringCost}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.hiringCost && !!errors.hiringCost}
                      helperText={touched.hiringCost && errors.hiringCost}
                    />
                  </Grid>
                </Grid>

                {/* Submit */}
                <Box textAlign="right">
                  <Button variant="contained" color="primary" size="large" type="submit">
                    Save & Continue
                  </Button>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
      )}

      {/* A2 Page */}
      {activeTab === 1 && formData && (
        <Card
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "#fdfdfd",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header */}
          <Typography variant="h5" fontWeight={600} mb={3}>
            Payment & Order Summary
          </Typography>

          {/* Order Details */}
          <Grid container spacing={2} mb={3}>
            {[
              ["Party Name", formData.partyName],
              ["Truck Type", formData.truckType],
              ["Truck Number", formData.truckNo],
              ["Supplier", formData.settleSupplier],
              ["Pay By", formData.payBy],
              ["Freight Charges", `₹${formData.freight}`],
              ["Hiring Cost", `₹${formData.hiringCost}`],
            ].map(([label, value], index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box mb={1}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {label}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {value}
                  </Typography>
                </Box>
              </Grid>
            ))}

            {/* Profit Line */}
            <Grid item xs={12}>
              <Box
                p={2}
                mt={1}
                bgcolor="#eaf7f0"
                borderRadius={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Profit
                </Typography>
                <Typography variant="h6" color="success.main" fontWeight={700}>
                  ₹{Number(formData.freight) - Number(formData.hiringCost)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Payable Input */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Payable Amount
            </Typography>
            <TextField
              fullWidth
              name="payableAmount"
              placeholder="Enter amount (₹)"
              type="number"
              variant="outlined"
              size="medium"
              inputProps={{ min: 0 }}
            />
          </Box>

          {/* Action Buttons */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleFormSubmit}
            >
              Save & Continue
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setT3lrModalOpen(true)}
            >
              T3LR
            </Button>
            <Button variant="outlined" color="secondary" fullWidth onClick={() => setInvoiceModalOpen(true)}>
              Invoice
            </Button>
          </Stack>

          {/* Bottom Navigation */}
          <Stack direction="row" justifyContent="space-between">
            <Button
              variant="text"
              color="info"
              onClick={() => setActiveTab(0)}
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              ← Back & Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{ textTransform: "none" }}
            >
              Delete Order
            </Button>
          </Stack>
        </Card>
      )}

      <Dialog open={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700, textAlign: "center", fontSize: 22 }}>
          Invoice Generation
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3, px: 4, backgroundColor: "#fafafa" }}>
          <Grid container spacing={3}>
            {/* Section: Header */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Bill No" name="billNo" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                onChange={handleChangeinvoice}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Logo URL" name="logo" onChange={handleChangeinvoice} />
            </Grid>

            {/* Divider: Party Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>
                🧍 Party Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Party Name" name="partyName" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Address" name="address" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="GST No" name="gstNo" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Kindly" name="kindly" onChange={handleChangeinvoice} />
            </Grid>

            {/* Divider: Transport */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>
                🚛 Transport Info
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Transport Name" name="transportName" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Truck Type" name="truckType" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Truck Number" name="truckNumber" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Route" name="route" onChange={handleChangeinvoice} />
            </Grid>

            {/* Divider: Invoice */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>
                🧾 Invoice Info
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Invoice No" name="invoiceNo" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Invoice Date"
                name="invoiceDate"
                type="date"
                onChange={handleChangeinvoice}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="PAN No" name="pan" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="PO No" name="poNo" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PO Date"
                name="poDate"
                type="date"
                onChange={handleChangeinvoice}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="MSME No" name="msme" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Party Invoice" name="partyInvoice" onChange={handleChangeinvoice} />
            </Grid>

            {/* Divider: Amount */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>
                💰 Amount Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Amount" name="amount" onChange={handleChangeinvoice} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total GST"
                name="totalGst"
                value={invoiceData.totalGst || ""}
                onChange={handleChangeinvoice}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total GST (in words)"
                name="totalGstWords"
                value={invoiceData.totalGstWords || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                🏦 Bank Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankName"
                onChange={handleChangeinvoice}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch"
                name="branch"
                onChange={handleChangeinvoice}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Number"
                name="accountNumber"
                onChange={handleChangeinvoice}
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="ifscCode"
                onChange={handleChangeinvoice}
              />
            </Grid>

            {/* Divider: Other Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>
                🏦 Other Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>


            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Terms & Conditions"
                name="tnc"
                onChange={handleChangeinvoice}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ justifyContent: "space-between", p: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setInvoiceModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={t3lrModalOpen} onClose={() => setT3lrModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          T3LR
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" mt={1} align="center">
            Do you want to continue with the T3LR process?
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                console.log("Yes clicked");
                setT3lrModalOpen(false);
                setLrInnerModalOpen(true);
              }}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setT3lrModalOpen(false)}
            >
              No
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Modal */}
     <Dialog
        open={lrInnerModalOpen}
        onClose={() => setLrInnerModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          LR
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          <Stack spacing={2}>
            {lrDataList.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                }}
                onClick={() => handleCityClick(item)} // Click on box
              >
                <Typography variant="body2">
                  {item.city} - {item.lrNumber}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent city modal opening
                    handleDownload(item);
                  }}
                  color="primary"
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>

          <Stack direction="row" justifyContent="center" mt={3}>
            <Button variant="contained" onClick={() => setLrInnerModalOpen(false)}>
              Close
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

     <Dialog
        open={Boolean(selectedCity)}
        onClose={handleCloseCityModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          Bilty Form - {selectedCity}
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Consignee"
              fullWidth
              value={t3lrForm.consignee}
              onChange={handleFormChange("consignee")}
            />
            <TextField
              label="Consigner"
              fullWidth
              value={t3lrForm.consigner}
              onChange={handleFormChange("consigner")}
            />
          </Stack>

          <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleCloseCityModal}>
              Close
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>










      {/* A3 Page */}
      {activeTab === 2 && (
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            A3 Section - Review
          </Typography>
          <Typography mb={2}>You can review or go to final message.</Typography>
          <Button variant="contained" onClick={() => setActiveTab(3)}>
            Go to A4
          </Button>
        </Box>
      )}

      {/* A4 Page */}
      {activeTab === 3 && (
        <Box p={2} textAlign="center">
          <Typography variant="h4" fontWeight={700} color="primary">
            Welcome Mayal 🎉
          </Typography>
          <Typography mt={2}>You’ve successfully completed the steps.</Typography>
        </Box>
      )}
    </Card>
  );
};

export default OrdersForm;
