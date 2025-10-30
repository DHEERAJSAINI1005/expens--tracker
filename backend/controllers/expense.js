import Expense from "../models/Expense.js";

export const createExpense = async (req, res) => {
  const { title, amount, category, date, userId } = req.body;
  try {
    const expense = new Expense({
      user: userId || req.user._id,
      title,
      amount,
      category,
      date,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }

    let expenses;
    if (req.user.role === "admin") {
      expenses = await Expense.find(filter)
        .populate("user", "name email")
        .sort({ date: -1 });
    } else {
      expenses = await Expense.find({ ...filter, user: req.user._id }).sort({ date: -1 });
    }

    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateExpense = async (req, res) => {
  const { title, amount, category, date, userId } = req.body;
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (
      req.user.role !== "admin" &&
      expense.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    expense.title = title;
    expense.amount = amount;
    expense.category = category;
    expense.date = date;

    if (req.user.role === "admin" && userId) expense.user = userId;

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (
      req.user.role !== "admin" &&
      expense.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Server error" });
  }
};
