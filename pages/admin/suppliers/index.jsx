import Router from "next/router";
import {
  Box,
  Card,
  Stack,
  Table,
  TableContainer,
  TableBody,
  Button,
  TextField
} from "@mui/material";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3 } from "components/Typography";
import { SuppliersRow } from "pages-sections/admin";
import AddIcon from '@mui/icons-material/Add';

import useMuiTable from "hooks/useMuiTable";
import debounce from "lodash.debounce";


import axios from "utils/axios"; // import the custom axios
import { useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";

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


SupplierList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};



export default function SupplierList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  // ✅ Fetch suppliers from API
  const fetchSuppliers = async (search = "") => {
    try {
      const res = await axios.get(`/supplier`, {
        params: { search },
      });
      setSuppliers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers(); // initial load
  }, []);

  // ✅ stable debounced function
  const debouncedFetch = useMemo(
    () =>
      debounce((value) => {
        fetchSuppliers(value);
      }, 500),
    []
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
    debouncedFetch(value);
  };


  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/supplier/${id}`);

      enqueueSnackbar("Supplier Deleted successfully 🎉", { variant: "success" });

      setSuppliers(response.data);

    } catch (error) {
      console.log(error.response?.data?.error);

      // if validation errors (422)
      if (error.response?.status === 422 && error.response?.data?.error) {
        const errors = error.response.data.error;
        // show all validation messages
        Object.values(errors).flat().forEach((msg) => {
          enqueueSnackbar(msg, { variant: "error" });
        });
      }
      // else if server error (500 or other)
      else if (error.response?.data?.error) {
        enqueueSnackbar(error.response.data.error, { variant: "error" });
      }
      // fallback

    } finally {
    }
  }

  // cleanup debounce
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);


  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: suppliers,
    defaultSort: "name"
  });

  const handleBtnClick = () => {
    Router.push("/admin/suppliers/create");
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Suppliers</H3>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        {/* Search Box */}
        <TextField
          placeholder="Search Supplier"
          size="small"
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            style: {
              borderRadius: "10px",
              background: "#fff",
            },
          }}
          sx={{ width: "350px" }}
        />

        {/* Add Supplier Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleBtnClick}
          sx={{
            backgroundColor: "#4e97FD",
            borderRadius: "8px",
            color: "white",
            textTransform: "none",
            fontWeight: 500,
            padding: "6px 18px",
            "&:hover": {
              backgroundColor: "#4e97FD",
            },
          }}
        >
          Add Supplier
        </Button>
      </Box>
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
                    handleDelete={handleDelete}
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

