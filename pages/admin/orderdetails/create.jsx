import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import {OrderdetailsForm} from "pages-sections/admin";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";

CreateOrders.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function CreateOrders() {
 const INITIAL_VALUES = {
  partyName: "",
  truckType: "",
  truckNo: "",
  payBy: "billed",
  pickup: "",              
  dropPoints: [""],        
  market: "yes",
  own: "no",
  settleSupplier: "",
  freight: "",
  hiringCost: ""
};


  const validationSchema = yup.object().shape({
    partyName: yup.string().required("Party Name is required"),
    truckType: yup.string().required("Truck Type is required"),
    truckNo: yup.string().required("Truck No is required"),
    settleSupplier: yup.string().required("Supplier is required"),
    freight: yup.string().required("Freight is required"),
    hiringCost: yup.string().required("Hiring Cost is required")
  });

  const handleFormSubmit = (values) => {
    console.log("Submitted Values:", values);
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Order Details</H3>
      <OrderdetailsForm
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
