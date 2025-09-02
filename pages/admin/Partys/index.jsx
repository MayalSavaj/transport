import Router from "next/router";
import { Box, Button, Card, Stack, Table, TableContainer, TextField } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import debounce from "lodash.debounce";

import useMuiTable from "hooks/useMuiTable";
import Scrollbar from "components/Scrollbar";
import { useEffect, useMemo, useState } from "react";
import AddIcon from '@mui/icons-material/Add';

import { PartysRow } from "pages-sections/admin";
import axios from "utils/axios"; // import the custom axios
import { useSnackbar } from "notistack";


const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "gst_number", label: "GST Number", align: "left" },
  { id: "contact_person", label: "Contact Person", align: "left" },
  { id: "contact_number", label: "Contact Number", align: "left" },
  { id: "city", label: "city", align: "left" },
  { id: "action", label: "Action", align: "center" }
];
PartyList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// const products = [
//   {
//     id: "1",
//     name: "Alpha Traders",
//     gst_number: "27ABCDE1234F1Z5",
//     pan_number: "ABCDE1234F",
//     contact_person: "Rajesh ss",
//     contact_number: "+91-9876543210",
//     address: "123 Market Street",
//     city: "Ahmedabad",
//     state: "Gujarat",
//     pincode: "380001",
//     create_period: "2024-01-20"
//   },
//   {
//     id: "2",
//     name: "Beta Distributors",
//     gst_number: "29PQRSX6789H2Z7",
//     pan_number: "PQRSX6789H",
//     contact_person: "Nisha Rao",
//     contact_number: "+91-9876501122",
//     address: "88 Industrial Area",
//     city: "Bangalore",
//     state: "Karnataka",
//     pincode: "560001",
//     create_period: "2024-02-23"
//   },
//   {
//     id: "3",
//     name: "Gamma Corp",
//     gst_number: "24LMNOP1234K3Z9",
//     pan_number: "LMNOP1234K",
//     contact_person: "Amit dasdasdasdasda",
//     contact_number: "+91-9988776655",
//     address: "56 Business Bay",
//     city: "Surat",
//     state: "Gujarat",
//     pincode: "395007",
//     create_period: "2024-03-01"
//   }
// ];


export default function PartyList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchParties = async (search = "") => {
    try {
      const res = await axios.get(`/parties`, {
        params: { search },
      });
      setParties(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch parties:", error);
    }
  };

  useEffect(() => {
    fetchParties(); // load initially
  }, []);

  // ✅ stable debounced function
  const debouncedFetch = useMemo(
    () =>
      debounce((value) => {
        fetchParties(value);
      }, 500),
    []
  );

  const handleSearch = (value) => {
    console.log("Search input:", value);
    setSearchTerm(value);
    debouncedFetch(value);
  };

  // cleanup debounce
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async (id) => {


    console.log(id);

    try {
      const response = await axios.delete(`/parties/${id}`);

      enqueueSnackbar("Party Deleted successfully 🎉", { variant: "success" });

      setParties(response.data);

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
      else {
        enqueueSnackbar("Server not responding ❌", { variant: "error" });
      }
    } finally {
    }
  }






  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({ listData: parties });

  const handleBtnClick = () => {
    Router.push("/admin/Partys/create")
  }


  console.log("Filtered List:", filteredList);
  return (
    <Box py={4}>
      <H3 mb={2}>Party List</H3>


      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        {/* Search Box */}
        <TextField
          placeholder="Search Party"
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

        {/* Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />} // Add this line

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
          Add Party
        </Button>
      </Box>

      {/* <SearchArea
        handleSearch={handleSearch}
        buttonText="Add Party"
        searchPlaceholder="Search Party..."
        handleBtnClick={() => Router.push("/admin/Partys/create")}
      />

      <TextField
        fullWidth
        size="small"
        onChange={(e) => handleSearch(e.target.value)} // <-- calls parent fn
      /> */}


      <Card>
        <Scrollbar autoHide={false}>
          <TableContainer sx={{ minWidth: 1100 }}>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={parties.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredList.map((product, index) => (

                  <PartysRow product={product} key={index} handleDelete={handleDelete} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(parties.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </Box>
  );
}
