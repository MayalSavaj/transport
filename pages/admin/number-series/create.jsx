import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { NumberseriesForm } from "pages-sections/admin";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { prefix } from "stylis";
import axios from "utils/axios"; // import the custom axios
import { useEffect, useState } from "react";

// import api from "utils/__api__/products";

// =============================================================================
CreateNumberSeries.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

export default function CreateNumberSeries() {
  const [initialValues, setInitialValues] = useState({
    name: "",
    seriesType: "invoice",  // Default type
    numberFormat: "",
    startingNumber: ""
  });

  const [loading, setLoading] = useState(true);

  // form field validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required("required")
  });

  console.log("CreateNumberSeries initialValues:", initialValues);

  useEffect(() => {
    const fetchData = async () => {
      // ✅ If we already have data for this seriesType, skip API call
      if (
        (initialValues.seriesType === "invoice" && initialValues.numberFormat && initialValues.startingNumber) ||
        (initialValues.seriesType === "lr" && initialValues.startingNumber)
      ) {
        console.log(`Skipping API for ${initialValues.seriesType} — already have data`);
        return;
      }

      setLoading(true);
      try {
        if (initialValues.seriesType === "invoice") {
          const res = await axios.get("/invoice");
          const data = res.data;
          setInitialValues((prev) => ({
            ...prev,
            numberFormat: data.prefix || "",
            startingNumber: data.start_number?.toString() || ""
          }));
        } else if (initialValues.seriesType === "lr") {
          const res = await axios.get("/LrNumber");
          const data = res.data;
          setInitialValues((prev) => ({
            ...prev,
            numberFormat: "",
            startingNumber: data.start_number?.toString() || ""
          }));
        }
      } catch (error) {
        console.error("Error fetching number series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialValues.seriesType]);



  const handleFormSubmit = async (values) => {

    if (values.seriesType == "invoice") {


      console.log("Creating invoice series with values:", values);

      try {
        const res = await axios.post("/invoice", {
          prefix: values.numberFormat,
          start_number: values.startingNumber.toString(),
        }); // adjust base URL if needed

        console.log(res);
        setInitialValues((prev) => ({
          ...prev,
          numberFormat: res.data.data.prefix || "",
          startingNumber: res.data.data.start_number?.toString() || ""
        }));
        console.log("Invoice series created:", res.data);
      } catch (error) {
        console.error("Error fetching parties:", error);
      }

    }
    else {
      try {
        const res = await axios.post("/LrNumber", {
          start_number: values.startingNumber.toString(),
        }); // adjust base URL if needed
        setInitialValues((prev) => ({
          ...prev,
          numberFormat: "",
          startingNumber: res.data.data.start_number?.toString() || ""
        }));
      } catch (error) {
        console.error("Error fetching parties:", error);
      }
    }


  };

  const handleSeriesTypeChange = (type) => {
    setInitialValues((prev) => ({
      ...prev,
      seriesType: type
    }));
  };


  return <Box py={4}>
    <H3 mb={2}>Create Number Series</H3>

    <NumberseriesForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleFormSubmit={handleFormSubmit}
      onSeriesTypeChange={handleSeriesTypeChange} // custom prop
    />  </Box>;
}