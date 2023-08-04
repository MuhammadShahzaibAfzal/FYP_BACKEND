const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConfig = require("./services/dbConfig");
const errorHandlingMiddleware = require("./middlewares/error-handler-middleware");
const categoryRouter = require("./routes/category-routes");
const path = require("path");
const almirahRouter = require("./routes/almirah-routes");
const bookRouter = require("./routes/book-routes");
const batchRouter = require("./routes/batch-routes");
const departmentRouter = require("./routes/departement-routes");
const studentRouter = require("./routes/student-routes");
const teacherRouter = require("./routes/teacher-routes");
const transactionRouter = require("./routes/transaction-routes");
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth-routes");
const adminMiddleware = require("./middlewares/admin-middleware");
const authMiddleware = require("./middlewares/auth-middleware");
// configure environment variables
dotenv.config();
const PORT = process.env.PORT || 5001;

// Database Connectivity
dbConfig();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Global variable
global.appRoot = path.resolve(__dirname);
// Middleware
app.use(express.json());
// Routes
app.use("/api/categories/",categoryRouter);
app.use("/api/almirahs/",authMiddleware,adminMiddleware,almirahRouter);
app.use("/api/books/",bookRouter);
app.use("/api/batches/",authMiddleware,adminMiddleware,batchRouter);
app.use("/api/departements/",authMiddleware,adminMiddleware,departmentRouter);
app.use("/api/students/",studentRouter);
app.use("/api/teachers/",teacherRouter);
// app.use("/api/transactions",transactionRouter);
app.use('/api/auth/',authRouter);

// Error Handler Middleware
app.use(errorHandlingMiddleware);
app.listen(PORT,()=>{
    console.log(`Server is listning on PORT ${PORT}`)
})