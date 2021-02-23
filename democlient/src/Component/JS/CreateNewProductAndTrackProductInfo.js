import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import { getAPIHostURL } from '../../ClientConfig';
import { FaSearch, FaEdit, FaTrash} from 'react-icons/fa';
import { Modal, ModalHeader, ModalBody} from 'reactstrap';
import 'react-table/react-table.css';
import '../CSS/ProductPage.css';


export class CreateNewProductAndTrackProductInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            backdrop: 'static',
            productname: "",
            CategoryType: "",
            ArrCategoryInfo: [],
            selectedCategory: "",
            CategoryID: "",
            offSet: 0,
            ProductID: "",
            LastModifiedUtcDtTmOfReceivedProductData: "",
            formViewMode: "",
            selectedRowIndex: null,
            page: 0,

            selectedProductInfo: {},
            
            errors: { 
                productname: "",
                CategoryType: "",
                others: "",
            },
            data: [],

            columns: [
                {       
                    Header:() => <div className="ProductTableHeader">Selected</div>,  
                    accessor: "",
                    show: false,
                    Cell: ( rowInfo ) => {
                        return (
                            <input
                                type = "radio"
                                name = "selectedRowIndicator"
                                id = "indicatingSelectedRow"
                                className = "selectedRadioBtn"
                                checked={this.state.selectedRowIndex == rowInfo.index ? true : false }
                            />
                        );
                    },
                    Filter:({filter, onChange}) => {
                        return(
                            <div>
                                <input style={{ display:"none"}} />
                            </div>
                        )
                    },
                    style:({
                        textAlign: "center",
                        paddingLeft: "1rem"
        
                    }),
                },
                {   
                    Header:() => <div className="ProductTableHeader">Delete</div>, 
                    accessor: "delete",
                    style:({
                        textAlign: "center",
                        verticalAlign: "middle",
                        paddingLeft: "1rem"
        
                    }),
                    getProps: (state, rowInfo, column) => {
                        return {
                            onClick: () => this.onDeleteProductDetails(rowInfo, column),
                            style: {
                                color: "black",
                            },
                        };
                    },
                    Filter:() => {
                        return(
                            <div>
                                <input style={{ display:"none"}} />
                            </div>
                        )
                    },
                    Cell:  props => <span className='deviceNameCell' delete={props.original.delete}>{props.value}</span>
                },
                {   
                    Header:() => <div className="ProductTableHeader">Edit</div>, 
                    accessor: "edit",
                    style:({
                        textAlign: "center",
                        verticalAlign: "middle",
                        paddingLeft: "1rem"
        
                    }),
                    getProps: (state, rowInfo, column) => {
                        return {
                            onClick: () => this.oneditProductDetails(rowInfo, column),
                            style: {
                                color: "black",
                            },
                        };
                    },
                    Filter:() => {
                        return(
                            <div>
                                <input style={{ display:"none"}} />
                            </div>
                        )
                    },
                    Cell:  props => <span className='deviceNameCell' edit={props.original.edit}>{props.value}</span>
                },
                
                {       
                    Header:() => <div className="ProductTableHeader">Product ID</div>,  
                    accessor: 'ProductID',
                    Filter: this.createProductDataFilter,
                    style:({
                        textAlign: "left",
                        paddingLeft: "1rem"
        
                    }),
                },
                {       
                    Header:() => <div className="ProductTableHeader">Product Name</div>,  
                    accessor: 'productname',
                    Filter: this.createProductDataFilter,
                    style:({
                        textAlign: "left",
                        paddingLeft: "1rem",
                    }),
                },
                {       
                    Header:() => <div className="ProductTableHeader">Category Name</div>,  
                    accessor: 'CategoryType',
                    Filter: this.createProductDataFilter,
                    style:({
                        textAlign:"left",
                        paddingLeft: "1rem",

                    }),
                },
                {       
                    Header:() => <div className="ProductTableHeader">Category ID</div>,  
                    accessor: 'CategoryID',
                    Filter: this.createProductDataFilter,
                    style:({
                        textAlign:"left",
                        paddingLeft: "1rem"
                    }),
                },                        
            ],     
        }
    }

    oneditProductDetails = (rowInfo, column) => {
        let modifiedState = this.state;
        modifiedState.formViewMode = "editMode";

        modifiedState.productname = rowInfo.original.productname;
        modifiedState.selectedCategory = rowInfo.original.CategoryType;
        modifiedState.ProductID = rowInfo.original.ProductID;
        modifiedState.CategoryID = rowInfo.original.CategoryID
        console.log(rowInfo.original);

        modifiedState.modal = true;
        this.setState(modifiedState);
    }

    onDeleteProductDetails = (rowInfo, column) => {

        let modifiedState = this.state;
        modifiedState.formViewMode = "deleteMode";

        modifiedState.productname = rowInfo.original.productname;
        modifiedState.selectedCategory = rowInfo.original.CategoryType;
        modifiedState.ProductID = rowInfo.original.ProductID;
        modifiedState.CategoryID = rowInfo.original.CategoryID
        console.log(rowInfo.original);

        modifiedState.modal = true;
        this.setState(modifiedState);

    }

    createProductDataFilter = ({filter, onChange}) => {
        let appRelevantDataContextValue = this.context;
        let t = appRelevantDataContextValue.t;
        return(
            <div>
                <FaSearch style={{marginRight:"0.3rem",color:"var(--secondaryColor)"}}/>
                <input
                    onChange={event => onChange(event.target.value)}
                    value={filter ? filter.value : ''}
                    placeholder="Search"
                    style={{width: "85%"}}
                />
            </div>
        );
    }

    //putting the flag formViewMode to Insert Mode(Create new Product)
    //toggling the product create form. 
    toggle = () => {
        this.setState(prevState => {
            let modifiedState = prevState;
            modifiedState.modal = !modifiedState.modal
            modifiedState.ProductID = "";
            modifiedState.productname = "";
            modifiedState.CategoryType = "";
            modifiedState.formViewMode = "insertMode";
            modifiedState.CategoryID = "";

            return modifiedState
        });
    }

    closeModal = () => {
        this.toggle();
    }

    componentDidMount () {
        
        this.getLatestProductInfo();
        this.getAllCategoriesInformation();
    }

    getAllCategoriesInformation = () => {

        let modifiedState = this.state;

        axios.post(`${getAPIHostURL()}/wclient/getAllCategoriesInformation`)
        .then(response => {
            if(response.data.code == 'SUCCESS') {    
                if(response.data.retrievedAllCategoriesInfo == null || response.data.retrievedAllCategoriesInfo.length <= 0 ){
                    modifiedState.errors.others = "Categories Information does not found on server";
                    this.setState(modifiedState);
                    return

                } else {
                    modifiedState.ArrCategoryInfo = [];
                    const receivedCategoryInfo = response.data.retrievedAllCategoriesInfo;
                    for(let j = 0; j < receivedCategoryInfo.length; j++){
                        modifiedState.ArrCategoryInfo.push(receivedCategoryInfo[j]);
                    }

                } 
                this.setState(modifiedState);
            } else {
                if(response.data.code == 'SQL_ERROR') {
                    // Tell the user that Server is experiencing errors
                    modifiedState.errors.others = 'Server experiencing issues.\nTry again later.';
                } else {
                    console.log('Should not reach here');
                    modifiedState.errors.others = 'Server experiencing issues.\nTry again later.';
                }
            }
            this.setState(modifiedState);
        })
        .catch(error => {
            console.log(error);
            console.log("Network error:");
            modifiedState.errors.others = 'Network issues.\nCheck your Internet and Try again later.';
            this.setState(modifiedState);
        })
    }

    getLatestProductInfo = (inModifiedState = null) => {
        
        let modifiedState;
        if(inModifiedState == null) {
            modifiedState = this.state;
        } else {
            modifiedState = inModifiedState;
        }

        let LastModifiedUtcDtTmForInsertOrUpdateProductDetails;

        if(modifiedState.formViewMode == "editMode" || modifiedState.formViewMode == "insertMode"){
            LastModifiedUtcDtTmForInsertOrUpdateProductDetails = modifiedState.LastModifiedUtcDtTmOfReceivedProductData;
        } else {
            LastModifiedUtcDtTmForInsertOrUpdateProductDetails = null;
        }

        const jsonBody = {
            retriveRowsLimit: 5, 
            offSet: modifiedState.offSet
        };
        axios.post(`${getAPIHostURL()}/wclient/getProductDetails`, jsonBody)
        .then(response => {
            
            if(response.data.code == 'SUCCESS') {   
                
                if(response.data.retrivedProductDetails == null || response.data.retrivedProductDetails.length <= 0){
                    console.log("No Product Data Found on server.")
                    this.setState(modifiedState);
                    return
                } else {
                    let stateProductDetailsArr = [];
                    console.log("modifiedState.formViewMode", modifiedState.formViewMode);

                    // React table checks using referential integrity. So if you do not create a
                    // new array (but just add to the existing array), the change detection will not trigger.
                    // So create a brand new array from existing product Details data.
                    stateProductDetailsArr = [...modifiedState.data]

                    const receivedProductDataArr = response.data.retrivedProductDetails;
                    let editIcon = <FaEdit className="viewAndEditIcon" title="Edit"/>
                    let deleteIcon = <FaTrash className="viewAndEditIcon" title="Delete"/>

                    for(let i = 0; i < receivedProductDataArr.length; i++) {
                        const ProductDetails = receivedProductDataArr[i];
                        let singleProductDetails = {
                            delete: deleteIcon,
                            edit: editIcon,
                            ProductID: ProductDetails.ProductID,
                            productname: ProductDetails.ProductName,
                            CategoryType: ProductDetails.CategoryType,
                            CategoryID: ProductDetails.CategoryID,
                        };

                        console.log("singleProductDetails", singleProductDetails);

                        //if form is open in insertMode(create new Product) then just add new retrieved data(new added Product details) at top of the Product table.
                        if(modifiedState.formViewMode == "insertMode"){
                            for(let j = 0; j < stateProductDetailsArr.length; j++){
                                if(stateProductDetailsArr[j].ProductID == singleProductDetails.ProductID){
                                    stateProductDetailsArr.splice(j, 1);
                                }
                            }
                            stateProductDetailsArr.unshift(singleProductDetails);
                            modifiedState.selectedRowIndex = 0;
                            modifiedState.page = 0;
                        }
                        //if form is open in editMode(edit existing Produc details) then compare all ProductID in Product table
                        //with retrieved ProductID after editing Product details. If both ProductID get match then remove the selected Product data
                        //from Product table, and add new retrived Product data at top of the Product table.
                        else if(modifiedState.formViewMode == "editMode"){
                            for(let j = 0; j < stateProductDetailsArr.length; j++){
                                if(stateProductDetailsArr[j].ProductID == singleProductDetails.ProductID){
                                    stateProductDetailsArr.splice(j, 1);
                                }
                            }
                            modifiedState.selectedRowIndex = 0;
                            modifiedState.page = 0;
                            stateProductDetailsArr.unshift(singleProductDetails);
                        }  
                        //on first time page load its will retrieved 1st 5 product details and add it in product table,
                        // in order of latest data on top of the product table.
                        else { 
                            stateProductDetailsArr.push(singleProductDetails);
                        }
                    } 
                    modifiedState.data = stateProductDetailsArr;
                }
            } else {
                if(response.data.code == 'SQL_ERROR') {
                    // Tell the user that Server is experiencing errors
                    modifiedState.errors.others = 'Server experiencing issues.\nTry again later.';
                } else {
                    console.log('Should not reach here');
                    modifiedState.errors.others = 'Server experiencing issues.\nTry again later.';
                }
            }
            this.setState(modifiedState);
        })
        .catch(error => {
            console.log(error);
            console.log("Network error:");
            modifiedState.errors.others = 'Network issues.\nCheck your Internet and Try again later.';
            this.setState(modifiedState);
        })
    }

    insertOrUpdateProductInfo = (event) => {
        
        let modifiedState = this.state;

        event.preventDefault();

            const jsonBody = {
                productId: modifiedState.ProductID,
                productName: modifiedState.productname, 
                categoryId: modifiedState.CategoryID, 
                formViewMode: modifiedState.formViewMode
            };
            console.log("jsonBody", jsonBody);

            axios.post(`${getAPIHostURL()}/wclient/insertOrUpdateProductInfo`, jsonBody)
            .then(response => {
                if(response.data.code == 'SUCCESS') {    
                    if(modifiedState.formViewMode == "editMode") {
                        alert(`Successfully Updated Product Details.`);
                        modifiedState.modal = false;
                        this.getLatestProductInfo(modifiedState)
                    } else if(modifiedState.formViewMode == "deleteMode") {
                        alert(`Successfully Deleted selected Product Details.`);

                        for(let i=0; i< modifiedState.data.length; i++) {
                            if(modifiedState.data[i]['ProductID'] == modifiedState.ProductID){
                                modifiedState.data.splice(i,1)
                            }
                        }
                        modifiedState.modal = false;
                        modifiedState.data = [...modifiedState.data];
                        this.setState(modifiedState);
                    } else {
                        alert(`Successfully Created New Product.`);
                        modifiedState.modal = false;
                        this.getLatestProductInfo(modifiedState)
                    }

                    
                } else {
                     if(response.data.code == 'SQL_ERROR') {
                        // Tell the user that Server is experiencing errors
                        modifiedState.errors.others = 'Server experiencing issues.\nTry again later.';
                    } else if(response.data.code == 'PRODUCT_ALREADY_EXIST'){
                        modifiedState.errors.others = "This Product already exists On the Server.";

                    } else if(response.data.code == 'REQ_PARAMS_MISSING'){
                        modifiedState.errors.others = "Server experiencing issues (required parameters not sent). Try again later.";
                    } else {
                        console.log('Should not reach here');
                        modifiedState.errors.others = 'Server experiencing issues.\nTry again later.';
                    }
                }
                this.setState(modifiedState);
            })
            .catch(error => {
                console.log(error);
                console.log("Network error:");
                modifiedState.errors.others = 'Network issues.\nCheck your Internet and Try again later.';
                this.setState(modifiedState);
            }); 
    }

    getSelectedTrProps = (state, rowInfo, column, instance) => {
        let modifiedState = this.state
        if (rowInfo != undefined) {
            return {
                onClick: (e, handleOriginal) => {

                    modifiedState.selectedProductInfo = {};
                    modifiedState.selectedProductInfo = rowInfo.original;
                    modifiedState.selectedRowIndex = rowInfo.index;
                  this.setState(modifiedState)
                },
                style: {
                    cursor: '',
                    background: rowInfo.index == this.state.selectedRowIndex ? '#6c95ba' : '',
                    color: rowInfo.index == this.state.selectedRowIndex ? 'white' : 'black',
                    alignItems: "center"
                }
            }
        } else {
            return {}
        }
    }

    handleKeyPress = (e) => {
        const characterCode = e.key
        const characterNumber = Number(characterCode)
        if (characterNumber >= 0 && characterNumber <= 9) {

            if (e.currentTarget.value && e.currentTarget.value.length) {
                return;
            } 
            else if (characterNumber == 0) {
                e.preventDefault()
            }
        } 
        else {
            e.preventDefault()
        }
    }        

    onPageChange = (page) => {
        let modifiedState = this.state;
        modifiedState.page = page;
    }

    onChangeProductName = (e) => {
        let modifiedState = this.state;
        modifiedState.productname = e.target.value;
        this.setState(modifiedState);
    }

    onSelectCategory = (e) => {
        let modifiedState = this.state;
        console.log("ArrCategoryInfo", modifiedState.ArrCategoryInfo);
        modifiedState.CategoryID = e.target.value;
        console.log(modifiedState.CategoryID);
        this.setState(modifiedState)

    }

    onclickNextPageData = (e) => {
        let modifiedState = this.state;
        modifiedState.page = modifiedState.page + 1
        modifiedState.offSet = modifiedState.page * 5
        this.getLatestProductInfo();
    }

    render() {

        const {errors} = this.state;

        return (
            <div>
                <div style = {{position: "relative", display: "flex", justifyContent: "center"}}>
                    <div className = "ProductTableHeading"  style={{display: "flex", marginRight: "0.3rem"}}>
                        View All Product Details
                    </div> 
                        <div style={{display: "flex", position: "absolute", right: "0rem"}}>
                            <button type = "button" 
                                className = "btn-md productScreenBut" 
                                onClick = {this.toggle}>Add New Product
                            </button>  
                        </div>
                </div>

                <div style={{borderStyle: "solid", borderWidth: "1px", margin:"1rem", border: "1px solid #a8cca8"}}>
                    <ReactTable
                        data = {this.state.data}
                        columns = {this.state.columns}
                        defaultPageSize = {5}
                        filterable
                        className = "-striped -highlight" 
                        style = {{height:'70vh', overflow:'auto'}}  
                        noDataText = "No Product Data Found."  
                        previousText = "Previous"
                        nextText = "Next"
                        getTrProps = {this.getSelectedTrProps}
                        onPageChange = {this.onPageChange}
                        // showPagination={false}
                        page={this.state.page}
                        totalPage={10}
                    />
                </div>
                <div>
                    <button type="button"  className="productScreenBut" name="Hello" onClick={this.onclickNextPageData}>Next Page Data</button>
                </div>

                <div>
                    <Modal size="lg" isOpen={this.state.modal} backdrop={this.state.backdrop}>
                        <ModalHeader toggle={this.toggle} style={{textAlign: "center"}}>
                            {this.state.formViewMode == "editMode" 
                            ? <span>Edit selected Product Details </span> 
                            : this.state.formViewMode == "deleteMode" 
                            ? <span>Delete Selected Product Details </span> 
                            : <span>Add New Product Details </span>}
                        </ModalHeader>
                        <ModalBody>  
                            <div className="container-fluid">
                                <div className="row justify-content-center">
                                    <div className="container col-lg-11 col-md-12">
                                        <div className="modal-body addProductBox">
                                            <form onSubmit={this.insertOrUpdateProductInfo} 
                                                style={{pointerEvents: this.state.formViewMode == "viewMode" ? "none" : "auto"}} 
                                            >
                                                <div className="form-group addProductForm" 
                                                    style={this.state.formViewMode == "insertMode" ? {display: "none"} : {display: "block"}}
                                                >
                                                    <div className="input-group">
                                                        <label className="addProductFormLabelWithRequiredFiled">Product ID:
                                                            <span className="addProductRequiredMarkStar">*</span>
                                                        </label>
                                                        <div className="addProductAndErr">
                                                            <input type='text' name='ProductID' className="AddProductForm"  
                                                                value={this.state.ProductID} noValidate  readOnly = {true}
                                                                style={{color: "#505050", backgroundColor: "#F0F0F0"}}
                                                            />  
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group addProductForm">
                                                    <div className="input-group">
                                                        <label className="addProductFormLabelWithRequiredFiled">Select Category:
                                                            <span className="addProductRequiredMarkStar">*</span>
                                                        </label>
                                                        <div className="addProductAndErr">
                                                        {this.state.formViewMode == "editMode" || this.state.formViewMode == "deleteMode"
                                                        ? 
                                                        <input className="AddProductForm"  value={this.state.selectedCategory} disabled/>
                                                        : 
                                                        <select className="AddProductForm" 
                                                                style={{height:"2.5rem", marginBottom: "1rem"}}
                                                                value={this.state.CategoryID}
                                                                onChange={this.onSelectCategory}
                                                        >
                                                            <option value="" disabled select="true">Select...</option>
                                                            {(this.state.ArrCategoryInfo).map((singleCategoryInfo,index) => <option key={index} value={singleCategoryInfo['CategoryID']}>{singleCategoryInfo['CategoryType']}</option>)}
                                                        </select>
                                                        }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group addProductForm">
                                                    <div className="input-group">
                                                        <label className="addProductFormLabelWithRequiredFiled">Product Name:
                                                            <span className="addProductRequiredMarkStar">*</span>
                                                        </label>
                                                        <div className="addProductAndErr">
                                                            <input type='text' name='productname' className="AddProductForm"  
                                                                value={this.state.productname}
                                                                onChange={this.onChangeProductName}  
                                                                readOnly = {this.state.formViewMode == "deleteMode" ? true : false}
                                                                style={this.state.formViewMode == "deleteMode" ? {color: "#505050", backgroundColor: "#F0F0F0", } 
                                                                        : {color: "", backgroundColor: "", }}
                                                            />
                                                        </div>        
                                                    </div>
                                                </div>

                                                <div style={{display: "flex", justifyContent: "space-evenly"}}>
                                                    <div>
                                                        <button type="button" className="productScreenBut" 
                                                            onClick={this.closeModal} name="Back" 
                                                            style={{pointerEvents: "auto"}}
                                                        > 
                                                        Back</button>
                                                    </div >
                                                    <div style={{ display: `${this.state.formViewMode == "viewMode" ? "none" : "block"}` }}>
                                                        <button type="submit" className="productScreenBut"  name="Save">
                                                            {this.state.formViewMode == "deleteMode" ? "Delete" : "Save"}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className = "buttonErrorMessage">
                                                    {errors.others.length > 0 && 
                                                        <p  className='addProductErr' style={{textAlign: "center"}}>{errors.others}</p>}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default CreateNewProductAndTrackProductInfo;