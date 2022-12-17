const express = require('express');

const app = express();

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');




//the routes
const authRoute = require("./middlewares/auth.js");
const userRoute = require("./routes/users.route");
const postRoute = require("./routes/posts.route");
const catRoute = require("./routes/categories.route");
const { application } = require('express');

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Connected to DB")).catch(err=>console.log(err));


//storaging

const storage = multer.diskStorage({
    destination: (req,file,cb)  => {
        cb(null, "images");
    },filename: (req, file,cb) => {
        cb(null, req.body.name);
    }
});

const upload = multer({storage: storage});

app.post("/api/upload" , upload.single("file"), (req,res) => {
    res.status(200).json("File has been uploaded");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/categories",catRoute);

app.get("/" , (req,res) =>{
    res.status(200).send({
        message: "The Application is Running, hit /api/v1/posts to see Data"
    })
});

app.use(cors());

const PORT = 8080;
app.listen(PORT, ()=> {
    console.log(`The server is running at http://localhost:${PORT}`);
});