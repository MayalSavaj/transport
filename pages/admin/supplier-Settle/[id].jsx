import Router, { useRouter } from "next/router";
import {
  Box,
  Card,
  Stack,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  Typography,
  Button,
  Checkbox,
  Chip,
  Paper,
  TableHead,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  // --- NEW IMPORTS ---
  Drawer,
  IconButton,
  Divider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { useEffect, useState } from "react";
import axios from "utils/axios";
// --- NEW ICONS ---
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from '@mui/icons-material/FilterList';

supplierpaymentsettle.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function supplierpaymentsettle() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState([]); // Initialize with empty array
  const [loading, setLoading] = useState(true);

  // --- 1. ADD STATE FOR FILTERS ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(["pending"]);
  const [tempStatus, setTempStatus] = useState([]);

  // --- 2. UPDATE useEffect TO HANDLE FILTERS ---
  useEffect(() => {
    if (!id) return; // Don't fetch if id is not ready

    const fetchSupplierOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (appliedStatus.length > 0) {
          appliedStatus.forEach(status => params.append("status[]", status));
        }

        const res = await axios.get(`/supplier-orders/${id}?${params.toString()}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch supplier orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierOrders();
  }, [id, appliedStatus]); // Re-fetch when id or appliedStatus changes

  // --- (Existing settlement logic) ---
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formRows, setFormRows] = useState([]);
  const [remark, setRemark] = useState("");
  const [settleDate, setSettleDate] = useState(new Date().toISOString().split("T")[0]);
  const [receipt, setReceipt] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);


  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const isSelected = (id) => selected.includes(id);

  const handleSettle = () => {
    const selectedRows = data.filter((item) => selected.includes(item.id));
    const formatted = selectedRows.map((entry) => ({
      name: entry?.supplier?.name,
      amount: entry.final_amount,
      date: entry.created_at,
      pay: entry.final_amount,
      id: entry?.id
    }));
    setFormRows(formatted);
    setOpenModal(true);
  };



  const handleExtraInputChange = (index, field, value) => {
    const updated = [...formRows];
    updated[index] = { ...updated[index], [field]: value };
    setFormRows(updated);

    const shouldDisable = updated.some(row => Number(row.pay) > Number(row.amount));
    setIsSubmitDisabled(shouldDisable);


  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("remark", remark);
      formData.append("settleDate", settleDate);
      formData.append("orderId", id);
      formData.append("payments", JSON.stringify(formRows));
      if (receipt) {
        formData.append("receipt", receipt);
      }
      await axios.post("/supplier-settle", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // You should refetch or update state here after success
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. ADD HANDLERS FOR THE FILTER DRAWER ---
  const handleOpenDrawer = () => {
    setTempStatus(appliedStatus);
    setIsDrawerOpen(true);
  };
  const handleApplyFilters = () => {
    setAppliedStatus(tempStatus);
    setIsDrawerOpen(false);
  };
  const handleClearFilters = () => {
    setTempStatus([]);
    setAppliedStatus([]);
    setIsDrawerOpen(false);
  };
  const handleStatusChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setTempStatus(prev => [...prev, name]);
    } else {
      setTempStatus(prev => prev.filter(status => status !== name));
    }
  };


  const handleSettleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("remark", remark);
      formData.append("settleDate", settleDate);
      formData.append("orderId", id);
      formData.append("payments", JSON.stringify(formRows));
      if (receipt) {
        formData.append("receipt", receipt);
      }
      const res = await axios.post("/supplier-settle", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      setData(res.data);

      // You should refetch or update state here after success
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const getStatusChip = (status) => {
    if (status === "completed") {
      return <Chip label="Complete" size="small" sx={{ backgroundColor: "#c8f7c5", color: "#267326" }} />;
    } else {
      return <Chip label="Pending" size="small" sx={{ backgroundColor: "#ffe0b2", color: "#f57c00" }} />;
    }
  };

  const handleRowClick = (id) => {
    console.log("Navigating to order details for ID:", id);
    router.push(`/admin/orderdetails/create/${id}`);
  };

  // --- 4. FIX: Use fetched `data` instead of `sampleData` ---
  const { filteredList } = useMuiTable({
    listData: data, // Use the actual data from the API
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Supplier Payment</H3>

      <Card sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{data?.[0]?.supplier?.name}</Typography>
          <Stack direction="row" spacing={2}>
            {/* --- 5. ADD THE FILTER BUTTON --- */}
            <Button variant="outlined" onClick={handleOpenDrawer} startIcon={<FilterListIcon />}>
              Filters
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={selected.length === 0}
              onClick={handleSettle}
              sx={{ textTransform: "none" }}
            >
              Settle Selected
            </Button>
          </Stack>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
              <TableRow

              >
                <TableCell padding="checkbox" />
                <TableCell><strong>City</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Truck Type</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Settle Status</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* --- 6. FIX: Map over `filteredList` for sorting/pagination --- */}
              {filteredList.map((row) => (
                <TableRow
                  key={row?.id}
                  hover
                  onClick={() => handleRowClick(row?.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      disabled={row?.status == "completed"}
                      checked={isSelected(row?.id)}
                      onChange={() => handleSelect(row?.id)}
                    />
                  </TableCell>
                  <TableCell>{row?.order?.pickup_location}</TableCell>
                  <TableCell>
                    {row?.created_at
                      ? new Date(row.created_at).toLocaleDateString("en-GB")
                      : ""}
                  </TableCell>
                  <TableCell>{row?.order?.truck_type}</TableCell>
                  <TableCell>₹{row?.final_amount?.toLocaleString()}</TableCell>
                  <TableCell>{getStatusChip(row?.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* --- Settlement Modal (Existing code) --- */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Settle supplier Payments</DialogTitle>

        <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
          {formRows.map((row, idx) => (
            <Box
              key={idx}
              mb={3}
              sx={{
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                backgroundColor: "#f9f9f9",
                p: 2
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Name</Typography>
                  <Typography fontWeight={600}>{row.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Amount</Typography>
                  <Typography fontWeight={600} color="error">₹{row.amount}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography fontWeight={600}>{row.date}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Pay"
                    fullWidth
                    size="medium"
                    type="number"
                    value={row.pay || ""}
                    inputProps={{ min: 0 }}
                    onChange={(e) => handleExtraInputChange(idx, "pay", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          <Box mt={2} p={2} sx={{ borderRadius: 2, backgroundColor: "#f1f1f1" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Remark"
                  size="medium"
                  fullWidth
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Settle Date"
                  type="date"
                  size="medium"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={settleDate}
                  onChange={(e) => setSettleDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth component="label">
                  Upload Receipt
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setReceipt(e.target.files[0])}
                  />
                </Button>
                {receipt && (
                  <Typography variant="body2" mt={1} color="text.secondary">
                    📎 {receipt.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button disabled={isSubmitDisabled} onClick={handleSettleSubmit} variant="contained" color="error">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- 7. ADD THE FILTER DRAWER --- */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend"> SettleStatus</FormLabel>
            <FormGroup>
              {['completed', 'pending'].map((status) => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      checked={tempStatus.includes(status)}
                      onChange={handleStatusChange}
                      name={status}
                    />
                  }
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                />
              ))}
            </FormGroup>
          </FormControl>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button fullWidth variant="outlined" color="secondary" onClick={handleClearFilters}>
              Clear
            </Button>
            <Button fullWidth variant="contained" onClick={handleApplyFilters}>
              Apply Filter
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box >
  );
}