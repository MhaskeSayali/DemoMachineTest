var db = require('./dbConnect');
var pool = db.getPool();
const STR_TAG_MODULE_OR_CLASS = "clientDBOperations.js";

module.exports = {
    
    dbSaveCategoryInformation: function(req, res) {

        const STR_TAG_FUNC = "dbSaveCategoryInformation";

        let strMsg = '';
        let reqBody = req.body;

        if( reqBody == null || 
            ("categoryName" in reqBody) == false || 
            reqBody.categoryName == null || reqBody.categoryName.length <= 0 ||
            ("FormViewMode" in reqBody) == false || 
            reqBody.FormViewMode == null || reqBody.FormViewMode.length <= 0
        ) {
            strMsg = `Request JSON missing or does not contain categoryName/FormViewMode.`;  
            res.send({code: 'REQ_PARAMS_MISSING', failuremessage: strMsg});
            console.error(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg);
            return; // No further processing required
        }
        
        let CategoryType = reqBody["categoryName"];
        let FormViewMode = reqBody["FormViewMode"];
        let categoryDiscription = (reqBody["categoryDiscription"] == null || reqBody["categoryDiscription"].length <= 0) 
                                    ? null 
                                    : "'" +reqBody["categoryDiscription"] +"'";
        let CategoryID = (reqBody["CategoryID"] == null || reqBody["CategoryID"].length <= 0) ? null : reqBody["CategoryID"];

        let sqlQuery;

        if(FormViewMode != null && FormViewMode.length > 0 && FormViewMode == "deleteMode") {

            sqlQuery = `delete from Categories where CategoryID = '${CategoryID}'`;

        } else if(FormViewMode != null && FormViewMode.length > 0 && FormViewMode == "editMode") {

            sqlQuery = `update Categories 
                        set CategoryType = '${CategoryType}',
                        Discription = ${categoryDiscription},
                        LastModifiedTime = DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-%d %H:%i:%S')
                        where CategoryID = '${CategoryID}'`;
        } else {

            sqlQuery = `insert into Categories (CategoryID, CategoryType, Discription, LastModifiedTime)
                                values(UUID_SHORT(), '${CategoryType}', ${categoryDiscription}, DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-%d %H:%i:%S'))`;
        }


        pool.query(sqlQuery, function(err, result) {
            if(err) {
                if(err['code'] == 'ER_DUP_ENTRY') {
                    strMsg = `SQL Error while saving category information.`;
                    res.send({code: 'CATEGORY_NAME_ALREADY_EXIST', failuremessage: strMsg, sqlerrcode: err.code, errno: err.errno});
                    console.error(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg, err);
                    return; // No further processing required

                } else {
                    strMsg = `SQL Error while saving category information.`;
                    res.send({code: 'SQL_ERROR', failuremessage: strMsg, sqlerrcode: err.code, errno: err.errno});
                    console.error(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg, err);
                    return; // No further processing required
                }
            } else {
                let strMsg = `Success while saving category information.`;
                res.send({code: 'SUCCESS', successmessage: strMsg});
                console.log(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg);
                return; // No further processing required
            }
        })
    },

    dbInsertOrUpdateProductInfo: function(req, res) {

        const STR_TAG_FUNC = "dbInsertOrUpdateProductInfo";

        let strMsg = '';
        let reqBody = req.body;

        if( reqBody == null || 
            ("productName" in reqBody) == false || 
            reqBody.productName == null || reqBody.productName.length <= 0 ||
            ("categoryId" in reqBody) == false || 
            reqBody.categoryId == null || reqBody.categoryId.length <= 0 ||
            ("formViewMode" in reqBody) == false || 
            reqBody.formViewMode == null || reqBody.formViewMode.length <= 0

        ) {
            strMsg = `Request JSON missing or does not contain productName/categoryId/formViewMode.`;  
            res.send({code: 'REQ_PARAMS_MISSING', failuremessage: strMsg});
            console.error(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg);
            return; // No further processing required
        }

        let productId = (reqBody["productId"] == null || reqBody["productId"].length <= 0) ? null : reqBody["productId"];
        let productName = reqBody["productName"];
        let categoryId = reqBody["categoryId"];
        let formViewMode = reqBody["formViewMode"];

        let sqlQuery = ``;

        if(formViewMode != null && formViewMode == "editMode") {
            sqlQuery = `update Products
                                set ProductName = '${productName}',
                                CategoryID = '${categoryId}',
                                LastModifiedTime = DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-%d %H:%i:%S')
                                where ProductID = '${productId}'`;

        } else if( formViewMode != null && formViewMode == "deleteMode"){
            sqlQuery = `delete  from Products where ProductID = '${productId}';`
            
        } else {
            sqlQuery = `insert into Products (ProductID, ProductName, CategoryID, LastModifiedTime)
                                values(UUID_SHORT(), '${productName}', '${categoryId}', DATE_FORMAT(UTC_TIMESTAMP(), '%Y-%m-%d %H:%i:%S'))`;
        }
        
        pool.query(sqlQuery, function(err, result) {
            if(err) {
                if(err['code'] == 'ER_DUP_ENTRY') {
                    strMsg = `SQL Error while saving product information.`;
                    res.send({code: 'PRODUCT_ALREADY_EXIST', failuremessage: strMsg, sqlerrcode: err.code, errno: err.errno});
                    console.error(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg, err);
                    return; // No further processing required
                } else {
                    strMsg = `SQL Error while saving product information.`;
                    res.send({code: 'SQL_ERROR', failuremessage: strMsg, sqlerrcode: err.code, errno: err.errno});
                    console.error(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg, err);
                    return; // No further processing required
                }

            } else {
                let strMsg = `Success while saving product information.`;
                res.send({code: 'SUCCESS', successmessage: strMsg});
                console.log(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg);
                return; // No further processing required
            }
        })
    },

    dbGetAllCategoriesInformation: function(req, res) {

        const STR_TAG_FUNC = "dbGetAllCategoriesInformation";

        let strMsg = '';

        const sqlQuery = `select CategoryID, CategoryType from Categories`;
        
        pool.query(sqlQuery, function(err, result) {
            if(err) {
                strMsg = `SQL Error while getting categories information.`;
                res.send({code: 'SQL_ERROR', failuremessage: strMsg, sqlerrcode: err.code, errno: err.errno});
                console.error(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg, err);
                return; // No further processing required
            } else {
                let strMsg = `Success while getting categories information.`;
                res.send({code: 'SUCCESS', successmessage: strMsg, retrievedAllCategoriesInfo: result});
                console.log(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg);
                return; // No further processing required
            }
        })
    },

    dbGetProductDetails: function(req, res) {

        const STR_TAG_FUNC = "dbGetProductDetails";

        let strMsg = '';
        let reqBody = req.body;

        if( reqBody == null || 
            ("retriveRowsLimit" in reqBody) == false || 
            reqBody.retriveRowsLimit == null || reqBody.retriveRowsLimit.length <= 0 ||
            ("offSet" in reqBody) == false || 
            reqBody.offSet == null || reqBody.offSet.length <= 0 
        ) {
            strMsg = `Request JSON missing or does not contain retriveRowsLimit/offSet.`;  
            res.send({code: 'REQ_PARAMS_MISSING', failuremessage: strMsg});
            console.error(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg);
            return; // No further processing required
        }

        let retriveRowsLimit = reqBody["retriveRowsLimit"];
        let offSet = reqBody["offSet"];

        let sqlQuery = `SELECT p.ProductID, p.ProductName, p.CategoryID, p.LastModifiedTime, c.CategoryType 
                        FROM Products p, Categories c
                        WHERE p.CategoryID = c.CategoryID
                        LIMIT ${retriveRowsLimit} OFFSET ${offSet};`;
        
        pool.query(sqlQuery, function(err, result) {
            if(err) {
                strMsg = `SQL Error while getting product information.`;
                res.send({code: 'SQL_ERROR', failuremessage: strMsg, sqlerrcode: err.code, errno: err.errno});
                console.error(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg, err);
                return; // No further processing required
            } else {
                let strMsg = `Success while getting product information.`;
                res.send({code: 'SUCCESS', successmessage: strMsg, retrivedProductDetails: result});
                console.log(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg);
                return; // No further processing required
            }
        })
    },

    dbGetCategoryInformation: function(req, res) {

        const STR_TAG_FUNC = "dbGetCategoryInformation";

        let strMsg = '';

        let sqlQuery = `select * from Categories`;
        
        pool.query(sqlQuery, function(err, result) {
            if(err) {
                strMsg = `SQL Error while getting Categories information.`;
                res.send({code: 'SQL_ERROR', failuremessage: strMsg, sqlerrcode: err.code, errno: err.errno});
                console.error(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg, err);
                return; // No further processing required
            } else {
                let strMsg = `Success while getting Categories information.`;
                res.send({code: 'SUCCESS', successmessage: strMsg, retrivedCategoriesDetails: result});
                console.log(STR_TAG_MODULE_OR_CLASS, STR_TAG_FUNC, strMsg);
                return; // No further processing required
            }
        })
    },
};