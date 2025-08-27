import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import * as yup from "yup";
import Router from "next/router";

import { H3 } from "components/Typography";
import { LCForm } from "pages-sections/admin";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import axios from "utils/axios"; // Make sure you have your custom axios instance here

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
  const [loading, setLoading] = useState(true);

  // ✅ Fetch T&C data on page load using ID from query
  useEffect(() => {
    if (query.id) {
      fetchTCData(query.id);
    }
  }, [query.id]);

  const fetchTCData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/terms-conditions/${id}`);

      console.log(response.data);
      if (response?.data) {
        setFormData({
          terms: response.data.content,
          type: response.data.type
        });
      }
    } catch (error) {
      console.error("Error fetching T&C data:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleFormSubmit = async (values) => {

    try {
      const payload = {
        'content': values.terms,
        'type': values.type
      };
      const response = await axios.put(`/terms-conditions/${query.id}`, payload);
      Router.push("/admin/t&c")
      console.log("Updated T & C Data:", response.data);
      // Optional: Redirect or show success message
    } catch (error) {
      console.error("Error updating T&C:", error);
    }
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Edit T & C</H3>

      {!loading ? (
        <LCForm
          initialValues={formData}
          validationSchema={validationSchema}
          handleFormSubmit={handleFormSubmit}
        />
      ) : (
        <p>Loading...</p>
      )}
    </Box>
  );
}
