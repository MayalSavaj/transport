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
  Box,
  Autocomplete,
} from "@mui/material";

import { Formik } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  hiringCost: ""
};

const validationSchema = Yup.object().shape({
  partyName: Yup.string().required("Required"),
  truckType: Yup.string().required("Required"),
  truckNo: Yup.string().required("Required"),
  payBy: Yup.string().required("Required"),
  settleSupplier: Yup.string().required("Required"),
  freight: Yup.number().required("Required"),
  hiringCost: Yup.number().required("Required")
});


const OrdersForm = () => {
  const [formData, setFormData] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);



  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await axios.get("/parties"); // adjust base URL if needed
        const options = res.data.map((party) => ({
          label: party.name,
          value: party.id,
        }));
        setPartyOptions(options);
      } catch (error) {
        console.error("Error fetching parties:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("/supplier");
        const options = res.data.map((supplier) => ({
          label: supplier.name,
          value: supplier.id,
        }));
        setSupplierOptions(options);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchParties();
    fetchSuppliers();
  }, []);
  const router = useRouter();

  const dropPointOptions = [
    { label: "Ahmedabad", value: "Ahmedabad" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Delhi", value: "Delhi" },
    { label: "Bengaluru", value: "Bengaluru" },
    { label: "Chennai", value: "Chennai" },
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Pune", value: "Pune" },
    { label: "Jaipur", value: "Jaipur" },
    { label: "Kolkata", value: "Kolkata" },
    { label: "Surat", value: "Surat" },
  ];

  const pickupOptions = [
    { label: "Ahmedabad", value: "Ahmedabad" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Delhi", value: "Delhi" },
    { label: "Bengaluru", value: "Bengaluru" },
    { label: "Chennai", value: "Chennai" },
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Pune", value: "Pune" },
    { label: "Jaipur", value: "Jaipur" },
    { label: "Kolkata", value: "Kolkata" },
    { label: "Surat", value: "Surat" },
  ];

  return (
    <Card sx={{ p: 3 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          setFormData(values);
          const payload = {
            party_id: values.partyName,
            truck_type: values.truckType,
            truck_number: values.truckNo,
            pay_by: values.payBy,
            pickup_location: values.pickup,
            drop_location_1: values.dropPoints[0], // map first drop point
            supplier_id: values.settleSupplier,
            freight_charge: Number(values.freight),
            hiring_cost: Number(values.hiringCost),
          };

          try {
            const res = await axios.post("/order", payload);
            console.log("Order created:", res.data);    
            router.push(`/admin/orderdetails/create/${res.data.data.id}`);
          } catch (error) {
            console.error("Order creation failed:", error);
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
            <Grid
            >

              {/* Order Information */}
              <Typography variant="subtitle1" fontWeight={800} mb={2}>
                Order Information
              </Typography>
              <Grid container spacing={3} mb={4}>
                <Grid item sm={6} xs={12}>
                  <Autocomplete
                    fullWidth
                    size="medium"
                    options={partyOptions}
                    getOptionLabel={(option) => option.label}
                    value={partyOptions.find((opt) => opt.value === values.partyName) || null}
                    onChange={(e, newValue) =>
                      setFieldValue("partyName", newValue ? newValue.value : "")
                    }
                    onBlur={handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="medium"
                        label="Party Name"
                        name="partyName"
                        error={!!touched.partyName && !!errors.partyName}
                        helperText={touched.partyName && errors.partyName}
                      />
                    )}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Truck Type"
                    name="truckType"
                    size="medium"
                    value={values.truckType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.truckType && !!errors.truckType}
                    helperText={touched.truckType && errors.truckType}
                  />
                </Grid>


                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Truck Number"
                    name="truckNo"
                    size="medium"
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
              <Typography variant="subtitle1" fontWeight={800} mb={2}>
                Pickup & Drop Points
              </Typography>

              <Grid container spacing={3} mb={4}>
                {/* Left Side - Pickup Location */}
                <Grid item sm={6} xs={12}>
                  <Autocomplete
                    fullWidth
                    size="medium"
                    options={pickupOptions}
                    getOptionLabel={(option) => option.label}
                    value={pickupOptions.find((opt) => opt.value === values.pickup) || null}
                    onChange={(e, newValue) =>
                      setFieldValue("pickup", newValue ? newValue.value : "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="medium"
                        label="Pickup Location"
                        name="pickup"
                      />
                    )}
                  />
                </Grid>

                {/* Right Side - Drop Points + Add Button */}
                <Grid item sm={6} xs={12}>
                  <Grid container spacing={2}>
                    {values.dropPoints.map((drop, index) => (
                      <Grid item xs={12} key={index}>
                        <Autocomplete
                          fullWidth
                          size="medium"
                          options={dropPointOptions}
                          getOptionLabel={(option) => option.label}
                          value={
                            dropPointOptions.find((opt) => opt.value === drop) || null
                          }
                          onChange={(event, newValue) => {
                            const updatedPoints = [...values.dropPoints];
                            updatedPoints[index] = newValue ? newValue.value : "";
                            setFieldValue("dropPoints", updatedPoints);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="medium"
                              label={`Drop Point ${index + 1}`}
                              name={`dropPoints[${index}]`}
                            />
                          )}
                        />
                      </Grid>
                    ))}

                    {values.dropPoints.length < 3 && (
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            setFieldValue("dropPoints", [...values.dropPoints, ""])
                          }
                        >
                          + Add Drop Point
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>


              {/* Additional Info */}
              <Typography variant="subtitle1" fontWeight={800} mb={2}>
                Additional Details
              </Typography>
              <Grid container spacing={3} mb={4}>
                <Grid item sm={6} xs={12}>
                  <RadioGroup
                    row
                    name="market"
                    value={values.market}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Market" />
                    <FormControlLabel value="no" control={<Radio />} label="Own" disabled />
                  </RadioGroup>
                </Grid>
              </Grid>

              {/* Charges */}
              <Typography variant="subtitle1" fontWeight={800} mb={2}>
                Charges & Supplier
              </Typography>
              <Grid container spacing={3} mb={4}>

                <Grid item sm={6} xs={12}>
                  <Autocomplete
                    fullWidth
                    size="medium"
                    options={supplierOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                      supplierOptions.find(
                        (opt) => opt.value === values.settleSupplier
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setFieldValue("settleSupplier", newValue ? newValue.value : "")
                    }
                    onBlur={handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="medium"
                        label="Select Supplier"
                        name="settleSupplier"
                        error={!!touched.settleSupplier && !!errors.settleSupplier}
                        helperText={touched.settleSupplier && errors.settleSupplier}
                      />
                    )}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Freight Charges (₹)"
                    name="freight"
                    size="medium"
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
                    size="medium"
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
            </Grid>
          </form>
        )}
      </Formik>

    </Card>
  );
};

export default OrdersForm;
