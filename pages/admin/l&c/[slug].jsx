import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { LCForm } from "pages-sections/admin";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";

EditLC.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

const INITIAL_VALUES = {
  terms: "",
  type: ""
};

const validationSchema = yup.object().shape({
  terms: yup.string().required("Terms are required"),
  type: yup.string().required("T & C Type is required")
});

export default function EditLC() {
  const { query } = useRouter(); 
  const [formData, setFormData] = useState(INITIAL_VALUES);

  useEffect(() => {
    if (query.id) {
      const mockLCs = [
        { id: "1", terms: "You must be 18+ to use this service.", type: "Invoice" },
        { id: "2", terms: "Data is stored securely in compliance with GDPR.", type: "L-R" },
        { id: "3", terms: "Refund requests must be made within 7 days.", type: "L-R" }
      ];

      const data = mockLCs.find(item => item.id === query.id);
      if (data) setFormData({ terms: data.terms, type: data.type });
    }
  }, [query.id]);

  const handleFormSubmit = (values) => {
    console.log("Updated T & C Data:", values);
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Edit T & C</H3>

      <LCForm
        initialValues={formData}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
