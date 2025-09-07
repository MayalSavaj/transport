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
  MenuItem,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "utils/axios"; // import the custom axios
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";


// Initial values and validation schema

const validationSchema = yup.object().shape({
  // biltyNumber: yup.string().required("LR Number is required"),
  // city: yup.string().required("City is required"),
});

const BiltyManager = () => {
  const router = useRouter();
  const { id } = router.query;

  const { enqueueSnackbar } = useSnackbar();


  const [biltyList, setBiltyList] = useState([]);
  const [lrNumber, setLrNumber] = useState();


  const [consignerData, setConsignerData] = useState({});
  const [consigneeData, setConsigneeData] = useState({});
  const [materialData, setMaterialData] = useState({});

  useEffect(() => {
    if (!router.isReady) return; // ✅ only run when query is ready

    const fetchOrderLr = async () => {
      try {
        const res = await axios.get(`/showBilty/${id}`);
        if (res.data) {
          setBiltyList(res.data.data);
          console.log("Party Payments Data:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch bilty", err);
      }
    };

    fetchOrderLr();
  }, [router.isReady, id]);


  console.log("Bityt list ", biltyList);
  const [modalOpen, setModalOpen] = useState(false);
  const [partyType, setPartyType] = useState(null); // null | "consignee" | "consigner"
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenForm = (value) => {
    setLrNumber(value)
    setModalOpen(true);
    setActiveTab(0);                // Always start from first tab
    setTabAccess([true, false, false]);
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

      console.error("Download error:", error);
      if (error.response?.status === 422 && error.response?.data?.error) {
        const errors = error.response.data.error;
        // show all validation messages
        Object.values(errors).flat().forEach((msg) => {
          enqueueSnackbar(msg, { variant: "error" });
        });
      }
      // else if server error (500 or other)
      else if (error.response?.data?.error) {
        enqueueSnackbar(error.response.data.error, { variant: "error" });
      }
      // fallback




      else {
        enqueueSnackbar("Incomplete data to generate bilty. Please ensure consignee,consigner and material details are filled.", { variant: "error" });
      }
    }
  };


  const handleForm = (lrId) => {
    try {
      const biltyData = axios.get(`/getBuiltyDetails/${lrId}`).then((res) => {
        if (res.data) {

          setConsignerData(res.data.consigner);
          setConsigneeData(res.data.consignee);
          setMaterialData(res.data.material_details);
          handleOpenForm(lrId);
        } else {
          console.error("No data found for the given LR ID");
        }
      });

    } catch (err) {
    }
  }



  const [tabAccess, setTabAccess] = useState([true, false, false]);

  const [states, setStates] = useState([]);

  const isTabValid = (tabIndex, values) => {

    console.log("Validating Tab:", tabIndex, values);
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

  // fetch states
  useEffect(() => {
    axios
      .get("/cities")
      .then((response) => {
        const cityList = response?.data?.city || [];
        const uniqueStates = [...new Set(cityList.map((item) => item.city_state))];
        setStates(uniqueStates);
      })
      .catch((err) => {
        console.error("Failed to fetch states:", err);
      });
  }, []);


  const handleStateChange = (selectedState, setFieldValue) => {
    setFieldValue("consigner_state", selectedState);
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
                  onClick={() => handleForm(bilty?.id)}
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
                consignee_mobile: consigneeData?.mobile_number,
                consignee_name: consigneeData?.name,
                consignee_gstNumber: consigneeData?.gst_number,
                consignee_address1: consigneeData?.address,
                consignee_address2: consigneeData?.gst_number,
                consignee_state: consigneeData?.state,
                consignee_pincode: consigneeData?.pincode,


                consigner_mobile: consignerData?.mobile_number,
                consigner_name: consignerData?.name,
                consigner_gstNumber: consignerData?.gst_number,
                consigner_address1: consignerData?.address,
                consigner_address2: "",
                consigner_state: consignerData?.state,
                consigner_pincode: consignerData?.pincode,


                materialDetail: materialData?.details ?? "",
                totalWeight: materialData?.total_weight ?? "",
                ewayBillNo: materialData?.e_bill_no ?? "",
                invoiceNo: materialData?.invoice_number ?? "",
                materialAmount: materialData?.amount ?? "",
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
                setFieldValue,
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
                            select
                            label="State"
                            name="consigner_state"
                            value={values.consigner_state || ""}
                            onChange={(e) => handleStateChange(e.target.value, setFieldValue)}
                            onBlur={handleBlur}
                            error={touched.consigner_state && Boolean(errors.consigner_state)}
                            helperText={touched.consigner_state && errors.consigner_state}
                          >
                            {states.map((state, index) => (
                              <MenuItem key={index} value={state}>
                                {state}
                              </MenuItem>
                            ))}
                          </TextField>
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
                            select
                            label="State"
                            name="consignee_state"
                            value={values.consignee_state || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.consignee_state && Boolean(errors.consignee_state)}
                            helperText={touched.consignee_state && errors.consignee_state}
                          >
                            {states.map((state, index) => (
                              <MenuItem key={index} value={state}>
                                {state}
                              </MenuItem>
                            ))}
                          </TextField>
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
                          type="button"
                          fullWidth
                          variant="contained"
                          onClick={(e) => {
                            e.preventDefault();  // <-- stops form submission
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
      </Dialog >
    </>
  );
};

export default BiltyManager;
