import Router from "next/router";
import {
  Box,
  Card,
  Stack,
  Table,
  TableContainer,
  TableBody
} from "@mui/material";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3 } from "components/Typography";
import { SuppliersRow } from "pages-sections/admin";
import useMuiTable from "hooks/useMuiTable";

import axios from "utils/axios"; // import the custom axios
import { useEffect, useState } from "react";

// Table Headings
const tableHeading = [
  { id: "id", label: "ID", align: "center" },
  { id: "name", label: "Name", align: "center" },
  // { id: "pan_number", label: "PAN", align: "center" },
  // { id: "gst_number", label: "GST", align: "center" },
  // { id: "route_name", label: "Route", align: "center" },
  // { id: "rood", label: "Rood", align: "center" },
  // { id: "address", label: "Address", align: "center" },
  // { id: "city", label: "City", align: "center" },
  // { id: "state", label: "State", align: "center" },
  // { id: "pin_code", label: "Pin", align: "center" },
  { id: "contact_person", label: "Contact Person", align: "center" },
  { id: "contact_number", label: "Contact No.", align: "center" },
  { id: "action", label: "Action", align: "center" }
];

export default function BrandList({ brands }) {


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await axios.get("/supplier");
        console.log("Fetched Parties:", response.data);
        setData(response.data); // based on your example response
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch parties:", error);
        setLoading(false);
      }
    };

    fetchParties();
  }, []);

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: data,
    defaultSort: "name"
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Suppliers</H3>

      <SearchArea
        handleSearch={() => { }}
        buttonText="Add Supplier"
        searchPlaceholder="Search Supplier..."
        handleBtnClick={() => Router.push("/admin/suppliers/create")}
      />

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 1200 }}>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                numSelected={selected.length}
                rowCount={filteredList.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredList.map((brand) => (
                  <SuppliersRow
                    brand={brand}
                    key={brand.id}
                    selected={selected}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(filteredList.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </Box>
  );
}

// Attach layout
BrandList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

// ✅ Static supplier data
export const getStaticProps = async () => {


  return {
    props: {
      data: [],
    }
  };
};
