import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { SuppliersForm } from "pages-sections/admin";
import axios from "utils/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";

UpdateSupplier.getLayout = function getLayout(page) {
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
  pincode: yup.string().required("Pin code is required"),
  contact_person: yup.string().required("Contact person is required"),
  contact_number: yup.string().required("Contact number is required"),
});

export default function UpdateSupplier() {
  const router = useRouter();
  const { id } = router.query; // /supplier/update/[id]
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`/supplier/${id}`)
        .then((res) => {
          const supplier = res.data;
          setInitialValues({
            name: supplier.name || "",
            pan_number: supplier.pan_number || "",
            gst_number: supplier.gst_number || "",
            route_name: supplier.route_name || "",
            address: supplier.address || "",
            city: supplier.city || "",
            state: supplier.state || "",
            pincode: supplier.pincode || "",
            contact_person: supplier.contact_person || "",
            contact_number: supplier.contact_number || "",
          });
        })
        .catch((err) => {
          console.error("Failed to load supplier", err);
        });
    }
  }, [id]);

  const handleFormSubmit = (values) => {



    axios.put(`/supplier/${id}`, {
      name: values.name,
      gst_number: values.gst_number,
      pan_number: values.pan_number,
      vendor_code: values.vendor_code,
      contact_person: values.contact_person,
      contact_number: values.contact_number,
      address: values.address,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      route_name: values.route_name,
    })
      .then(() => {
        console.log("Supplier updated successfully");
        router.push("/admin/suppliers");
      })
      .catch((err) => {
        console.error("Error updating supplier", err);
      });
  };

  if (!initialValues) return <p>Loading supplier details...</p>;

  return (
    <Box py={4}>
      <H3 mb={2}>Update Supplier</H3>
      <SuppliersForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
