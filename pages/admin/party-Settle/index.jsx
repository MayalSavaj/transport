import Router from "next/router";
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
  TextField
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { useState } from "react";

partypaymentsettle.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function partypaymentsettle() {
  const sampleData = [
    {
      id: 1,
      city: "Ahmedabad",
      date: "2025-06-27",
      truckType: "Tata 709",
      amount: 4000,
      status: "Complete"
    },
    {
      id: 2,
      city: "Surat",
      date: "2025-06-28",
      truckType: "Ashok Leyland 1616",
      amount: 6000,
      status: "Pending"
    }
  ];

  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formRows, setFormRows] = useState([]);
  const [remark, setRemark] = useState("");
  const [settleDate, setSettleDate] = useState("");
  const [receipt, setReceipt] = useState(null);

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selected.includes(id);

  const handleSettle = () => {
    const selectedRows = sampleData.filter((item) => selected.includes(item.id));
    const formatted = selectedRows.map((entry) => ({
      name: "ABC Traders", // Hardcoded, or dynamic if needed
      amount: entry.amount,
      date: entry.date,
      pay: entry.amount
    }));
    setFormRows(formatted);
    setRemark("");
    setSettleDate("");
    setReceipt(null);
    setOpenModal(true);
  };

  const handleExtraInputChange = (index, field, value) => {
    const updated = [...formRows];
    updated[index] = { ...updated[index], [field]: value };
    setFormRows(updated);
  };

  const handleSettleSubmit = () => {
    const payload = {
      payments: formRows,
      remark,
      settleDate,
      receiptName: receipt?.name || null
    };
    console.log("Submitted:", payload);
    setOpenModal(false);
    setSelected([]);
  };

  const getStatusChip = (status) => {
    if (status === "Complete") {
      return (
        <Chip
          label="Complete"
          size="small"
          sx={{ backgroundColor: "#c8f7c5", color: "#267326" }}
        />
      );
    } else {
      return (
        <Chip
          label="Pending"
          size="small"
          sx={{ backgroundColor: "#ffe0b2", color: "#f57c00" }}
        />
      );
    }
  };

  const {
    order,
    orderBy,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: sampleData
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Party Payment</H3>

      <Card sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">ABC Traders</Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={selected.length === 0}
            onClick={handleSettle}
            sx={{
              textTransform: "none",
              backgroundColor: selected.length === 0 ? "#ddd" : undefined
            }}
          >
            Settle Selected
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell><strong>City</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Truck Type</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Settle Status</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(row.id)}
                      onChange={() => handleSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.truckType}</TableCell>
                  <TableCell>₹{row.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Settle Party Payments</DialogTitle>

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
          <Button onClick={handleSettleSubmit} variant="contained" color="error">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
