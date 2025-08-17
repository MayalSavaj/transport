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
  Stack,
  CardHeader,
  CardContent,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import PaymentsIcon from "@mui/icons-material/Payments";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "utils/axios"; // import the custom axios


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

const OrderdetailsForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios.get(`/api/order/${id}`) // Replace with your API URL
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch order:", err);
        setLoading(false);
      });
  }, [id]);


  console.log("Order details:", order);

  // Modals
  const [openAdvanceModal, setOpenAdvanceModal] = useState(false);
  const [openChargeModal, setOpenChargeModal] = useState(false);
  const [openAmountEditModal, setOpenAmountEditModal] = useState(false);
  const [t3lrModalOpen, setT3lrModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

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

  const steps = [
    { label: "Started", icon: <PlayCircleFilledWhiteIcon /> },
    { label: "In-transit", icon: <DirectionsCarIcon /> },
    { label: "Completed", icon: <CheckCircleIcon /> },
  ];

  const activeStep = 2;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


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
            <Card sx={{ backgroundColor: "#fff" }}>


              {activeTab === 0 && (
                <Grid container spacing={3}>
                  {/* === LEFT SIDE === */}
                  <Grid item xs={12} md={8}>
                    <Card>
                      {/* Header */}
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <DirectionsCarIcon color="primary" />
                          <Typography variant="h6" fontWeight={700}>GJ 05 BB 1111</Typography>
                        </Box>
                        <Box px={2} py={0.5} bgcolor="warning.main" color="#fff" borderRadius={1} fontSize={12}>
                          MARKET
                        </Box>
                      </Box>

                      {/* Party & LR Info */}
                      <Card>
                        <CardContent>
                          <Divider sx={{ mb: 3 }} />

                          <Grid container spacing={4}>
                            {/* Left Column: Party, Supplier, Pay By */}
                            <Grid item xs={12} sm={6}>
                              <Stack spacing={3}>
                                {/* Party Name */}
                                <Box display="flex" alignItems="center" gap={1}>
                                  <PersonIcon fontSize="small" color="primary" />
                                  <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight={800}>Party Name</Typography>
                                    <Typography fontWeight={600}>Nirav</Typography>
                                  </Box>
                                </Box>

                                {/* Supplier Name */}
                                <Box display="flex" alignItems="center" gap={1}>
                                  <BusinessIcon fontSize="small" color="primary" />
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">Supplier Name</Typography>
                                    <Typography fontWeight={600}>Rajesh</Typography>
                                  </Box>
                                </Box>

                                {/* Pay By */}
                                <Box display="flex" alignItems="center" gap={1}>
                                  <PaymentsIcon fontSize="small" color="primary" />
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">Pay By</Typography>
                                    <Typography fontWeight={600}>Billed</Typography>
                                  </Box>
                                </Box>
                              </Stack>
                            </Grid>

                            {/* Right Column: LR Numbers */}
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="h6"
                                fontWeight={600}
                                gutterBottom
                                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                              >
                                <DescriptionIcon color="primary" />
                                LR Numbers
                              </Typography>

                              <Box component="ol" sx={{ pl: 3, m: 0 }}>
                                {['LRN-101', 'LRN-102', 'LRN-103'].map((lr, index) => (
                                  <li key={index} style={{ marginBottom: 6 }}>
                                    <Typography variant="body2" fontWeight={500}>
                                      {lr}
                                    </Typography>
                                  </li>
                                ))}
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>

                      {/* Route Info Card */}
                      <Card
                        sx={{
                          mt: 3,
                          p: { xs: 2, sm: 3 },
                          borderRadius: 2,
                          bgcolor: "#f9f9f9",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600} mb={3}>
                          Route Information
                        </Typography>

                        <Grid container spacing={2} alignItems="flex-start">
                          {/* From City */}
                          <Grid item xs={12} md={4}>
                            <Typography fontSize={14} fontWeight={600} color="primary.main" mb={1}>
                              From City
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              <LocationOnIcon color="primary" />
                              <Typography variant="h6" fontWeight={700}>Mumbai</Typography>
                            </Box>
                          </Grid>

                          {/* Arrow */}
                          <Grid item xs={12} md={1} display="flex" justifyContent="center" alignItems="center">
                            <ArrowForwardIcon
                              color="action"
                              sx={{
                                transform: { xs: "rotate(90deg)", md: "rotate(0deg)" },
                                mt: { xs: 1, md: 3 },
                              }}
                            />
                          </Grid>

                          {/* To City */}
                          <Grid item xs={12} md={7}>
                            <Typography fontSize={14} fontWeight={600} color="error.main" mb={1}>
                              To City
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <LocationOnIcon color="error" />
                              <Typography variant="h6" fontWeight={700}>Ahmedabad</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <LocationOnIcon color="error" />
                              <Typography variant="h6" fontWeight={700}>Surat</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>

                      {/* Trip Status Progress */}
                      <Box mt={5} px={2}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" position="relative">
                          {steps.map((step, index) => {
                            const isCompleted = index < activeStep;
                            const isActive = index === activeStep;

                            return (
                              <Box key={index} textAlign="center" flex={1} zIndex={2}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    mx: "auto",
                                    mb: 1,
                                    borderRadius: "50%",
                                    backgroundColor: isCompleted || isActive
                                      ? "success.main"
                                      : "grey.300",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 20,
                                  }}
                                >
                                  {step.icon}
                                </Box>
                                <Typography
                                  fontSize={13}
                                  fontWeight={isActive ? 600 : 400}
                                  color={isCompleted || isActive ? "success.main" : "text.secondary"}
                                >
                                  {step.label}
                                </Typography>
                              </Box>
                            );
                          })}

                          {/* Connecting track line */}
                          <Box
                            position="absolute"
                            top={20}
                            left={0}
                            right={0}
                            height={4}
                            bgcolor="grey.300"
                            zIndex={1}
                          >
                            <Box
                              width={`${(activeStep / (steps.length - 1)) * 100}%`}
                              height="100%"
                              bgcolor="success.main"
                              transition="width 0.3s ease-in-out"
                            />
                          </Box>
                        </Box>
                      </Box>
                      {/* Action Buttons */}
                      <Box mt={4} display="flex" gap={2} flexWrap="wrap">
                        <Button
                          variant="outlined"
                          color="success"
                          sx={{ borderRadius: 2, px: 3 }}
                          startIcon={<LocalShippingIcon />}
                        >
                          Complete Trip
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ borderRadius: 2, px: 4 }}
                          startIcon={<ReceiptLongIcon />}
                        >
                          View Bill
                        </Button>
                      </Box>
                    </Card>
                  </Grid>


                  {/* === RIGHT SIDE === */}
                  <Grid item xs={12} md={4}>
                    {/* Profit Card */}
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                      <Typography variant="h6" fontWeight={700} mb={3}>Profit Summary</Typography>

                      <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>(+) Revenue</Typography>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Nirav</Typography>
                          <Typography fontWeight={600} color="primary.main">₹ 500</Typography>
                        </Box>
                      </Box>

                      <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>(-) Expense</Typography>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Truck Hire Cost</Typography>
                          <Typography fontWeight={600} color="error.main">₹ 200</Typography>
                        </Box>
                      </Box>

                      <Box mt={3} pt={2} borderTop="1px dashed #ccc">
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Total Profit</Typography>
                          <Typography fontWeight={700} color="success.main" fontSize={24}>₹ 300</Typography>
                        </Box>
                      </Box>
                    </Card>

                    {/* LR & POD Card */}
                    <Card sx={{ mt: 3, p: 3, borderRadius: 3, boxShadow: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} mb={2}>Actions for Nirav</Typography>

                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body2">Online Bilty/LR</Typography>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          sx={{ borderRadius: 2 }}
                          onClick={() => setT3lrModalOpen(true)}
                        >
                          Create LR
                        </Button>
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
                    Do you want Create LR Number
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
                <Grid container spacing={3}>
                  {/* Left Side - Party/Supplier Amount */}
                  <Grid item xs={12} md={8}>

                    {/* Party Amount Card */}
                    <Card variant="outlined" sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
                      <CardHeader title="Party Amount" titleTypographyProps={{ variant: "h6", fontWeight: 800 }} />
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle1">Party Amount</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography color="primary" fontWeight={600}>₹ {values.Party || 0}</Typography>
                            <Button size="small" onClick={() => handleOpenAmountEdit("Party", values.Party)}>✏️</Button>
                          </Box>
                        </Box>



                        <Box pl={2} mb={2}>
                          <Typography variant="body2">(-) Advance</Typography>
                          {order?.advance_details?.map((oneOrder, index) => (
                            <Box key={index} mt={2} p={1} border="1px solid #ccc" borderRadius={1}>
                              <Box display="flex" justifyContent="space-between">
                                <Typography fontWeight={700}>Advance Party Balance</Typography>
                                <Typography color="primary" fontWeight={700}>
                                  ₹{parseFloat(oneOrder.advance_amount || 0).toFixed(2)}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Date: {oneOrder.advance_payment_date}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Note: {oneOrder.advance_note}
                              </Typography>
                            </Box>
                          ))}

                          {/* Add Advance button at last */}
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => {
                              setAdvanceType("party");
                              setOpenAdvanceModal(true);
                            }}
                            sx={{ mt: 2 }}
                          >
                            Add Advance
                          </Button>
                        </Box>




                        <Box display="flex" justifyContent="space-between" mt={2}>
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
                      </CardContent>
                    </Card>

                    {/* Supplier Amount Card */}
                    {/* <Card variant="outlined"> */}
                    <Card variant="outlined" sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>

                      <CardHeader title="Supplier Amount" titleTypographyProps={{ variant: "h6", fontWeight: 800 }} />
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle1">Supplier Amount</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography color="primary" fontWeight={600}>₹ {values.Supplier || 0}</Typography>
                            <Button size="small" onClick={() => handleOpenAmountEdit("Supplier", values.Supplier)}>✏️</Button>
                          </Box>
                        </Box>

                        <Box pl={2} mb={2}>
                          <Typography variant="body2">(-) Advance</Typography>
                          <Box display="flex" justifyContent="space-between" mt={2}>
                            <Typography fontWeight={700}>Advance Supplier Balance</Typography>
                            <Typography color="primary" fontWeight={700}>
                              ₹500
                            </Typography>
                          </Box>
                          <Button size="small" color="primary" onClick={() => {
                            setAdvanceType("supplier"); setOpenAdvanceModal(true);
                          }}>Add Supplier Advance</Button>

                          <Typography variant="body2" mt={2}>(+) Charges</Typography>
                          <Box display="flex" justifyContent="space-between" mt={2}>
                            <Typography fontWeight={700}>Advance Supplier Balance</Typography>
                            <Typography color="primary" fontWeight={700}>
                              ₹500
                            </Typography>
                          </Box>
                          <Button size="small" color="primary" onClick={() => {
                            setChargeType("supplier"); setOpenChargeModal(true);
                          }}>Add Supplier Charge</Button>
                        </Box>

                        <Box display="flex" justifyContent="space-between" mt={2}>
                          <Typography fontWeight={700}>Pending Supplier Balance</Typography>
                          <Typography color="primary" fontWeight={700}>
                            ₹ {
                              (
                                parseFloat(values.Supplier || 0) -
                                (advanceType === "supplier" ? parseFloat(advanceData.amount || 0) : 0) +
                                (chargeType === "supplier" ? parseFloat(chargeData.amount || 0) : 0)
                              ).toFixed(2)
                            }
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>

                  </Grid>


                  {/* Right Side - Profit Card */}
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                      <Typography variant="h6" fontWeight={700} mb={3}>Balance</Typography>

                      {/* Revenue */}
                      <Box mb={2}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Party Balance</Typography>
                          <Typography fontWeight={600} color="primary.main">Nirav</Typography>
                          <Typography fontWeight={600} color="primary.main">₹ 500</Typography>
                        </Box>
                      </Box>

                      {/* Expense */}
                      <Box mb={2}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography>Supplier Balance</Typography>
                          <Typography fontWeight={600} color="primary.main">Rajesh</Typography>
                          <Typography fontWeight={600} color="error.main">₹ 200</Typography>
                        </Box>
                      </Box>

                      {/* Total Profit */}
                      {/* <Box mt={3} pt={2} borderTop="1px dashed #ccc">
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Profit</Typography>
            <Typography fontWeight={700} color="success.main" fontSize={24}>₹ 300</Typography>
          </Box>
        </Box> */}
                    </Card>
                  </Grid>
                </Grid>
              )}
              {/* <Box textAlign="right" mt={4}>
                <Button variant="contained" type="submit">
                  {activeTab === 0 ? "Save & Continue" : "Submit"}
                </Button>
              </Box> */}
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
