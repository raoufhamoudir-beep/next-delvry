const express = require('express')
const cors = require('cors')
const { default: axios } = require('axios');
const getapi = require('./lib/getapi/getapi');
const transformOrderForProvider = require('./lib/shipping/mappers')
const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("hello")
})


app.post("/listen", async (req, res) => {
    const { company } = req.body
    try {

        // 1. Updated URL to /Colis (Make sure this endpoint supports GET without parameters)
        const result = await axios.get(`${getapi(company.name)}/Colis`, {
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


const myNewOrder = {
  client: "Ahmed Ahmed",             // اسم الزبون [cite: 18, 27]
  phone: "0550505050",               // رقم الهاتف (9-10 أرقام) [cite: 21, 28]
  adresse: "Rue des Martyrs, Bab Ezzouar", // العنوان [cite: 21, 30]
  wilaya_id: 16,                     // معرف الولاية (مثلاً 16 للجزائر) [cite: 21, 31]
  commune: "El Harrach",            // البلدية [cite: 21, 34]
  montant: 3500,                     // مبلغ الطلبية [cite: 21, 35]
  produit: "Smartphone Samsung Galaxy", // اسم المنتج [cite: 21, 36]
  type_id: 1,                        // نوع التوصيل (1 = توصيل للمنزل) [cite: 21, 37]
  stop_desk: 0,                      // 0 للمنزل، 1 للمكتب [cite: 21, 39]
  reference: "REF12345"              // مرجع اختياري [cite: 18, 26]
};

// تنفيذ الإرسال
 

app.post("/test", async (req, res) => {
    const { company } = req.body
    try {
        let result;
        if (company.name === "ecom_delivery") {
            result = await axios.get(`${getapi(company.name)}/Test`, {
                headers: {
                    // 2. FIXED: Capitalized 'Token' and 'Key' to match documentation
                    "Token": company.Token,
                    "Key": company.Key,
                    // 3. ADDED: Good practice to explicitly ask for JSON
                    "Accept": "application/json"
                }
            },
            );
        } else if (company.name === "swift_express") {
            result = await axios.get(`https://swift.ecotrack.dz/api/v1/validate/token?api_token=${company.Token}`)
        } else if (company.name === "noas express"){
             result =await axios.post(
      `https://app.noest-dz.com/api/public/create/order`, 
      {
        user_guid:company.Key, // المعلمة المطلوبة دائماً [cite: 18]
        ...myNewOrder // باقي تفاصيل الطلبية (الاسم، الهاتف، العنوان...)
      },
      {
        headers: {
          'Authorization': `Bearer ${company.Token }`, // التوثيق عبر الهيدر [cite: 6, 15]
          'Content-Type': 'application/json'      // نوع المحتوى [cite: 16]
        }
      }
    );
        }



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
    const { company, order } = req.body

    const finalorder = transformOrderForProvider(order, company.name)
    console.log(finalorder);

    try {
        let result;
        if (company.name === "ecom_delivery") {
            result = await axios.post(`${getapi(company.name)}/Colis`, finalorder, {
                headers: {
                    "Token": company.Token,
                    "Key": company.Key,
                    "Accept": "application/json"
                }
            },
            );
        } else if (company.name === "swift_express") {
            result = await axios.post(`https://swift.ecotrack.dz/api/v1/create/order?api_token=${company.Token}&${finalorder}`)
        } else if (company.name === "noas express"){
             result =await axios.post(
      `https://app.noest-dz.com/api/public/create/order`, 
      {
        user_guid:company.Key, // المعلمة المطلوبة دائماً [cite: 18]
        ...finalorder // باقي تفاصيل الطلبية (الاسم، الهاتف، العنوان...)
      },
      {
        headers: {
          'Authorization': `Bearer ${company.Token }`, // التوثيق عبر الهيدر [cite: 6, 15]
          'Content-Type': 'application/json'      // نوع المحتوى [cite: 16]
        }
      }
    );
        }


        console.log("API Response:", result.data);
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
// mongodb+srv://nextcommercehelp_db_user:tYMjafBuI8TXteJL@cluster0.sgrxnb2.mongodb.net/?appName=Cluster0



app.listen(3010, () => console.log("✅ Server running on port 3010."));

