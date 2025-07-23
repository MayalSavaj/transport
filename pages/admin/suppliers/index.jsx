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
  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: brands,
    defaultSort: "name"
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Suppliers</H3>

      <SearchArea
        handleSearch={() => {}}
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
  const brands = [
    {
      id: 1,
      name: "Apex Traders",
      pan_number: "ABCDE1234F",
      gst_number: "22ABCDE1234F1Z5",
      route_name: "Route 1",
      rood: "Rood 1",
      address: "12, Industrial Area",
      city: "Surat",
      state: "Gujarat",
      pin_code: "395006",
      contact_person: "Ramesh Patel",
      contact_number: "9876543210"
    },
    {
      id: 2,
      name: "Spark Suppliers",
      pan_number: "PQRES6789K",
      gst_number: "24PQRES6789K2Z3",
      route_name: "Route 2",
      rood: "Rood 2",
      address: "56, Market Road",
      city: "Ahmedabad",
      state: "Gujarat",
      pin_code: "380015",
      contact_person: "Meena Shah",
      contact_number: "9876511223"
    },
    {
      id: 3,
      name: "Global Tech",
      pan_number: "LMNOP3456Z",
      gst_number: "27LMNOP3456Z3W7",
      route_name: "Route 3",
      rood: "Rood 3",
      address: "101, Silicon Valley",
      city: "Bangalore",
      state: "Karnataka",
      pin_code: "560001",
      contact_person: "Vikram Rao",
      contact_number: "9123456789"
    },
    {
      id: 4,
      name: "Urban Wholesales",
      pan_number: "GHIJK8910M",
      gst_number: "29GHIJK8910M5X2",
      route_name: "Route 4",
      rood: "Rood 4",
      address: "Sector 18",
      city: "Delhi",
      state: "Delhi",
      pin_code: "110018",
      contact_person: "Anita Mehta",
      contact_number: "9988776655"
    },
    {
      id: 5,
      name: "EcoMart Distributors",
      pan_number: "TUVWX2345P",
      gst_number: "21TUVWX2345P7Y4",
      route_name: "Route 5",
      rood: "Rood 5",
      address: "Eco Street, MG Road",
      city: "Pune",
      state: "Maharashtra",
      pin_code: "411001",
      contact_person: "Rahul Jadhav",
      contact_number: "9011223344"
    }
  ];

  return {
    props: {
      brands
    }
  };
};
