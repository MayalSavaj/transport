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
  Chip,
  Button,
  Drawer,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  IconButton, // Keep IconButton
  Divider,
} from "@mui/material";
import SearchArea from "components/dashboard/SearchArea";
import AddIcon from '@mui/icons-material/Add';
import { FormGroup, FormControlLabel, Checkbox, FormLabel } from "@mui/material";


import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import Scrollbar from "components/Scrollbar";
import { useEffect, useState } from "react";
import axios from "utils/axios";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from '@mui/icons-material/FilterList'; // The icon for the button

// ... (tableHeading and getLayout remain the same)
const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "date", label: "Date", align: "left" },
  { id: "lrNo", label: "LR No", align: "left" },
  { id: "party", label: "Party Name", align: "left" },
  { id: "city", label: "City", align: "left" },
  { id: "freight", label: "Freight", align: "left" },
  { id: "status", label: "Status", align: "left" },
];

OrdersList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};


export default function OrdersList() {
  // All state management logic remains exactly the same
  const [loading, setLoading] = useState(true);
  const [categoriess, setCategoriess] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(["started", 'in_transit']);
  const [tempStatus, setTempStatus] = useState([]);
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");
  const [tempDateFrom, setTempDateFrom] = useState("");
  const [tempDateTo, setTempDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  // useEffect and filter handlers remain exactly the same
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        // Loop through the array and append each status
        if (appliedStatus.length > 0) {
          appliedStatus.forEach(status => params.append("status[]", status));
        } if (appliedDateFrom) params.append("from_date", appliedDateFrom);
        if (appliedDateTo) params.append("to_date", appliedDateTo);

        const response = await axios.get(`/orders?${params.toString()}`);
        setCategoriess(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [appliedStatus, appliedDateFrom, appliedDateTo]);

  const handleOpenDrawer = () => {
    setTempStatus(appliedStatus);
    setTempDateFrom(appliedDateFrom);
    setTempDateTo(appliedDateTo);
    setIsDrawerOpen(true);
  };


  const handleStatusChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      // If checkbox is checked, add the status to the array
      setTempStatus(prev => [...prev, name]);
    } else {
      // If unchecked, remove the status from the array
      setTempStatus(prev => prev.filter(status => status !== name));
    }
  };


  const handleApplyFilters = () => {
    setAppliedStatus(tempStatus);
    setAppliedDateFrom(tempDateFrom);
    setAppliedDateTo(tempDateTo);
    setIsDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setTempStatus([]);
    setAppliedStatus([]);
    setTempDateFrom("");
    setTempDateTo("");
    setAppliedDateFrom("");
    setAppliedDateTo("");
    setIsDrawerOpen(false);
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500); // wait 500ms after typing stops

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, appliedStatus, appliedDateFrom, appliedDateTo]);


  const handleSearch = async (value) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // existing filters
      if (appliedStatus.length > 0) {
        appliedStatus.forEach((status) => params.append("status[]", status));
      }
      if (appliedDateFrom) params.append("from_date", appliedDateFrom);
      if (appliedDateTo) params.append("to_date", appliedDateTo);

      // 🔍 add search parameter
      if (value) params.append("search", value);

      const response = await axios.get(`/orders?${params.toString()}`);
      setCategoriess(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };


  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({ listData: categoriess });

  return (
    <Box py={4}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        mb={3}
      >
        <H3>Orders</H3>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* We use a standard TextField for the search bar */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search Orders"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          {/* The two buttons are here, next to the search bar */}
          <Button
            onClick={handleOpenDrawer}
            startIcon={<FilterListIcon />}
            sx={{
              backgroundColor: '#4e97FD', // Bright blue color
              color: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#303f9f', // Slightly darker on hover
              },
            }}
          >
            Filters
          </Button>

          <Button
            onClick={() => Router.push("/admin/orders/create")}
            startIcon={<AddIcon />} // Add this line

            sx={{
              backgroundColor: '#4e97FD', // Bright blue color
              color: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#303f9f', // Slightly darker on hover
              },
            }}
          >
            Add Order
          </Button>
        </Stack>
      </Stack>
      {/* --- THIS IS THE ONLY PART THAT HAS CHANGED --- */}
      {/* We now pass an IconButton instead of a full Button */}


      <Card>
        {/* ... Table and Drawer JSX remains exactly the same ... */}
        <Scrollbar>
          <TableContainer sx={{ minWidth: 1000 }}>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={categoriess.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredList.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    onClick={() => Router.push(`/admin/orderdetails/create/${item.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      {item?.created_at
                        ? new Date(item.created_at)
                          .toLocaleString("en-GB")
                          .replace(/\//g, "-")
                        : "--"}
                    </TableCell>
                    <TableCell>
                      {item?.lr_count > 0 ? item?.order_lr_number?.lr_number : ""}
                      {item?.lr_count > 0 ? (
                        <Chip
                          label={item?.lr_count}
                          color="secondary"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{item?.party?.name}</TableCell>
                    <TableCell>{item?.pickup_location}</TableCell>
                    <TableCell>{item?.freight_charge}</TableCell>
                    <TableCell>
                      <Chip
                        label={item?.status}
                        color={
                          item?.status === "completed"
                            ? "success"
                            : item?.status === "started"
                              ? "warning"
                              : "info"
                        }
                        size="small"
                      />
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
            count={Math.ceil(categoriess.length / rowsPerPage)}
          />
        </Stack>
      </Card>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>

            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Status</FormLabel>
              <FormGroup>
                {['completed', 'started', 'in_transit'].map((status) => (
                  <FormControlLabel
                    key={status}
                    control={
                      <Checkbox
                        checked={tempStatus.includes(status)}
                        onChange={handleStatusChange}
                        name={status}
                      />
                    }
                    label={status.charAt(0).toUpperCase() + status.slice(1)} // Capitalizes the label
                  />
                ))}
              </FormGroup>
            </FormControl>

            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={tempDateFrom}
              onChange={(e) => setTempDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={tempDateTo}
              onChange={(e) => setTempDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
            <Button
              fullWidth
              sx={{
                backgroundColor: '#4e97FD', // Bright blue color
                color: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: '#303f9f', // Slightly darker on hover
                },
              }}
              variant="contained"
              onClick={handleApplyFilters}
            >
              Apply Filter
            </Button>
          </Stack>

        </Box>
      </Drawer>
    </Box>
  );
}