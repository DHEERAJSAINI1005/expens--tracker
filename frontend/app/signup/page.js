"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { API_BASE_URL } from "../constants/constant";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, form);
      router.push("/login");
    } catch (err) {
      setError("Signup failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #673ab7, #3f51b5, #2196f3)",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={1} color="primary">
            Create Account
          </Typography>
          <TextField
            label="Full Name"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              fontWeight: 600,
              borderRadius: 2,
              background: "linear-gradient(to right, #3f51b5, #2196f3)",
            }}
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>

          <Typography variant="body2" color="text.secondary" mt={3}>
            Already have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => router.push("/")}
              sx={{ color: "primary.main", fontWeight: 600 }}
            >
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
