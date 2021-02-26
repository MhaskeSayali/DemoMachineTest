const wroutes = require('express').Router();
const wfrontcontroller = require('../frontcontrollers/wfrontcontroller');


wroutes.post('/wclient/saveCategoryInformation', wfrontcontroller.wSaveCategoryInformation);
wroutes.post('/wclient/insertOrUpdateProductInfo', wfrontcontroller.wInsertOrUpdateProductInfo);
wroutes.post('/wclient/getAllCategoriesInformation', wfrontcontroller.wGetAllCategoriesInformation);
wroutes.post('/wclient/getProductDetails', wfrontcontroller.wGetProductDetails);
wroutes.post('/wclient/getCategoryInformation', wfrontcontroller.wGetCategoryInformation);


module.exports = wroutes;
