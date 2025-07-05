import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import SuppliersForm from "pages-sections/admin/SuppliersForm"; 
import VendorDashboardLayout from "components/layouts/vendor-dashboard";

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
  pin_code: "",
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
  const handleFormSubmit = (values) => {
    console.log("Supplier submitted:", values);
    alert("Supplier created successfully!");
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
