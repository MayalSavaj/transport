import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { SuppliersForm } from "pages-sections/admin";
import axios from "utils/axios"; // import the custom axios

import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { useSnackbar } from "notistack";

CreateBrand.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

const INITIAL_VALUES = {
  name: "",
  pan_number: "",
  gst_number: "",
  route_name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  contact_person: "",
  contact_number: "",
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  pan_number: yup
    .string()
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
    .required("PAN number is required"),
  gst_number: yup.string().required("GST number is required"),
  route_name: yup.string().required("Route name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pin_code: yup.string().required("Pin code is required"),
  contact_person: yup.string().required("Contact person is required"),
  contact_number: yup.string().required("Contact number is required"),
});

export default function CreateBrand() {

  const { enqueueSnackbar } = useSnackbar();

  const handleFormSubmit = async (values,) => {

    console.log("11111111111111111111111");
    try {
      const response = await axios.post("/supplier", {
        name: values.name,
        gst_number: values.gst_number,
        pan_number: values.pan_number,
        vendor_code: values.vendor_code,
        contact_person: values.contact_person,
        contact_number: values.contact_number,
        address: values.address,
        city: values.city,
        state: values.state,
        pincode: values.pin_code,
        route_name: values.route_name,
      });

      enqueueSnackbar("Supplier created successfully 🎉", { variant: "success" });

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
    }
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Create Supplier</H3>

      <SuppliersForm
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
