import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { PartypaymentForm } from "pages-sections/admin";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";

// Apply layout
Createpartypayment.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function Createpartypayment() {
  const INITIAL_VALUES = {
    terms: "",
    type: ""
  };

  const validationSchema = yup.object().shape({
    terms: yup.string().required("Terms & Conditions are required"),
    type: yup.string().required("T & C Type is required")
  });

  const handleFormSubmit = (values) => {
    console.log("Submitted T & C:", values);
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Create Party Payment</H3>

      <PartypaymentForm
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
