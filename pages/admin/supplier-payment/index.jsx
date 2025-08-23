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
import { useEffect, useState } from "react";
import axios from "utils/axios"; // import the custom axios


const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
];

SupplierpaymentList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function SupplierpaymentList() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermsConditions = async () => {
      try {
        const res = await axios.get("/supplier-payments");
        if (res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch terms & conditions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsConditions();
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
    listData: categories
  });
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));
  return (
    <Box py={4}>
      <H3 mb={2}>Supplier Payment</H3>

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

  const handleRedirect = (item) => {


    Router.push(`/admin/supplier-Settle/${item.supplier.id}`);

  };

  return (
    <>
      <TableRow hover sx={{ backgroundColor: "#fafafa" }}>



        <TableCell>
          #{item.id}
        </TableCell>
        <TableCell
          sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
          onClick={() => handleRedirect(item)}
        >
          {item?.supplier.name}
        </TableCell>
        <TableCell>{item?.final_amount}</TableCell>

      </TableRow>
    </>
  );
}