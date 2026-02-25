const states = require("../../states.json");

const formatTonoest = (order) => {
  // 1. معالجة منطق المكتب/المنزل
  // عندك: home = true (منزل)
  // عندهم: Stopdesk = 0 (منزل)، Stopdesk = 1 (مكتب)
  // المعادلة: إذا كان منزل (true) نضع 0، والعكس
  const isStopDesk = order.home ? 0 : 1;

  // 2. استخراج اسم المنتج
  // بما أن productData عندك هو object، سنحاول جلب الاسم منه
  const articleName = order.productData?.name || order.productData?.title || "Product";
  const getstatenumber = (s) => {
    return states.find(e => e.ar_name == s || e.name == s).code
  }
  // 3. بناء الكائن حسب وثيقتهم
  return {
     
  client: order.name,             // اسم الزبون [cite: 18, 27]
  phone: order.phone,               // رقم الهاتف (9-10 أرقام) [cite: 21, 28]
  adresse:  `${order.city || ''} - ${order.state || ''}`, // دمجنا الولاية والبلدية كعنوان
  wilaya_id: getstatenumber(order.state),                     // معرف الولاية (مثلاً 16 للجزائر) [cite: 21, 31]
  commune: order.city,            // البلدية [cite: 21, 34]
  montant:  order.total ,                     // مبلغ الطلبية [cite: 21, 35]
  produit: articleName, // اسم المنتج [cite: 21, 36]
  type_id: 1,                        // نوع التوصيل (1 = توصيل للمنزل) [cite: 21, 37]
  stop_desk: isStopDesk,                      // 0 للمنزل، 1 للمكتب [cite: 21, 39]
       
  };
};

module.exports = formatTonoest