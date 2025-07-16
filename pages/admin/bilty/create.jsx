import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { BiltyForm } from "pages-sections/admin";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
// import api from "utils/__api__/products";

// =============================================================================
CreateNumberSeries.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

export default function CreateNumberSeries() {
  const INITIAL_VALUES = {
    name: "",
    parent: [],
    featured: false
  };

  // form field validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required("required")
  });
  const handleFormSubmit = () => {};
  return <Box py={4}>
      <H3 mb={2}>Create Bilty</H3>

      <BiltyForm initialValues={INITIAL_VALUES} validationSchema={validationSchema} handleFormSubmit={handleFormSubmit} />
    </Box>;
}