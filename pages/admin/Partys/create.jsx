import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import {PartysForm} from "pages-sections/admin";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";

CreateParty.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function CreateParty() {
  const INITIAL_VALUES = {
    name: "",
    gst_number: "",
    pan_number: "",
    vendoe_code: "",
    contact_person: "",
    contact_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    create_period: ""
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
    create_period: yup.string().required("Create Period is required"),
    vendoe_code: yup.string().required("Vendor Code is required")
  });

  const handleFormSubmit = (values) => {
    console.log("Submitted Party Data:", values);
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
