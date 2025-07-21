import {
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab as MuiTab,
  Tabs as MuiTabs,
  Fade,
  Stack,
  IconButton
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useRouter } from "next/router";
import DownloadIcon from "@mui/icons-material/Download";


const initialValues = {
  partyName: "",
  truckType: "",
  truckNo: "",
  payBy: "",
  pickup: "",
  dropPoints: [""],
  market: "yes",
  settleSupplier: "",
  freight: "",
  hiringCost: "",
  Party: "",
  Supplier: "",
};

// Validation schema
const validationSchema = Yup.object().shape({
  partyName: Yup.string().required("Required"),
  truckType: Yup.string().required("Required"),
  truckNo: Yup.string().required("Required"),
  payBy: Yup.string().required("Required"),
  settleSupplier: Yup.string().required("Required"),
  freight: Yup.number().required("Required"),
  hiringCost: Yup.number().required("Required"),
});

// Main component
const OrderdetailsForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  // Modals
  const [openAdvanceModal, setOpenAdvanceModal] = useState(false);
  const [openChargeModal, setOpenChargeModal] = useState(false);
  const [openAmountEditModal, setOpenAmountEditModal] = useState(false);
  const [opnelrModal, setOpenlrModal] = useState(false);
  const [t3lrModalOpen, setT3lrModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const [t3lrForm, setT3lrForm] = useState({

    consignee: "",
    consigner: "",
    material: "",
  });
  const handleDownload = (item) => {
    console.log(`Downloading ${item.city} - ${item.lrNumber}`);
  };
  const handleCityClick = (item) => {
    setSelectedCity(item.city);
    setT3lrForm({ consignee: "", consigner: "" });
  };


  const handleCloseCityModal = () => {
    setSelectedCity(null);
  };
  const lrDataList = [
    { city: "Surat", lrNumber: "LR101" },
    { city: "Rajkot", lrNumber: "LR205" },
    { city: "Ahmedabad", lrNumber: "LR309" },
  ];
  const handleFormChange = (field) => (event) => {
    setT3lrForm((prev) => ({ ...prev, [field]: event.target.value }));
  };
  const handleSave = () => {
    console.log("Saved Data:", { city: selectedCity, ...formData });
    setSelectedCity(null);
  };
  // Data management
  const [advanceType, setAdvanceType] = useState("party");
  const [chargeType, setChargeType] = useState("party");
  const [editAmountType, setEditAmountType] = useState("party");
  const [tempAmount, setTempAmount] = useState("");

  const [advanceData, setAdvanceData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [chargeData, setChargeData] = useState({
    amount: "",
    description: "",
  });

  // Handlers
  const handleAdvanceChange = (field, value) => {
    setAdvanceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChargeChange = (field, value) => {
    setChargeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTabChange = (_, newValue) => setActiveTab(newValue);

  const handleOpenAmountEdit = (type, value) => {
    setEditAmountType(type);
    setTempAmount(value || "");
    setOpenAmountEditModal(true);
  };
  const [openPodModal, setOpenPodModal] = useState(false);
  const [podFile, setPodFile] = useState(null);

  const handleFileChange = (e) => {
    setPodFile(e.target.files[0]);
  };
  return (
    <Card sx={{ p: 3 }}>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Order Information" />
        <Tab label="Payment" />
      </Tabs>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (activeTab === 0) {
            setActiveTab(1);
          } else {
            console.log("Form Submit", values);
            router.push("/admin/Partys");
          }
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
            <Card sx={{ p: 4, borderRadius: 3, backgroundColor: "#fff" }}>


              {activeTab === 0 && (
                <Grid container spacing={3}>
                  {/* === LEFT SIDE (Trip Info) === */}
                  <Grid item xs={12} md={8}>
                    <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                      {/* Header */}
                      <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={700}>GJ 05 BB 1111</Typography>
                        <Box ml={2} px={1.5} py={0.5} bgcolor="warning.main" color="#fff" borderRadius={1} fontSize={12}>
                          MARKET
                        </Box>
                      </Box>

                      {/* Party Info */}
                      <Typography variant="subtitle1" fontWeight={600} mb={2}>Nirav</Typography>

                      <Grid container spacing={3}>
                        <Grid item sm={6}>
                          <Typography variant="body2" color="text.secondary">Party Name</Typography>
                          <Typography fontWeight={600} color="primary.main">Nirav</Typography>
                          <Typography variant="body2" color="text.secondary" mt={1}>Party Balance</Typography>
                          <Typography fontWeight={600} color="success.main">₹ 500</Typography>
                        </Grid>

                        <Grid item sm={6}>
                          <Typography variant="body2" color="text.secondary">Supplier Name</Typography>
                          <Typography fontWeight={600} color="primary.main">Rajesh</Typography>
                          <Typography variant="body2" color="text.secondary" mt={1}>Supplier Balance</Typography>
                          <Typography fontWeight={600} color="success.main">₹ 200</Typography>
                        </Grid>

                        <Grid item sm={6}>
                          <Typography variant="body2" color="text.secondary">LR Number</Typography>
                          <Typography fontWeight={600}>LRN-001</Typography>
                        </Grid>

                        <Grid item sm={6}>
                          <Typography variant="body2" color="text.secondary">Pay By</Typography>
                          <Typography fontWeight={600}>Billed</Typography>
                        </Grid>

                        <Grid item sm={6}>
                          <Typography variant="body2" color="text.secondary">Mumbai</Typography>
                          <Typography variant="caption" color="text.secondary">1 Jul 2025</Typography>
                        </Grid>

                        <Grid item sm={6}>
                          <Typography variant="body2" color="text.secondary">Delhi</Typography>
                        </Grid>
                      </Grid>

                      {/* Status Progress */}
                      <Box mt={5}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          {["Started", "In-transit", "Completed"].map((step, index) => (
                            <Typography key={step} fontSize={13} color={index === 0 ? "success.main" : "text.secondary"} fontWeight={index === 0 ? 600 : 400}>
                              {step}
                            </Typography>
                          ))}
                        </Box>
                        <Box position="relative" height={6} bgcolor="#eee" borderRadius={3}>
                          {[0, 50, 100].map((left, i) => (
                            <Box
                              key={i}
                              position="absolute"
                              left={`${left}%`}
                              top={-5}
                              width={16}
                              height={16}
                              bgcolor={i === 0 ? "green" : "#bbb"}
                              borderRadius="50%"
                              transform="translateX(-50%)"
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Action Buttons */}
                      <Box mt={4} display="flex" gap={2} flexWrap="wrap">
                        <Button variant="outlined" color="success" sx={{ borderRadius: 2, px: 3 }}>
                          Complete Trip
                        </Button>
                        <Button variant="contained" color="primary" sx={{ borderRadius: 2, px: 4 }}>
                          View Bill
                        </Button>
                      </Box>
                    </Card>
                  </Grid>

                  {/* === RIGHT SIDE (Profit) === */}
                  <Grid item xs={12} md={4}>
                    {/* Trip Profit Card */}
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                      <Typography variant="h6" fontWeight={700} mb={3}>Profit</Typography>

                      {/* Revenue */}
                      <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>(+) Revenue</Typography>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Nirav</Typography>
                          <Typography fontWeight={600} color="primary.main">₹ 500</Typography>
                        </Box>
                      </Box>

                      {/* Expense */}
                      <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>(-) Expense</Typography>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Truck Hire Cost</Typography>
                          <Typography fontWeight={600} color="error.main">₹ 200</Typography>
                        </Box>
                      </Box>

                      {/* Total Profit */}
                      <Box mt={3} pt={2} borderTop="1px dashed #ccc">
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Profit</Typography>
                          <Typography fontWeight={700} color="success.main" fontSize={24}>₹ 300</Typography>
                        </Box>
                      </Box>
                    </Card>

                    {/* Action Buttons Card */}
                    <Card sx={{ mt: 3, p: 3, borderRadius: 3, boxShadow: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} mb={2}>Nirav</Typography>

                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body2">Online Bilty/LR</Typography>

                        <Button variant="contained" size="small" color="success" sx={{ borderRadius: 2 }}
                          onClick={() => setT3lrModalOpen(true)}
                        >Create LR</Button>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">POD Challan</Typography>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          sx={{ borderRadius: 2 }}
                          onClick={() => setOpenPodModal(true)}
                        >
                          Add POD
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              )}
              <Dialog open={openPodModal} onClose={() => setOpenPodModal(false)}>
                <DialogTitle>POD</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    type="file"
                    label="Proof of Delivery"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleFileChange}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenPodModal(false)} color="error">
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      // You can add upload logic here
                      console.log("Selected POD file:", podFile);
                      setOpenPodModal(false);
                    }}
                  >
                    Upload
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
                        setT3lrModalOpen(false);
                        router.push("/admin/bilty/create");
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


              {activeTab === 1 && (
                <>
                  {/* Party Amount */}
                  <Typography variant="h6" fontWeight={800} mb={2}>Party Amount</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1">Party Amount</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography color="primary" fontWeight={600}>₹ {values.Party || 0}</Typography>
                      <Button size="small" onClick={() => handleOpenAmountEdit("Party", values.Party)}>✏️</Button>
                    </Box>
                  </Box>
                  <Box pl={2} mb={2}>
                    <Typography variant="body2">(-) Advance</Typography>
                    <Button size="small" color="primary" onClick={() => {
                      setAdvanceType("party"); setOpenAdvanceModal(true);
                    }}>Add Advance</Button>
                    <Typography variant="body2" mt={2}>(+) Charges</Typography>
                    <Button size="small" color="primary" onClick={() => {
                      setChargeType("party"); setOpenChargeModal(true);
                    }}>Add Charge</Button>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={2} mb={4}>
                    <Typography fontWeight={700}>Pending Party Balance</Typography>
                    <Typography color="primary" fontWeight={700}>
                      ₹ {
                        (
                          parseFloat(values.Party || 0) -
                          (advanceType === "party" ? parseFloat(advanceData.amount || 0) : 0) +
                          (chargeType === "party" ? parseFloat(chargeData.amount || 0) : 0)
                        ).toFixed(2)
                      }
                    </Typography>
                  </Box>

                  {/* Supplier Amount */}
                  <Typography variant="h6" fontWeight={800} mt={3} mb={2}>Supplier Amount</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1">Supplier Amount</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography color="primary" fontWeight={600}>₹ {values.Supplier || 0}</Typography>
                      <Button size="small" onClick={() => handleOpenAmountEdit("Supplier", values.Supplier)}>✏️</Button>
                    </Box>
                  </Box>
                  <Box pl={2} mb={2}>
                    <Typography variant="body2">(-) Advance</Typography>
                    <Button size="small" color="primary" onClick={() => {
                      setAdvanceType("supplier"); setOpenAdvanceModal(true);
                    }}>Add Supplier Advance</Button>
                    <Typography variant="body2" mt={2}>(+) Charges</Typography>
                    <Button size="small" color="primary" onClick={() => {
                      setChargeType("supplier"); setOpenChargeModal(true);
                    }}>Add Supplier Charge</Button>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={2} mb={4}>
                    <Typography fontWeight={700}>Pending Supplier Balance</Typography>
                    <Typography color="primary" fontWeight={700}>
                      ₹ {
                        (parseFloat(values.Supplier || 0) -
                          (advanceType === "supplier" ? parseFloat(advanceData.amount || 0) : 0) +
                          (chargeType === "supplier" ? parseFloat(chargeData.amount || 0) : 0)
                        ).toFixed(2)}
                    </Typography>
                  </Box>
                </>
              )}

              <Box textAlign="right" mt={4}>
                <Button variant="contained" type="submit">
                  {activeTab === 0 ? "Save & Continue" : "Submit"}
                </Button>
              </Box>
            </Card>

            {/* Amount Edit Modal */}
            <Dialog open={openAmountEditModal} onClose={() => setOpenAmountEditModal(false)} maxWidth="xs" fullWidth>
              <DialogTitle>Edit {editAmountType} Amount</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth type="number" label={`${editAmountType} Amount`}
                  value={tempAmount}
                  onChange={(e) => setTempAmount(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAmountEditModal(false)}>Cancel</Button>
                <Button variant="contained" onClick={() => {
                  setFieldValue(editAmountType, parseFloat(tempAmount) || 0);
                  setOpenAmountEditModal(false);
                }}>Save</Button>
              </DialogActions>
            </Dialog>

            {/* Advance Modal */}
            <Dialog open={openAdvanceModal} onClose={() => setOpenAdvanceModal(false)} fullWidth maxWidth="xs">
              <DialogTitle>Add {advanceType === "party" ? "Party" : "Supplier"} Advance</DialogTitle>
              <DialogContent sx={{ pt: 2 }}>
                <MuiTabs
                  value={advanceType === "party" ? 0 : 1}
                  onChange={(_, newValue) => setAdvanceType(newValue === 0 ? "party" : "supplier")}
                >
                  <MuiTab label="Party Advance" />
                  <MuiTab label="Supplier Advance" />
                </MuiTabs>

                <TextField
                  fullWidth
                  label="Advance Amount"
                  type="number"
                  value={advanceData.amount}
                  onChange={(e) => handleAdvanceChange("amount", e.target.value)}
                  sx={{ my: 2 }}
                />

                {/* ✅ New Date Field */}
                <TextField
                  fullWidth
                  label="Payment Date"
                  type="date"
                  value={advanceData.date}
                  onChange={(e) => handleAdvanceChange("date", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  value={advanceData.notes}
                  onChange={(e) => handleAdvanceChange("notes", e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAdvanceModal(false)}>Close</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    console.log(`${advanceType} Advance:`, advanceData);
                    setOpenAdvanceModal(false);
                  }}
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>


            {/* Charge Modal */}
            <Dialog open={openChargeModal} onClose={() => setOpenChargeModal(false)} fullWidth maxWidth="xs">
              <DialogTitle>Add {chargeType === "party" ? "Party" : "Supplier"} Charge</DialogTitle>
              <DialogContent sx={{ pt: 2 }}>
                <TextField
                  fullWidth label="Charge Amount" type="number"
                  value={chargeData.amount}
                  onChange={(e) => handleChargeChange("amount", e.target.value)}
                  sx={{ my: 2 }}
                />
                <TextField
                  fullWidth label="Description" multiline rows={2}
                  value={chargeData.description}
                  onChange={(e) => handleChargeChange("description", e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenChargeModal(false)}>Close</Button>
                <Button variant="contained" onClick={() => {
                  console.log(`${chargeType} Charge:`, chargeData);
                  setOpenChargeModal(false);
                }}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default OrderdetailsForm;
