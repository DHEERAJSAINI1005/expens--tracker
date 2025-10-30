"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, CATEGORIES } from "../constants/constant";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import CommonModal from "../components/CommonModal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Loader from "../components/Loader";
import TopBar from "../components/TopBar";
import AppLogo from "../components/AppLogo";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "", date: "", userId: "" });
  const [formUser, setFormUser] = useState({});
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (!savedToken) window.location.href = "/";
    setToken(savedToken);
    setRole(savedRole);
    fetchExpenses(savedToken, filterDate);
    if (savedRole === "admin") fetchUsers(savedToken);
  }, [filterDate]);


  const fetchExpenses = async (token, date) => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/expenses`;
      if (date) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        url += `?month=${month}&year=${year}`;
      }
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }finally{
      setLoading(false);
    }
  };

  const fetchUsers = async (token) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const createUser = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth`, formUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(token);
      setFormUser({});
      setOpenUserModal(false);
      alert("User created successfully!");
    } catch (err) {
      console.error("Failed to create user:", err);
    }finally{
    }
  };

  const addExpense = async () => {
    try {
      if (editExpense) {
        await axios.put(`${API_BASE_URL}/expenses/${editExpense._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Expense updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/expenses`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Expense added successfully!");
      }
      fetchExpenses(token, filterDate);
      setForm({ title: "", amount: "", category: "", date: "", userId: "" });
      setEditExpense(null);
      setOpenExpenseModal(false);
    } catch (err) {
      console.error("Failed to save expense:", err);
    }finally{
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Expense deleted successfully!");
      fetchExpenses(token, filterDate);
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
  const categoryTotals = CATEGORIES.map((cat) => ({
    name: cat,
    value: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  })).filter((item) => item.value > 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <Box p={3} bgcolor="#f9fafc" minHeight="100vh">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <AppLogo />
        <TopBar onLogout={handleLogout} />
      </Stack>
      {loading ? 
      <Loader/>
      :
      <>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            mb={3}
            alignItems="center"
            justifyContent="space-between"
          >
          {role === "admin" && (
            <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddAltIcon />}
                  onClick={() => setOpenUserModal(true)}
                >
                  Create User
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setOpenExpenseModal(true)}
                >
                  Add Expense
                </Button>
              </Stack>
              )}

            <Box sx={{ minWidth: 220 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={["year", "month"]}
                  label="Filter by Month"
                  value={filterDate}
                  onChange={(newValue) => setFilterDate(newValue)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider>
            </Box>
          </Stack>

          {role === "admin" && (
            <Card sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                <CategoryIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Expense Breakdown by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryTotals} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                    {categoryTotals.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Expense List
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    {role === "admin" && <TableCell>User</TableCell>}
                    {role === "admin" && <TableCell>Email</TableCell>}
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    {role === "admin" && <TableCell align="center">Action</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((e) => (
                    <TableRow key={e._id}>
                      {role === "admin" && (
                        <>
                          <TableCell>{e.user?.name || "-"}</TableCell>
                          <TableCell>{e.user?.email || "-"}</TableCell>
                        </>
                      )}
                      <TableCell>{e.title}</TableCell>
                      <TableCell>{e.category}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>₹{e.amount}</TableCell>
                      <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                      {role === "admin" && (
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setEditExpense(e);
                              setOpenExpenseModal(true);
                              setForm({
                                title: e.title,
                                amount: e.amount,
                                category: e.category,
                                date: e.date.split("T")[0],
                                userId: e.user?._id || "",
                              });
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteExpense(e._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
      </>
      }

      <CommonModal
        open={openUserModal}
        onClose={() => setOpenUserModal(false)}
        title="Create New User"
        onSubmit={createUser}
        submitLabel="Create"
      >
        <TextField
          label="Name"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={formUser.name || ""}
          onChange={(e) => setFormUser({ ...formUser, name: e.target.value })}
        />
        <TextField
          label="Email"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={formUser.email || ""}
          onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={formUser.password || ""}
          onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
        />
        <FormControl fullWidth size="small">
          <InputLabel>Role</InputLabel>
          <Select
            value={formUser.role || "user"}
            onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </CommonModal>

      <CommonModal
        open={openExpenseModal}
        onClose={() => {
          setOpenExpenseModal(false);
          setEditExpense(null);
        }}
        title={editExpense ? "Edit Expense" : "Add New Expense"}
        onSubmit={addExpense}
        submitLabel={editExpense ? "Update" : "Add"}
      >
        <Grid container spacing={2}>
          {role === "admin" && (
            <Grid item size={12}>
              <FormControl fullWidth size="small">
                <InputLabel>User</InputLabel>
                <Select
                  value={form.userId || ""}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                >
                  {users.map((u) => (
                    <MenuItem key={u._id} value={u._id}>
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item size={12}>
            <TextField
              label="Title"
              fullWidth
              size="small"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Grid>
          <Grid item size={12}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              size="small"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </Grid>
          <Grid item size={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item size={12}>
            <TextField
              type="date"
              fullWidth
              size="small"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Grid>
        </Grid>
      </CommonModal>
    </Box>
  );
}
