var clientDBOp = require('../db/clientDBOperations');


exports.wSaveCategoryInformation = function(req,res){
    clientDBOp.dbSaveCategoryInformation(req,res);
};

exports.wInsertOrUpdateProductInfo = function(req,res){
    clientDBOp.dbInsertOrUpdateProductInfo(req,res);
};

exports.wGetAllCategoriesInformation = function(req,res){
    clientDBOp.dbGetAllCategoriesInformation(req,res);
};

exports.wGetProductDetails = function(req,res){
    clientDBOp.dbGetProductDetails(req,res);
};



