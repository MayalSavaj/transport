import Router from "next/router";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import Scrollbar from "components/Scrollbar";
import { useEffect, useState } from "react";
import { PartysRow } from "pages-sections/admin";
import axios from "utils/axios"; // import the custom axios

const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "gst_number", label: "GST Number", align: "left" },
  { id: "contact_person", label: "Contact Person", align: "left" },
  { id: "contact_number", label: "Contact Number", align: "left" },
  { id: "city", label: "city", align: "left" },
  { id: "action", label: "Action", align: "center" }
];
PartyList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// const products = [
//   {
//     id: "1",
//     name: "Alpha Traders",
//     gst_number: "27ABCDE1234F1Z5",
//     pan_number: "ABCDE1234F",
//     contact_person: "Rajesh ss",
//     contact_number: "+91-9876543210",
//     address: "123 Market Street",
//     city: "Ahmedabad",
//     state: "Gujarat",
//     pincode: "380001",
//     create_period: "2024-01-20"
//   },
//   {
//     id: "2",
//     name: "Beta Distributors",
//     gst_number: "29PQRSX6789H2Z7",
//     pan_number: "PQRSX6789H",
//     contact_person: "Nisha Rao",
//     contact_number: "+91-9876501122",
//     address: "88 Industrial Area",
//     city: "Bangalore",
//     state: "Karnataka",
//     pincode: "560001",
//     create_period: "2024-02-23"
//   },
//   {
//     id: "3",
//     name: "Gamma Corp",
//     gst_number: "24LMNOP1234K3Z9",
//     pan_number: "LMNOP1234K",
//     contact_person: "Amit dasdasdasdasda",
//     contact_number: "+91-9988776655",
//     address: "56 Business Bay",
//     city: "Surat",
//     state: "Gujarat",
//     pincode: "395007",
//     create_period: "2024-03-01"
//   }
// ];
export default function PartyList() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await axios.get("/parties");
        console.log("Fetched Parties:", response.data);
        setProducts(response.data); // based on your example response
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
  } = useMuiTable({ listData: products });


  console.log("Filtered List:", filteredList);
  return (
    <Box py={4}>
      <H3 mb={2}>Party List</H3>

      <SearchArea
        handleSearch={() => { }}
        buttonText="Add Party"
        searchPlaceholder="Search Party..."
        handleBtnClick={() => Router.push("/admin/Partys/create")}
      />

      <Card>
        <Scrollbar autoHide={false}>
          <TableContainer sx={{ minWidth: 1100 }}>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={products.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredList.map((product, index) => (
                  <PartysRow product={product} key={index} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(products.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </Box>
  );
}
