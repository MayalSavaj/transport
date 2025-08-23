import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { LCForm } from "pages-sections/admin";
import axios from "utils/axios"; // import the custom axios

import VendorDashboardLayout from "components/layouts/vendor-dashboard";

// Apply layout
CreateLC.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function CreateLC() {
  const INITIAL_VALUES = {
    terms: "",
    type: ""
  };

  const validationSchema = yup.object().shape({
    terms: yup.string().required("Terms & Conditions are required"),
    type: yup.string().required("T & C Type is required")
  });

  const handleFormSubmit = async (values) => {
    try {
      const res = await axios.post("/terms-conditions", {

        'type': values.dropdownField == 'invoice' ? 'invoice' : 'lr',
        'content': values.textField
      });


    } catch (error) {
      console.error("Error fetching number series:", error);
    } finally {
      setLoading(false);
    }


  };

  return (
    <Box py={4}>
      <H3 mb={2}>Create T & C</H3>

      <LCForm
        initialValues={INITIAL_VALUES}
        // validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
