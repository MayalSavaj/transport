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
import { useEffect, useState } from "react";
import axios from "utils/axios"; // import the custom axios

const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "date", label: "Date", align: "left" },
  { id: "lrNo", label: "LR No", align: "left" },
  { id: "party", label: "Party Name", align: "left" },
  { id: "city", label: "City", align: "left" },
  { id: "freight", label: "Freight", align: "left" },
  { id: "status", label: "Status", align: "left" },
  // { id: "action", label: "Action", align: "center" }
];

OrdersList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function OrdersList() {

  const [loading, setLoading] = useState(true);
  const [categoriess, setCategoriess] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders"); // Laravel: api/orders
        // console.log("Orders Response:", response.data.orders);
        setCategoriess(response.data.orders); // Adjust based on API structure
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  console.log("Fetched Orders:", categoriess);



  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: categoriess
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
                rowCount={setCategoriess.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredList.map((item) => (
                  <TableRow key={item.id} hover onClick={() => Router.push(`/admin/orderdetails/create/${item.id}`)}
                    style={{ cursor: "pointer" }}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      {item?.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-GB").replace(/\//g, "-")
                        : "--"}
                    </TableCell>                    <TableCell>
                      {item?.lr_count > 0 ?? item?.lr_count}
                      {
                        item?.lr_count > 0 ?
                          <Chip
                            label={item?.order_lr_number?.lr_number}
                            color="secondary"
                            size="small"
                            sx={{ ml: 1 }}
                          /> : "-"
                      }
                    </TableCell>
                    <TableCell>{item.party.name}</TableCell>
                    <TableCell>{item.pickup_location}</TableCell>
                    <TableCell>{item.freight_charge}</TableCell>
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
                    {/* <TableCell align="center">
                      Action
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(setCategoriess.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </Box>
  );
}
