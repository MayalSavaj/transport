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
import { LCRow } from "pages-sections/admin";

const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "terms", label: "Terms and Conditions", align: "left" },
  { id: "type", label: "T & C Type", align: "left" },
  { id: "action", label: "Action", align: "center" }
];

LCList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function LCList() {
  const categories = [
    { id: "1", terms: "You must be 18+ to use this service.", type: "Invoice" },
    { id: "2", terms: "Data is stored securely in compliance with GDPR.", type: "L-R" },
    { id: "3", terms: "Refund requests must be made within 7 days.", type: "L-R" },
    { id: "4", terms: "Your information will not be shared.", type: "Invoice" },
    { id: "5", terms: "Account suspension for policy violations.", type: "Invoice" }
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
      <H3 mb={2}>T & C</H3>

      <SearchArea
        handleSearch={() => {}}
        buttonText="Add T & C"
        searchPlaceholder="Search T & C..."
        handleBtnClick={() => Router.push("/admin/l&c/create")}
      />

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 900 }}>
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
                {filteredList.map((category) => (
                  <LCRow item={category} key={category.id} selected={selected} />
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
