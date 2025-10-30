import mongoose from "mongoose";
const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },    
    title: {
    type: String,
    required: true,
    },
    amount: {
    type: Number,
    required: true,
    },
    category: {
    type: String,   
    required: true,
    },
    date: { 
    type: Date,
    required: true,
    },  
}, { timestamps: true });

const Expense = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
export default Expense; 
