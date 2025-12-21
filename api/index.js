const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { default: axios } = require('axios');
const getapi = require('./lib/getapi/getapi');
const transformOrderForProvider = require('./lib/shipping/mappers')
const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send("hello")
})


app.post("/listen", async (req, res) => {
    const {company}  = req.body
    try {
        
        // 1. Updated URL to /Colis (Make sure this endpoint supports GET without parameters)
        const result = await axios.get(`${getapi(company.name)}/Colis`,  {
            headers: {
                // 2. FIXED: Capitalized 'Token' and 'Key' to match documentation
                "Token": company.Token,
                "Key": company.Key,
                // 3. ADDED: Good practice to explicitly ask for JSON
                "Accept": "application/json"
            }
        },
    );

        console.log("API Response:", result.data);

        // 4. FIXED: Send result.data, not the whole result object
res.json({
    result: result.data, // خذ البيانات فقط
   good: true
});
    } catch (error) {
        // Improved error logging to see exactly what failed
        if (error.response) {
            console.log("Server Error:", error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.log("Connection Error:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
})


app.post("/test", async (req, res) => {
    const {company}  = req.body
    try {
        console.log(getapi(company.name));
        
        // 1. Updated URL to /Colis (Make sure this endpoint supports GET without parameters)
        const result = await axios.get(`${getapi(company.name)}/Test`,  {
            headers: {
                // 2. FIXED: Capitalized 'Token' and 'Key' to match documentation
                "Token": company.Token,
                "Key": company.Key,
                // 3. ADDED: Good practice to explicitly ask for JSON
                "Accept": "application/json"
            }
        },
    );

        console.log("API Response:", result.data);
res.json({
    result: result.data, // خذ البيانات فقط
   good: true
});
        // 4. FIXED: Send result.data, not the whole result object

    } catch (error) {
        // Improved error logging to see exactly what failed
        if (error.response) {
            console.log("Server Error:", error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.log("Connection Error:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
})


app.post("/send-order", async (req, res) => {
    const {company, order}  = req.body
            console.log(company, order);

    const finalorder = transformOrderForProvider(order, company.name)
            console.log(company, order, "zbi);
         
    try {
        console.log(getapi(company.name));
        
        // 1. Updated URL to /Colis (Make sure this endpoint supports GET without parameters)
        const result = await axios.post(`${getapi(company.name)}/Colis`,finalorder,  {
            headers: {
                // 2. FIXED: Capitalized 'Token' and 'Key' to match documentation
                "Token": company.Token,
                "Key": company.Key,
                // 3. ADDED: Good practice to explicitly ask for JSON
                "Accept": "application/json"
            }
        },
    );

        // console.log("API Response:", result.data);

        // 4. FIXED: Send result.data, not the whole result object
res.json({
    result: result.data, // خذ البيانات فقط
   good: true
});
    } catch (error) {
        // Improved error logging to see exactly what failed
        if (error.response) {
            console.log("Server Error:", error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.log("Connection Error:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
})

mongoose.connect("mongodb+srv://nextcommercehelp_db_user:tYMjafBuI8TXteJL@cluster0.sgrxnb2.mongodb.net/?appName=Cluster0")
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(3010, () => console.log("✅ Server running on port 3010."));
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);

    });
