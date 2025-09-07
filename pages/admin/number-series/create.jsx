import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { NumberseriesForm } from "pages-sections/admin";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { prefix } from "stylis";
import axios from "utils/axios";
import { useEffect, useState, useRef } from "react";
import { useSnackbar } from "notistack";

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

  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);

  // Cache to store fetched data for each series type
  const dataCache = useRef({
    invoice: null,
    lr: null
  });

  // form field validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required("required")
  });

  console.log("CreateNumberSeries initialValues:", initialValues);

  useEffect(() => {
    const fetchData = async () => {
      const currentSeriesType = initialValues.seriesType;

      // Check if data already exists in cache
      if (dataCache.current[currentSeriesType]) {
        console.log(`Using cached data for ${currentSeriesType}`);
        const cachedData = dataCache.current[currentSeriesType];

        setInitialValues((prev) => ({
          ...prev,
          numberFormat: cachedData.numberFormat || "",
          startingNumber: cachedData.startingNumber || ""
        }));
        setLoading(false);
        return;
      }

      console.log(`Fetching data for seriesType: ${currentSeriesType}`);
      setLoading(true);

      try {
        if (currentSeriesType === "invoice") {
          const res = await axios.get("/invoice");
          const data = res.data;

          const invoiceData = {
            numberFormat: data.prefix || "",
            startingNumber: data.start_number?.toString() || ""
          };

          // Cache the data
          dataCache.current.invoice = invoiceData;

          setInitialValues((prev) => ({
            ...prev,
            numberFormat: invoiceData.numberFormat,
            startingNumber: invoiceData.startingNumber
          }));

        } else if (currentSeriesType === "lr") {
          const res = await axios.get("/LrNumber");
          const data = res.data;

          const lrData = {
            numberFormat: "",
            startingNumber: data.start_number?.toString() || ""
          };

          // Cache the data
          dataCache.current.lr = lrData;

          setInitialValues((prev) => ({
            ...prev,
            numberFormat: lrData.numberFormat,
            startingNumber: lrData.startingNumber
          }));
        }
      } catch (error) {
        console.error("Error fetching number series:", error);
        enqueueSnackbar("Error fetching data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialValues.seriesType, enqueueSnackbar]);

  const handleFormSubmit = async (values) => {
    if (values.seriesType === "invoice") {
      console.log("Creating invoice series with values:", values);

      try {
        const res = await axios.post("/invoice", {
          prefix: values.numberFormat,
          start_number: values.startingNumber.toString(),
        });

        console.log(res);

        const updatedData = {
          numberFormat: res.data.data.prefix || "",
          startingNumber: res.data.data.start_number?.toString() || ""
        };

        // Update cache with new data
        dataCache.current.invoice = updatedData;

        setInitialValues((prev) => ({
          ...prev,
          numberFormat: updatedData.numberFormat,
          startingNumber: updatedData.startingNumber
        }));

        enqueueSnackbar("Invoice Number created successfully 🎉", { variant: "success" });

      } catch (error) {
        handleApiError(error);
      }
    } else {
      try {
        const res = await axios.post("/LrNumber", {
          start_number: values.startingNumber.toString(),
        });

        const updatedData = {
          numberFormat: "",
          startingNumber: res.data.data.start_number?.toString() || ""
        };

        // Update cache with new data
        dataCache.current.lr = updatedData;

        setInitialValues((prev) => ({
          ...prev,
          numberFormat: updatedData.numberFormat,
          startingNumber: updatedData.startingNumber
        }));

        enqueueSnackbar("LR Number created successfully 🎉", { variant: "success" });

      } catch (error) {
        handleApiError(error);
      }
    }
  };

  // Helper function to handle API errors
  const handleApiError = (error) => {
    if (error.response?.status === 422 && error.response?.data?.error) {
      const errors = error.response.data.error;
      Object.values(errors).flat().forEach((msg) => {
        enqueueSnackbar(msg, { variant: "error" });
      });
    } else if (error.response?.data?.error) {
      enqueueSnackbar(error.response.data.error, { variant: "error" });
    } else {
      enqueueSnackbar("Server not responding ❌", { variant: "error" });
    }
  };

  const handleSeriesTypeChange = (type) => {
    setInitialValues((prev) => ({
      ...prev,
      seriesType: type
    }));
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Create Number Series</H3>
      <NumberseriesForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        onSeriesTypeChange={handleSeriesTypeChange}
        loading={loading}
      />
    </Box>
  );
}