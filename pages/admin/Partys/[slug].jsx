import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import PartyForm from "pages-sections/admin/PartyForm";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";

EditParty.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

const INITIAL_VALUES = {
  name: "",
  gst_number: "",
  pan_number: "",
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
  contact_number: yup.string().required("Contact Number is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pincode: yup.string().required("Pincode is required"),
  create_period: yup.string().required("Create Period is required")
});

export default function EditParty() {
  const router = useRouter();
  const { id } = router.query;

  const [initialValues, setInitialValues] = useState(INITIAL_VALUES);

  useEffect(() => {
    if (id) {
      const demoData = {
        name: "ABC Traders",
        gst_number: "22ABCDE1234F1Z5",
        pan_number: "ABCDE1234F",
        contact_person: "John Doe",
        contact_number: "9876543210",
        address: "123 Main Street",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380001",
        create_period: "2024-01-01"
      };
      setInitialValues(demoData);
    }
  }, [id]);

  const handleFormSubmit = (values) => {
    console.log("Submitted values:", values);

  };

  return (
    <Box py={4}>
      <H3 mb={2}>Edit Party</H3>

      <PartyForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
