const etat = require("../../algeria_cities.json");
const states = require("../../states.json");

const formatToswift = (order) => {

    const isStopDesk = order.home ? 0 : 1;

    // 1. Get Product Name safely

    // 2. Helper to get Wilaya Code
    const getstatenumber = (s) => {
        const stateObj = states.find(e => e.ar_name == s || e.name == s);
        return stateObj ? stateObj.code : "";
    };
    console.log(getstatenumber(order.state));

    const wilayaCode = getstatenumber(order.state);
    const foundCity = etat.find(e => e.commune_name == order.city || e.commune_name_ascii == order.city);
    const city = foundCity ? foundCity.commune_name_ascii : "baraki";
    // 3. Use URLSearchParams to handle spaces and special characters automatically
    const params = new URLSearchParams();
    params.append("nom_client", String(order.name));
    params.append("telephone", order.phone);
    params.append("telephone_2", "");
    params.append("adresse", `${city || ''}`);
    params.append("code_postal", "");
    params.append("produit", order.item.name || "Products");
    params.append("commune", String(city)); // This will auto-convert "Bir El Djir" to "Bir+El+Djir"
    params.append("code_wilaya", wilayaCode);
    params.append("montant", order.total);
    params.append("remarque", order.not || "");
    params.append("type", "1");
    params.append("stop_desk", isStopDesk);
    console.log(params.toString());

    return params.toString();
};

module.exports = formatToswift;