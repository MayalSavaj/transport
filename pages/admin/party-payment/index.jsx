"use client";

import { useRouter } from "next/router";
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
import axios from "utils/axios";

const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
];

function RowWithExpand({ item }) {
  const router = useRouter();
  const handleRedirect = () => {
    const partyId = item?.party?.id;
    if (partyId) router.push(`/admin/party-Settle/${partyId}`);
  };

  return (
    <TableRow hover sx={{ backgroundColor: "#fafafa" }}>
      <TableCell>#{item?.id}</TableCell>
      <TableCell
        sx={{
          cursor: "pointer",
          color: "primary.main",
          textDecoration: "underline",
        }}
        onClick={handleRedirect}
      >
        {item?.party?.name}
      </TableCell>
      <TableCell>{item?.final_amount}</TableCell>
    </TableRow>
  );
}

const PartyPaymentList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get("/party-payments");
        if (mounted && res?.data) setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch party payments", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({ listData: categories });

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
                {(filteredList || []).map((item) => (
                  <RowWithExpand
                    key={item.id}
                    item={item}
                    isOpen={false}
                    toggleExpand={() => {}}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.max(
              1,
              Math.ceil((categories.length || 0) / (rowsPerPage || 10))
            )}
          />
        </Stack>
      </Card>
    </Box>
  );
};

PartyPaymentList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default PartyPaymentList;
