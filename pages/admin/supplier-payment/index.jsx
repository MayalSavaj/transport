import Router from "next/router";
import {
  Box,
  Card,
  Stack,
  Table,
  TableContainer,
  Collapse,
  Typography,
  IconButton,
  TableRow,
  TableCell,
  Checkbox,
  TableHead,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Radio, RadioGroup, FormControlLabel
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableHeader from "components/data-table/TableHeader";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import Scrollbar from "components/Scrollbar";
import TablePagination from "components/data-table/TablePagination";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";

const tableHeading = [
  { id: "id", label: "ID", align: "left" },
  { id: "name", label: "Name", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
];

SupplierpaymentList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function SupplierpaymentList() {
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
  } = useMuiTable({ listData: categories });

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
 function RowWithExpand({ item, isOpen, toggleExpand }) {
  const [checkedItems, setCheckedItems] = useState(item.moreInfo?.map(() => false) || []);
  const [openModal, setOpenModal] = useState(false);
  const [formRows, setFormRows] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState('');

  const handleCheckboxToggle = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const openSettleModal = () => {
    const selected = item.moreInfo.filter((_, i) => checkedItems[i]);
    const formatted = selected.map((entry) => ({
      name: item.name,
      amount: entry.amount,
      date: entry.date,
      pay: entry.amount, // Pre-fill pay
      remark: '',
      settleDate: '',
      receipt: null
    }));
    setFormRows(formatted);
    setSelectedRadio('');
    setOpenModal(true);
  };

  const handleExtraInputChange = (index, field, value) => {
    const updated = [...formRows];
    updated[index] = { ...updated[index], [field]: value };
    setFormRows(updated);
  };

  const handleSettleSubmit = () => {
    console.log('Submitted:', formRows[selectedRadio]);
    setOpenModal(false);
  };

  return (
    <>
      <TableRow hover sx={{ backgroundColor: "#fafafa" }}>
        <TableCell>
          <IconButton size="small" onClick={toggleExpand}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          #{item.id}
        </TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.amount}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={4} sx={{ p: 0, borderBottom: 0 }}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box component={Paper} elevation={3} sx={{ mx: 2, my: 2, p: 3, borderRadius: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">{item.name}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={openSettleModal}
                  disabled={!checkedItems.includes(true)}
                >
                  Settle Selected
                </Button>
              </Box>

              <Table size="small" sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell />
                    <TableCell><strong>City</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Truck Type</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Settle Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item.moreInfo.map((info, idx) => (
                    <TableRow key={idx}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={checkedItems[idx]}
                          onChange={() => handleCheckboxToggle(idx)}
                        />
                      </TableCell>
                      <TableCell>{info.city}</TableCell>
                      <TableCell>{info.date}</TableCell>
                      <TableCell>{info.truckType}</TableCell>
                      <TableCell>{info.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={info.settle}
                          size="small"
                          sx={{
                            backgroundColor: info.settle === "Complete" ? "#C8E6C9" : "#FFE0B2",
                            color: info.settle === "Complete" ? "#2E7D32" : "#EF6C00"
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Modal */}
     <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
  <DialogTitle>Settle Payments</DialogTitle>

  <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
    <RadioGroup value={selectedRadio} onChange={(e) => setSelectedRadio(e.target.value)}>
      {formRows.map((row, idx) => (
        <Box key={idx} mb={3}>
          <FormControlLabel
            value={idx.toString()}
            control={<Radio sx={{ mt: 1.5, ml: 1 }} />}
            sx={{
              m: 0,
              width: '100%',
              alignItems: 'flex-start',
              borderRadius: 2,
              border: selectedRadio === idx.toString() ? '2px solid #1976d2' : '1px solid #e0e0e0',
              transition: 'all 0.2s ease',
              backgroundColor: selectedRadio === idx.toString() ? '#e3f2fd' : '#f9f9f9',
            }}
            label={
              <Box sx={{ width: '100%', p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Name</Typography>
                    <Typography fontWeight={600}>{row.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Amount</Typography>
                    <Typography fontWeight={600} color="primary">₹{row.amount}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Date</Typography>
                    <Typography fontWeight={600}>{row.date}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Pay"
                      fullWidth
                      type="number"
                      value={row.pay || ""}
                      inputProps={{ min: 0 }}
                      onChange={(e) => handleExtraInputChange(idx, "pay", e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            }
          />

          {/* Expanded Section */}
          {selectedRadio === idx.toString() && (
            <Box mt={2} pl={6} pr={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Remark"
                    fullWidth
                    value={row.remark || ""}
                    onChange={(e) => handleExtraInputChange(idx, "remark", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Settle Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={row.settleDate || ""}
                    onChange={(e) => handleExtraInputChange(idx, "settleDate", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" fullWidth component="label">
                    Upload Receipt
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        handleExtraInputChange(idx, "receipt", e.target.files[0])
                      }
                    />
                  </Button>
                  {row.receipt && (
                    <Typography variant="body2" mt={1} color="text.secondary">
                      📎 {row.receipt.name}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      ))}
    </RadioGroup>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenModal(false)}>Cancel</Button>
    <Button
      onClick={handleSettleSubmit}
      variant="contained"
      color="primary"
      disabled={selectedRadio === ""}
    >
      Submit
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
}

