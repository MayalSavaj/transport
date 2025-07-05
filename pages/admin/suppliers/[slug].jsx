import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import {SuppliersForm} from "pages-sections/admin";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import api from "utils/__api__/dashboard"; 

EditSupplier.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
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
  pin_code: yup.string().required("Pincode is required"),
  contact_person: yup.string().required("Contact person is required"),
  contact_number: yup.string().required("Contact number is required"),
});

export default function EditSupplier() {
  const { query } = useRouter();
  const { slug } = query;

  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    if (slug) {
      api.getSupplierBySlug(slug).then((data) => {
        if (data) setSupplier(data);
        else router.push("/admin/suppliers");
      });
    }
  }, [slug]);

  const handleFormSubmit = (values) => {
    console.log("Updated supplier:", values);
    alert("Supplier updated successfully!");
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Edit Supplier</H3>

   
        <SuppliersForm
          initialValues={supplier}
          validationSchema={validationSchema}
          handleFormSubmit={handleFormSubmit}
        />
    
    </Box>
  );
}
