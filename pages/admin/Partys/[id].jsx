import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { PartysForm } from "pages-sections/admin";
import axios from "utils/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { useSnackbar } from "notistack";

UpdateParty.getLayout = function getLayout(page) {
    return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function UpdateParty() {
    const router = useRouter();
    const { id } = router.query; // party ID from URL
    const { enqueueSnackbar } = useSnackbar();


    const [initialValues, setInitialValues] = useState(null);

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
        period_days: yup.string().required("Create Period is required"),
        vendor_code: yup.string().required("Vendor Code is required")
    });

    useEffect(() => {
        if (id) {
            try {

                const response = axios.get(`/parties/${id}`).then((res) => {
                    const data = res.data;
                    setInitialValues({
                        id: data.id || "",
                        name: data.name || "",
                        gst_number: data.gst_number || "",
                        pan_number: data.pan_number || "",
                        vendor_code: data.vendor_code || "",
                        contact_person: data.contact_person || "",
                        contact_number: data.contact_number || "",
                        address: data.address || "",
                        city: data.city || "",
                        state: data.state || "",
                        pincode: data.pincode || "",
                        period_days: data.period_days || ""
                    });
                });
            } catch (error) {
                console.log(error.response?.data?.error);

                // if validation errors (422)
                if (error.response?.status === 422 && error.response?.data?.error) {
                    const errors = error.response.data.error;
                    // show all validation messages
                    Object.values(errors).flat().forEach((msg) => {
                        enqueueSnackbar(msg, { variant: "error" });
                    });
                }
                // else if server error (500 or other)
                else if (error.response?.data?.error) {
                    enqueueSnackbar(error.response.data.error, { variant: "error" });
                }
                // fallback
                else {
                    enqueueSnackbar("Server not responding ❌", { variant: "error" });
                }
            } finally {

            }
        }
    }, [id]);

    const handleFormSubmit = async (values) => {

        try {

            const response = await axios.put(`/parties/${id}`, values).then(() => {
                console.log("Party updated successfully");
                router.push("/admin/Partys"); // go back to list after update
            })
        } catch (error) {
            console.log(error.response?.data?.error);

            // if validation errors (422)
            if (error.response?.status === 422 && error.response?.data?.error) {
                const errors = error.response.data.error;
                // show all validation messages
                Object.values(errors).flat().forEach((msg) => {
                    enqueueSnackbar(msg, { variant: "error" });
                });
            }
            // else if server error (500 or other)
            else if (error.response?.data?.error) {
                enqueueSnackbar(error.response.data.error, { variant: "error" });
            }
            // fallback
            else {
                enqueueSnackbar("Server not responding ❌", { variant: "error" });
            }
        } finally {
        }

    };

    if (!initialValues) {
        return <div>Loading...</div>; // loader while fetching
    }

    return (
        <Box py={4}>
            <H3 mb={2}>Update Party</H3>

            <PartysForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                handleFormSubmit={handleFormSubmit}
            />
        </Box>
    );
}
