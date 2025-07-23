import Router from "next/router";
import {
  Box,
  Card,
  Stack,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  Chip
} from "@mui/material";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import Scrollbar from "components/Scrollbar";

const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "date", label: "Date", align: "left" },
  { id: "lrNo", label: "LR No", align: "left" },
  { id: "party", label: "Party Name", align: "left" },
  { id: "city", label: "City", align: "left" },
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
    city: "Ahmedabad - Mumbai",
    date: "2025-06-01",
    lrNo: "LR-12345",
    freight: 5000,
    status: "Pending",
    slow: 4
  },
  {
    id: "2",
    party: "XYZ Transport",
    city: "Surat - Delhi",
    date: "2025-06-05",
    lrNo: "LR-23456",
    freight: 8500,
    status: "Complete",
    slow: 2
  },
  {
    id: "3",
    party: "Global Freight",
    city: "Rajkot - Pune",
    date: "2025-06-10",
    lrNo: "LR-34567",
    freight: 7800,
    status: "Pending",
    slow: 3
  },
  {
    id: "4",
    party: "Express Movers",
    city: "Baroda - Chennai",
    date: "2025-06-15",
    lrNo: "LR-45678",
    freight: 12000,
    status: "In Transit",
    slow: 1
  },
  {
    id: "5",
    party: "Swift Logistics",
    city: "Anand - Jaipur",
    date: "2025-06-20",
    lrNo: "LR-56789",
    freight: 6700,
    status: "Complete",
    slow: 5
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
        handleSearch={() => {}}
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
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      {item.lrNo}
                      <Chip
                        label={item.slow}
                        color="secondary"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </TableCell>
                    <TableCell>{item.party}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell>{item.freight}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={
                          item.status === "Complete"
                            ? "success"
                            : item.status === "Pending"
                            ? "warning"
                            : "info"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {/* Replace this with your Action buttons */}
                      Action
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(categories.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </Box>
  );
}
