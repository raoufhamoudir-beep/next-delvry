const  states  = require("../../states.json");

const formatToEcomDelivery = (order) => {
  // 1. معالجة منطق المكتب/المنزل
  // عندك: home = true (منزل)
  // عندهم: Stopdesk = 0 (منزل)، Stopdesk = 1 (مكتب)
  // المعادلة: إذا كان منزل (true) نضع 0، والعكس
  const isStopDesk = order.home ? 0 : 1;

  // 2. استخراج اسم المنتج
  // بما أن item عندك هو object، سنحاول جلب الاسم منه
  const articleName = order.item?.name || order.item?.title || "Product";
const getstatenumber = (s)=>{
    return states.find(e=> e.name == s ).code
}
  // 3. بناء الكائن حسب وثيقتهم
  return {
    "Colis": [
      {
        "Echange": 0, // افتراضي
        "Stopdesk": isStopDesk,
        "NomComplet": order.name,
        "Mobile_1": order.phone,
        "Mobile_2": "", 
        "Adresse": `${order.city || ''} - ${order.state || ''}`, // دمجنا الولاية والبلدية كعنوان
        "Wilaya": getstatenumber(order.state), // تأكد أنه يخزن الرقم "16" وليس الاسم
        "Commune": order.city, // أو استخدم ID إذا توفر لديك
        "Article": articleName,
        "Ref_Article": `QTY:${order.quantity}`,
        "NoteFournisseur": order.not || "",
        "Total": String(order.total), // تحويل الرقم لنص
        "ID_Externe": String(order._id), // أهم حقل للربط
        "Source": "WebSite"
      }
    ]
  };
};

module.exports = formatToEcomDelivery