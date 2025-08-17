import Router from "next/router";
import { Box, Card, Stack, Table, TableContainer, TableBody, TableCell, TableRow, Chip } from "@mui/material";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import Scrollbar from "components/Scrollbar";
import { OrdersRow } from "pages-sections/admin";
import { useEffect, useState } from "react";
import axios from "utils/axios"; // import the custom axios

const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "party", label: "Party Name", align: "left" },
  { id: "city", label: "City-City", align: "left" },
  { id: "truckType", label: "Truck Type", align: "left" },
  { id: "date", label: "Date", align: "left" },
  { id: "lrNo", label: "LR No", align: "left" },
  { id: "freight", label: "Freight", align: "left" },
  { id: "status", label: "Status", align: "left" },
  { id: "action", label: "Action", align: "center" }
];

OrdersList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function OrdersList() {
  const categories = [
    {
      id: "1",
      party: "ABC Logistics",
      city: "dasdasd - Mumbai",
      truckType: "Open",
      date: "2025-06-01",
      lrNo: "LR-12345",
      freight: 5000,
      status: "Pending"
    },
    {
      id: "2",
      party: "XYZ Transport",
      city: "Surat - Delhi",
      truckType: "Trailer",
      date: "2025-06-05",
      lrNo: "LR-23456",
      freight: 8500,
      status: "Complete"
    },
    {
      id: "3",
      party: "Global Freight",
      city: "Rajkot - Pune",
      truckType: "Container",
      date: "2025-06-10",
      lrNo: "LR-34567",
      freight: 7800,
      status: "Pending"
    },
    {
      id: "4",
      party: "Express Movers",
      city: "Baroda - Chennai",
      truckType: "Tanker",
      date: "2025-06-15",
      lrNo: "LR-45678",
      freight: 12000,
      status: "In Transit"
    },
    {
      id: "5",
      party: "Swift Logistics",
      city: "Anand - Jaipur",
      truckType: "Close Body",
      date: "2025-06-20",
      lrNo: "LR-56789",
      freight: 6700,
      status: "Complete"
    }
  ];

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: categories
  });



  return (
    <Box py={4}>
      <H3 mb={2}>Orders</H3>

      <SearchArea
        handleSearch={() => { }}
        buttonText="Add Order"
        searchPlaceholder="Search Orders"
        handleBtnClick={() => Router.push("/admin/orders/create")}
      />

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 1000 }}>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={categories.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredList.map((item) => (
                  <OrdersRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          {/* <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(categories.length / rowsPerPage)}
          /> */}
        </Stack>
      </Card>
    </Box>
  );
}
