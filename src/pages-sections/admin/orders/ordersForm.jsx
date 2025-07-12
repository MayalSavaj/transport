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
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();

  return (
    <Card sx={{ p: 3 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setFormData(values);
          router.push("/admin/orderdetails/create");
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

              {/* Order Information */}
              <Typography variant="subtitle1" fontWeight={800} mb={2}>
                Order Information
              </Typography>
              <Grid container spacing={3} mb={4}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Party Name"
                    name="partyName"
                    size="medium"
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
                  <TextField
                    fullWidth
                    label="Pickup Location"
                    name="pickup"
                    size="medium"
                    value={values.pickup}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Right Side - Drop Points + Add Button */}
                <Grid item sm={6} xs={12}>
                  <Grid container spacing={2}>
                    {values.dropPoints.map((drop, index) => (
                      <Grid item xs={12} key={index}>
                        <TextField
                          fullWidth
                          size="medium"
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
                          size="small"
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
                  <TextField
                    fullWidth
                    label="Settle Supplier"
                    name="settleSupplier"
                    size="medium"
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
            </Card>
          </form>
        )}
      </Formik>

    </Card>
  );
};

export default OrdersForm;
