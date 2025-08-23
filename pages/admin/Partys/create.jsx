import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { PartysForm } from "pages-sections/admin";
import axios from "utils/axios"; // import the custom axios

import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { useSnackbar } from "notistack";

CreateParty.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function CreateParty() {
  const INITIAL_VALUES = {
    name: "",
    gst_number: "",
    pan_number: "",
    vendor_code: "",
    contact_person: "",
    contact_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    period_days: ""
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    gst_number: yup.string().required("GST Number is required"),
    pan_number: yup.string().required("PAN Number is required"),
    contact_person: yup.string().required("Contact Person is required"),
    contact_number: yup
      .string()
      .required("Contact Number is required")
      .matches(/^[6-9]\d{9}$/, "Enter a valid contact number"),
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    pincode: yup
      .string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Enter a valid 6-digit pincode"),
    period_days: yup.string().required("Create Period is required"),
    vendor_code: yup.string().required("Vendor Code is required")
  });

  const { enqueueSnackbar } = useSnackbar();


  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/parties", values);

      enqueueSnackbar("Party created successfully 🎉", { variant: "success" });

      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.log(error.response?.data?.error);

      // if validation errors (422)
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
        enqueueSnackbar("Server not responding ❌", { variant: "error" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Add Party</H3>

      <PartysForm
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
