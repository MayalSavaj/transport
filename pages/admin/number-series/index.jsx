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
import { NumberseriesRow } from "pages-sections/admin";
import api from "utils/__api__/dashboard";

const tableHeading = [{
  id: "id",
  label: "ID", 
  align: "left"
}, {
  id: "name",
  label: "Name",
  align: "left"
}, {
  id: "image",
  label: "Image",
  align: "left"
}, {
  id: "level",
  label: "Level",
  align: "left"
}, {
  id: "featured",
  label: "Featured",
  align: "left"
}, {
  id: "action",
  label: "Action",
  align: "center"
}];

// =============================================================================
NumberSeriesList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function NumberSeriesList(props) {
  const {
    categories
  } = props;

  // RESHAPE THE PRODUCT LIST BASED TABLE HEAD CELL ID
  const filteredCategories = categories.map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    image: item.image,
    featured: item.featured,
    level: Math.ceil(Math.random() * 1)
  }));
  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: filteredCategories
  });
  return <Box py={4}>
      <H3 mb={2}>Number Series</H3>

      <SearchArea handleSearch={() => {}} buttonText="Add Number Series" searchPlaceholder="Search Number Series..." handleBtnClick={() => Router.push("/admin/number-series/create")} />

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 900
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} rowCount={categories.length} numSelected={selected.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map(category => <NumberseriesRow item={category} key={category.id} selected={selected} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(categories.length / rowsPerPage)} />
        </Stack>
      </Card>
    </Box>;
}
export const getStaticProps = async () => {
  const categories = await api.category();
  return {
    props: {
      categories
    }
  };
};