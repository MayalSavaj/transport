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
    Tooltip,
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




    const [partyCharges, setPartyCharges] = useState([]);
    const [loading, setLoading] = useState(false);

    const [supplierCharges, setSupplierCharges] = useState([]);


    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!id) return;

        axios.get(`/order/${id}`) // Replace with your API URL
            .then((res) => {
                console.log("Fetched order:", res.data);
                setOrder(res.data.order);

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
    const [tempAdvance, setTempAdvance] = useState([]);
    const [tempCharges, setTempCharges] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);

    const [advanceType, setAdvanceType] = useState("party");
    const [chargeType, setChargeType] = useState("party");
    const [editAmountType, setEditAmountType] = useState("party");
    const [tempAmount, setTempAmount] = useState("");

    // const [advanceData, setAdvanceData] = useState({
    //     amount: "",
    //     date: new Date().toISOString().split("T")[0],
    //     notes: "",
    // });

    const [partyAdvances, setPartyAdvances] = useState([
        { date: "", advance_note: "", amount: "" }
    ]);
    const [supplierAdvances, setSupplierAdvances] = useState([
        { date: "", advance_note: "", amount: "" }
    ]);

    const [chargeData, setChargeData] = useState([]);
    const [advanceData, setAdvanceData] = useState([]);


    advanceData

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



    const statusMap = {
        started: "Started",
        in_transit: "In-transit",
        completed: "Completed",
    };


    const [partyAdvanceList, setPartyAdvanceList] = useState(
        order?.PartyPayments?.advance_details || []
    );
    const [supplierAdvanceList, setSupplierAdvanceList] = useState(
        order?.SupplierPayments?.advance_details || []
    );

    const [partyNewAdvance, setPartyNewAdvance] = useState({
        advance_payment_date: "",
        advance_note: "",
        advance_amount: ""
    });
    const [supplierNewAdvance, setSupplierNewAdvance] = useState({
        advance_payment_date: "",
        advance_note: "",
        advance_amount: ""
    });



    // API call to save

    const [tabIndex, setTabIndex] = useState(0); // 0 = Party, 1 = Supplier


    const isParty = tabIndex === 0;
    const currentList = tabIndex === 0 ? partyAdvances : supplierAdvances;
    const currentNewAdvance = isParty ? partyNewAdvance : supplierNewAdvance;
    const setCurrentNewAdvance = isParty
        ? setPartyNewAdvance
        : setSupplierNewAdvance;



    console.log("partyadvance is an ", partyAdvances);
    console.log("supplier advance  is an ", supplierAdvances);


    const handleAdvanceChange = (type, index, field, value) => {


        console.log(type, value);
        if (type === "party") {


            const updated = [...partyAdvances];
            updated[index][field] = value;
            setPartyAdvances(updated);


            console.log("party advance", currentNewAdvance);

        } else {
            const updated = [...supplierAdvances];
            updated[index][field] = value;
            setSupplierAdvances(updated);
        }
    };

    const currentType = tabIndex === 0 ? "party" : "supplier";


    console.log("order is an ", order);
    const handleConfirm = () => {


        console.log(order?.PartyPayments?.advance_details);
        const payload = {
            party: {
                advance_details: [
                    ...(order?.PartyPayments?.advance_details || []),
                    ...(partyAdvances ? partyAdvances : [])
                ]
            },
            supplier: {
                advance_details: [
                    ...(order?.SupplierPayments?.advance_details || []),
                    ...(supplierAdvances ? supplierAdvances : [])
                ]
            }
        };

        axios.post(`/order/additional-charges/${id}`, payload).then((response) => {

            setOpenAdvanceModal(false);
            console.log(response.data);
            setOrder((prevOrder) => ({
                ...prevOrder,
                PartyPayments: response.data.partyPayments
            }));

            setOrder((prevOrder) => ({
                ...prevOrder,
                SupplierPayments: response.data.supplierPayment
            }));

        });



        console.log("payload is an d", payload);
    };


    const handleCharge = () => {
        const entry = {
            additional_charge: parseFloat(chargeData.amount),
            additional_charge_note: chargeData.description
        };

        if (chargeType === "party") {
            setPartyCharges([...partyCharges, entry]);
        } else {
            setSupplierCharges([...supplierCharges, entry]);
        }

        var payload = {};
        if (chargeType === 'party') {
            payload = {
                party: {
                    additional_charges: [
                        ...(order?.PartyPayments?.additional_charges || []), // existing from API
                        ...partyCharges, // existing from local state
                        entry // the newly added one
                    ]
                }
            };
        }
        if (chargeType === 'supplier') {
            payload = {
                party: {
                    additional_charges: [
                        ...(order?.SupplierPayments?.additional_charges || []), // existing from API
                        ...supplierCharges, // existing from local state
                        entry // the newly added one
                    ]
                }
            };
        }


        // setOpenChargeModal(false);
        axios.post(`/order/additional-charges/${id}`, payload).then((response) => {

            setOpenAdvanceModal(false);
            console.log(response.data);
            setOrder((prevOrder) => ({
                ...prevOrder,
                PartyPayments: response.data.partyPayments
            }));

            setOrder((prevOrder) => ({
                ...prevOrder,
                SupplierPayments: response.data.supplierPayment
            }));

        });

        setChargeData({ amount: "", description: "" });
        setPartyAdvances = [
            { advance_date: "", advance_note: "", advance_amount: "" }
        ]
        setSupplierAdvances = [
            { advance_date: "", advance_note: "", advance_amount: "" }
        ]

    }


    console.log("tab index", tabIndex);

    console.log("party advances", partyAdvances);
    console.log("supplier advances", supplierAdvances);


    const handleCreateLr = (value) => {

        if (value == true) {


            const payload = {
                'lr_number': true
            }
            axios.post(`/updateOrder/${id}`, payload).then((response) => {
                console.log("******************");
                console.log(response.data);
                setOrder(response.data.order);


            });

            axios.post(`/order/create-lr-number/${id}`).then((response) => {

                setT3lrModalOpen(false);
                router.push(`/admin/bilty/${id}`);

            });
        } else {

            const payload = {
                'lr_number': false
            }
            axios.post(`/updateOrder/${id}`, payload).then((response) => {
                console.log("******************");
                console.log(response.data);
                setOrder(response.data.order);

                setT3lrModalOpen(false);

            });

        }

    }


    const handleEditAmount = () => {


        let payload = {};
        if (editAmountType == "Party") {
            payload = {
                'freight_charge': tempAmount
            }
        } else {
            payload = {
                'hiring_cost': tempAmount
            }
        }


        // setOpenChargeModal(false);
        axios.post(`/updateOrder/${id}`, payload).then((response) => {
            console.log("******************");
            console.log(response.data);
            setOrder(response.data.order);


        });


        console.log(payload);

        setOpenAmountEditModal(false);


    }


    const mappedLabel = statusMap[order?.status] || null;

    const activeStep = mappedLabel
        ? steps.findIndex(step => step.label === mappedLabel)
        : 0;

    const handleOrdeStatus = () => {

        let payload = {};

        if (activeStep == 0) {
            payload = {
                'status': "in_transit"
            }
        } else if (activeStep == 1) {
            payload = {
                'status': "completed"
            }
        }



        axios.post(`/updateOrder/${id}`, payload).then((response) => {
            console.log("******************");
            console.log(response.data);
            setOrder(response.data.order);

        });

    }
    const handleDownload = async () => {
        try {
            const response = await axios.get(`/download-invoice/${id}`, {
                responseType: "blob", // Important
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Download failed:", error);
        }
    };


    const handlePod = () => {
        if (!podFile) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("pod", podFile);

        axios
            .post(`/updateOrder/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Upload success:", response.data);
                setOrder(response.data.order);
                setOpenPodModal(false);
            })
            .catch((error) => {
                console.error("Upload failed:", error);
            });
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
                                    {/* === LEFT SIDE === */}
                                    <Grid item xs={12} md={8}>
                                        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                                            {/* Header */}
                                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <DirectionsCarIcon color="primary" />
                                                    <Typography variant="h6" fontWeight={700}>{order?.truck_number}</Typography>
                                                </Box>
                                                <Box px={2} py={0.5} bgcolor="warning.main" color="#fff" borderRadius={1} fontSize={12}>
                                                    MARKET
                                                </Box>
                                            </Box>

                                            {/* Party & LR Info */}
                                            <Card variant="outlined" sx={{ borderRadius: 2, p: 3, boxShadow: 2 }}>
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
                                                                        <Typography fontWeight={600}>{order?.party?.name}</Typography>
                                                                    </Box>
                                                                </Box>

                                                                {/* Supplier Name */}
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <BusinessIcon fontSize="small" color="primary" />
                                                                    <Box>
                                                                        <Typography variant="body2" color="text.secondary">Supplier Name</Typography>
                                                                        <Typography fontWeight={600}>{order?.supplier?.name}</Typography>
                                                                    </Box>
                                                                </Box>

                                                                {/* Pay By */}
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <PaymentsIcon fontSize="small" color="primary" />
                                                                    <Box>
                                                                        <Typography variant="body2" color="text.secondary">Pay By</Typography>
                                                                        <Typography fontWeight={600}>{order?.pay_by}</Typography>
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
                                                                {order?.LrNUmbers?.map((lr, index) => (
                                                                    <li key={index} style={{ marginBottom: 6 }}>
                                                                        <Typography variant="body2" fontWeight={500}>
                                                                            {lr?.lr_number}
                                                                        </Typography>
                                                                    </li>
                                                                ))}
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>

                                            {/* Route Info Card */}
                                            <Card sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "#f9f9f9" }}>
                                                <Typography variant="subtitle1" fontWeight={600} mb={3}>
                                                    Route Information
                                                </Typography>

                                                <Grid container spacing={12} alignItems="center" justifyContent="center">
                                                    {/* From City */}
                                                    <Grid item>
                                                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                                            <Typography fontSize={14} fontWeight={600} color="primary.main">
                                                                From City
                                                            </Typography>
                                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                                <LocationOnIcon color="info" />
                                                                <Box>
                                                                    <Typography variant="h6" fontWeight={700}>{order?.pickup_location}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Grid>

                                                    {/* Arrow with margin */}
                                                    <Grid item>
                                                        <ArrowForwardIcon sx={{ fontSize: 30, color: 'grey.600', mx: 5 }} />
                                                    </Grid>

                                                    {/* To City */}
                                                    <Grid item>
                                                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                                            {/* Title */}
                                                            <Typography fontSize={14} fontWeight={600} color="error.main">
                                                                To City
                                                            </Typography>

                                                            {/* Ahmedabad */}
                                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                                <LocationOnIcon color="error" />
                                                                <Box textAlign="center">
                                                                    <Typography variant="h6" fontWeight={700}>{order?.drop_location_1}</Typography>
                                                                </Box>
                                                            </Box>


                                                            {/* Surat */}
                                                            {order?.drop_location_2 &&
                                                                <Box display="flex" alignItems="center" gap={1.5}>
                                                                    <LocationOnIcon color="error" />
                                                                    <Box textAlign="center">
                                                                        <Typography variant="h6" fontWeight={700}>{order?.drop_location_2}</Typography>
                                                                    </Box>
                                                                </Box>
                                                            }
                                                            {order?.drop_location_3 &&
                                                                <Box display="flex" alignItems="center" gap={1.5}>
                                                                    <LocationOnIcon color="error" />
                                                                    <Box textAlign="center">
                                                                        <Typography variant="h6" fontWeight={700}>{order.drop_location_3}</Typography>
                                                                    </Box>
                                                                </Box>
                                                            }
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
                                                <Tooltip
                                                    title={
                                                        activeStep === 1 && !order?.lr_number
                                                            ? "Please select the LR option first"
                                                            : ""
                                                    }
                                                >
                                                    <span> {/* span wrapper is required for disabled buttons */}
                                                        <Button
                                                            variant="outlined"
                                                            color="success"
                                                            sx={{ borderRadius: 2, px: 3 }}
                                                            startIcon={<LocalShippingIcon />}
                                                            onClick={() => handleOrdeStatus()}
                                                            disabled={activeStep === 1 && !order?.lr_number} // disable if condition not met
                                                        >
                                                            {activeStep === 0 ? "IN Transit" : "Complete Trip"}
                                                        </Button>
                                                    </span>
                                                </Tooltip>


                                                <Tooltip title={activeStep !== 2 ? "Please complete order first" : ""}>
                                                    <span> {/* span wrapper is needed because disabled Button blocks pointer events */}
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{ borderRadius: 2, px: 4 }}
                                                            startIcon={<ReceiptLongIcon />}
                                                            disabled={activeStep !== 2}
                                                            onClick={() => handleDownload()}
                                                        >
                                                            View Receipt
                                                        </Button>
                                                    </span>
                                                </Tooltip>

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
                                                    <Typography>{order?.party?.name}</Typography>
                                                    <Typography fontWeight={600} color="primary.main">₹ {order?.freight_charge}</Typography>
                                                </Box>
                                            </Box>

                                            <Box mb={2}>
                                                <Typography variant="body2" color="text.secondary" mb={0.5}>(-) Expense</Typography>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography>Truck Hire Cost</Typography>
                                                    <Typography fontWeight={600} color="error.main">₹ {order?.hiring_cost}</Typography>
                                                </Box>
                                            </Box>

                                            <Box mt={3} pt={2} borderTop="1px dashed #ccc">
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" color="text.secondary">Total Profit</Typography>
                                                    <Typography fontWeight={700} color="success.main" fontSize={24}>
                                                        ₹ {(Number(order?.freight_charge) - Number(order?.hiring_cost)).toFixed(2)}
                                                    </Typography>
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

                                                {order?.pod ? (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        color="success"
                                                        sx={{ borderRadius: 2 }}
                                                        onClick={() => window.open(`https://biltozbackend.growmoon.top/storage/${order.pod}`, "_blank")}
                                                    >
                                                        View POD
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color="primary"
                                                        sx={{ borderRadius: 2 }}
                                                        onClick={() => setOpenPodModal(true)}
                                                    >
                                                        Add POD
                                                    </Button>
                                                )}
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

                                        onClick={() => handlePod()}
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
                                            onClick={() => handleCreateLr(true)}
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleCreateLr(false)}
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
                                                        <Typography color="primary" fontWeight={600}>₹ {order?.freight_charge || 0}</Typography>
                                                        <Button size="small" onClick={() => handleOpenAmountEdit("Party", values.Party)}>✏️</Button>
                                                    </Box>
                                                </Box>

                                                <Box pl={2} mb={2}>
                                                    <Typography variant="body2">(-) Advance</Typography>
                                                    {order?.PartyPayments?.advance_details?.map((oneOrder, index) => (
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

                                                <Box pl={2} mb={2}>
                                                    <Typography variant="body2">(+) Charge </Typography>
                                                    {order?.PartyPayments?.additional_charges?.map((oneOrder, index) => (
                                                        <Box key={index} mt={2} p={1} border="1px solid #ccc" borderRadius={1}>
                                                            <Box display="flex" justifyContent="space-between">
                                                                <Typography fontWeight={700}>Advance Party Balance</Typography>
                                                                <Typography color="primary" fontWeight={700}>
                                                                    ₹{parseFloat(oneOrder.additional_charge || 0).toFixed(2)}
                                                                </Typography>
                                                            </Box>

                                                            <Typography variant="body2" color="text.secondary">
                                                                Note: {oneOrder.additional_charge_note}
                                                            </Typography>
                                                        </Box>
                                                    ))}

                                                    {/* Add Advance button at last */}
                                                    <Button size="small" color="primary" onClick={() => {
                                                        setChargeType("party"); setOpenChargeModal(true);
                                                    }}>Add party Charge</Button>
                                                </Box>

                                                <Box display="flex" justifyContent="space-between" mt={2}>
                                                    <Typography fontWeight={700}>Pending Party Balance</Typography>
                                                    <Typography color="primary" fontWeight={700}>
                                                        ₹ {
                                                            (

                                                                (Number(order?.freight_charge) || 0)

                                                                + (order?.PartyPayments?.additional_charges?.reduce((sum, item) => {
                                                                    return sum + (Number(item.additional_charge) || 0);
                                                                }, 0) || 0)

                                                                // Step 1: Sum all advance_amount values
                                                                - (order?.PartyPayments?.advance_details?.reduce((sum, item) => {
                                                                    return sum + (Number(item.advance_amount) || 0);
                                                                }, 0) || 0)



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
                                                        <Typography color="primary" fontWeight={600}>₹ {order?.hiring_cost || 0}</Typography>
                                                        <Button size="small" onClick={() => handleOpenAmountEdit("Supplier", values.Supplier)}>✏️</Button>
                                                    </Box>
                                                </Box>



                                                <Box pl={2} mb={2}>
                                                    <Typography variant="body2">(-) Advance</Typography>

                                                    {order?.SupplierPayments?.advance_details?.map((oneOrder, index) => (
                                                        <Box key={index} mt={2} p={1} border="1px solid #ccc" borderRadius={1}>
                                                            <Box display="flex" justifyContent="space-between">
                                                                <Typography fontWeight={700}>Advance Supplier Balance</Typography>
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

                                                    <Button
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => {
                                                            setAdvanceType("supplier");
                                                            setOpenAdvanceModal(true);
                                                        }}
                                                        sx={{ mt: 2 }}
                                                    >
                                                        Add Advance
                                                    </Button>


                                                </Box>


                                                <Box pl={2} mb={2}>
                                                    <Typography variant="body2">(-) Advance</Typography>

                                                    {order?.SupplierPayments?.additional_charges?.map((oneOrder, index) => (
                                                        <Box key={index} mt={2} p={1} border="1px solid #ccc" borderRadius={1}>
                                                            <Box display="flex" justifyContent="space-between">
                                                                <Typography fontWeight={700}>Advance Supplier Balance</Typography>
                                                                <Typography color="primary" fontWeight={700}>
                                                                    ₹{parseFloat(oneOrder.additional_charge || 0).toFixed(2)}
                                                                </Typography>
                                                            </Box>

                                                            <Typography variant="body2" color="text.secondary">
                                                                Note: {oneOrder.additional_charge_note}
                                                            </Typography>
                                                        </Box>
                                                    ))}



                                                    <Button size="small" color="primary" onClick={() => {
                                                        setChargeType("party"); setOpenChargeModal(true);
                                                    }}>Add Supplier Charge</Button>
                                                </Box>

                                                <Box display="flex" justifyContent="space-between" mt={2}>
                                                    <Typography fontWeight={700}>Pending Party Balance</Typography>
                                                    <Typography color="primary" fontWeight={700}>
                                                        ₹ {
                                                            (

                                                                (Number(order?.hiring_cost) || 0)

                                                                + (order?.SupplierPayments?.additional_charges?.reduce((sum, item) => {
                                                                    return sum + (Number(item.additional_charge) || 0);
                                                                }, 0) || 0)

                                                                // Step 1: Sum all advance_amount values
                                                                - (order?.SupplierPayments?.advance_details?.reduce((sum, item) => {
                                                                    return sum + (Number(item.advance_amount) || 0);
                                                                }, 0) || 0)



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
                                                    <Typography fontWeight={600} color="primary.main">{order?.party?.name}</Typography>
                                                    <Typography fontWeight={600} color="primary.main">₹  {
                                                        (

                                                            (Number(order?.freight_charge) || 0)

                                                            + (order?.PartyPayments?.additional_charges?.reduce((sum, item) => {
                                                                return sum + (Number(item.additional_charge) || 0);
                                                            }, 0) || 0)

                                                            // Step 1: Sum all advance_amount values
                                                            - (order?.PartyPayments?.advance_details?.reduce((sum, item) => {
                                                                return sum + (Number(item.advance_amount) || 0);
                                                            }, 0) || 0)



                                                        ).toFixed(2)
                                                    }
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Expense */}
                                            <Box mb={2}>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography>Supplier Balance</Typography>
                                                    <Typography fontWeight={600} color="primary.main">{order?.supplier?.name}</Typography>
                                                    <Typography fontWeight={600} color="error.main">₹  {
                                                        (

                                                            (Number(order?.hiring_cost) || 0)

                                                            + (order?.SupplierPayments?.additional_charges?.reduce((sum, item) => {
                                                                return sum + (Number(item.additional_charge) || 0);
                                                            }, 0) || 0)

                                                            // Step 1: Sum all advance_amount values
                                                            - (order?.SupplierPayments?.advance_details?.reduce((sum, item) => {
                                                                return sum + (Number(item.advance_amount) || 0);
                                                            }, 0) || 0)



                                                        ).toFixed(2)
                                                    }</Typography>
                                                </Box>
                                            </Box>

                                            {/* Total Profit */}
                                            <Box mt={3} pt={2} borderTop="1px dashed #ccc">
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" color="text.secondary">Profit</Typography>
                                                    <Typography fontWeight={700} color="success.main" fontSize={24}>₹ {order?.freight_charge - order?.hiring_cost}</Typography>
                                                </Box>
                                            </Box>
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
                                <Button variant="contained" onClick={() => handleEditAmount()}>Save</Button>
                            </DialogActions>
                        </Dialog>

                        {/* Advance Modal */}
                        <Dialog open={openAdvanceModal} onClose={() => setOpenAdvanceModal(false)} fullWidth maxWidth="sm">
                            <DialogTitle>
                                {isParty ? "Party Advances" : "Supplier Advances"}
                            </DialogTitle>

                            <DialogContent>
                                {/* Tabs for Party / Supplier */}
                                <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
                                    <Tab label="Party" />
                                    <Tab label="Supplier" />
                                </Tabs>


                                {currentList.map((adv, idx) => (
                                    <div key={idx} style={{ marginTop: 12 }}>

                                        {/* Form Fields */}
                                        <TextField
                                            fullWidth
                                            label="Date"
                                            type="date"
                                            value={isParty ? partyAdvances[idx]?.advance_date || "" : supplierAdvances[idx]?.advance_date}
                                            onChange={(e) =>
                                                handleAdvanceChange(currentType, idx, "advance_date", e.target.value)
                                            }
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ mt: 2 }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Note"
                                            value={isParty ? partyAdvances[idx]?.advance_note || "" : supplierAdvances[idx]?.advance_note || ""}
                                            onChange={(e) =>
                                                handleAdvanceChange(currentType, idx, "advance_note", e.target.value)
                                            }
                                            sx={{ mt: 2 }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Amount"
                                            type="number"
                                            value={isParty ? partyAdvances[idx]?.advance_amount || "" : supplierAdvances[idx]?.advance_amount || "q"}
                                            onChange={(e) =>
                                                handleAdvanceChange(currentType, idx, "advance_amount", e.target.value)
                                            }
                                            sx={{ mt: 2 }}
                                        />
                                    </div>
                                ))}

                            </DialogContent>

                            <DialogActions>
                                <Button onClick={() => setOpenAdvanceModal(false)}>Close</Button>
                                <Button
                                    variant="contained"
                                    onClick={() => handleConfirm(isParty ? "party" : "supplier")}
                                >
                                    Confirm {isParty ? "Party" : "Supplier"} Advances
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
                                <Button variant="contained" onClick={() => handleCharge()}>
                                    Confirm
                                </Button>

                            </DialogActions>
                        </Dialog>
                    </form>
                )}
            </Formik>
        </Card>
    );
};

export default OrderdetailsForm;
