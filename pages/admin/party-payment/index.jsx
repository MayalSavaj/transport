import Router from "next/router";
import {
  Box,
  Card,
  Stack,
  Table,
  TableContainer,
  TableRow,
  TableCell,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableHeader from "components/data-table/TableHeader";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import Scrollbar from "components/Scrollbar";
import TablePagination from "components/data-table/TablePagination";
import { useState } from "react";

const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
];

partypaymentList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function partypaymentList() {
  const categories = [
    {
      id: "1",
      name: "ABC Traders",
      amount: "₹10,000",
      moreInfo: [
        {
          city: "Ahmedabad",
          date: "27-06-2025",
          truckType: "Tata 709",
          amount: "₹4,000",
          settle: "Complete"
        },
        {
          city: "Surat",
          date: "28-06-2025",
          truckType: "Ashok Leyland 1616",
          amount: "₹6,000",
          settle: "Pending"
        }
      ]
    },
    {
      id: "2",
      name: "XYZ Distributors",
      amount: "₹15,500",
      moreInfo: [
        {
          city: "Vadodara",
          date: "29-06-2025",
          truckType: "Mahindra Loadking",
          amount: "₹7,500",
          settle: "Complete"
        },
        {
          city: "Ahmedabad",
          date: "30-06-2025",
          truckType: "Tata 709",
          amount: "₹8,000",
          settle: "Pending"
        }
      ]
    },
    {
      id: "3",
      name: "KLM Enterprises",
      amount: "₹7,250",
      moreInfo: [
        {
          city: "Rajkot",
          date: "25-06-2025",
          truckType: "Ashok Leyland 2012",
          amount: "₹7,250",
          settle: "Complete"
        }
      ]
    },
    {
      id: "4",
      name: "PQR Supplies",
      amount: "₹12,100",
      moreInfo: [
        {
          city: "Bhavnagar",
          date: "26-06-2025",
          truckType: "Tata Ace",
          amount: "₹5,000",
          settle: "Pending"
        },
        {
          city: "Mehsana",
          date: "27-06-2025",
          truckType: "Mahindra Loadking",
          amount: "₹7,100",
          settle: "Complete"
        }
      ]
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
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));
  return (
    <Box py={4}>
      <H3 mb={2}>Party Payment</H3>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 900 }}>
            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                hideSelectBtn
                heading={tableHeading}
                rowCount={categories.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredList.map((item) => (
                  <RowWithExpand
                    key={item.id}
                    item={item}
                    isOpen={expandedId === item.id}
                    toggleExpand={() => toggleExpand(item.id)}
                  />
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
function RowWithExpand({ item }) {

  return (
    <>
      <TableRow hover sx={{ backgroundColor: "#fafafa" }}>
        <TableCell>
          #{item.id}
        </TableCell>
        <TableCell
          sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
          onClick={() => Router.push('/admin/party-Settle')}
        >
          {item.name}
        </TableCell>
        <TableCell>{item.amount}</TableCell>
      </TableRow>
    </>
  );
}