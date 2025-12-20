// import { formatToYalidine } from './yalidine.js';

 const getapi = ( provider) => {
  switch (provider) {
    // case 'zr_express':
    case 'ecom_delivery':
      return 'https://ecom-dz.net/Api_v1'
    // case 'yalidine':
    //   return formatToYalidine(order);
    default:
      throw new Error('Unknown Provider');
  }
};

module.exports = getapi