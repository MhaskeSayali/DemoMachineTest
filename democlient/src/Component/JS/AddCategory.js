import React, { Component } from 'react';
import '../CSS/AddCategory.css';
import axios from 'axios';
import { getAPIHostURL } from '../../ClientConfig';
import { Modal, ModalHeader, ModalBody} from 'reactstrap';
import 'react-table/react-table.css';
import '../CSS/ProductPage.css';
import ReactTable from 'react-table';
import {FaEdit, FaTrash} from 'react-icons/fa';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class AddCategory extends Component {
  constructor(props) {
      super(props);
      this.state = {
        modal: false,
        backdrop: 'static',
        enteredcategoryName: "",
        categoryDiscription: "",
        data: [],
        formViewMode: '',
        page: 0,
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
                Header:() => <div className="ProductTableHeader">Category ID</div>,  
                accessor: 'CategoryID',
                Filter: this.createProductDataFilter,
                style:({
                    textAlign:"left",
                    paddingLeft: "1rem"
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
              Header:() => <div className="ProductTableHeader">Category Discription</div>,  
              accessor: 'categoryDiscription',
              Filter: this.createProductDataFilter,
              style:({
                  textAlign:"left",
                  paddingLeft: "1rem",

              }),
          },                     
        ],     

        errors: { 
          others:''
        },
        successfulAddedCategaroyMsg: '',
      };
    } 

  onChangeCategoryDiscription = (e) => {
    let modifiedState = this.state;
    modifiedState.errors.others = "";
    modifiedState.successfulAddedCategaroyMsg = "";
    modifiedState.categoryDiscription = e.target.value;
    this.setState(modifiedState);
  }

  componentDidMount = () => {
    this.getLatestCategoryInfo();
  }

  getLatestCategoryInfo = (inModifiedState = null) => {
        
    let modifiedState;
    if(inModifiedState == null) {
        modifiedState = this.state;
    } else {
        modifiedState = inModifiedState;
    }

    axios.post(`${getAPIHostURL()}/wclient/getCategoryInformation`)
    .then(response => {
        
        if(response.data.code == 'SUCCESS') {   
            
            if(response.data.retrivedCategoriesDetails == null || response.data.retrivedCategoriesDetails.length <= 0){
                console.log("No Category Data Found on server.")
                this.setState(modifiedState);
                return
            } else {
                let stateCategoryDetails = [];

                stateCategoryDetails = [...modifiedState.data]

                const receivedProductDataArr = response.data.retrivedCategoriesDetails;
                let editIcon = <FaEdit className="viewAndEditIcon" title="Edit"/>
                let deleteIcon = <FaTrash className="viewAndEditIcon" title="Delete"/>

                for(let i = 0; i < receivedProductDataArr.length; i++) {
                    const CategoryDetails = receivedProductDataArr[i];
                    let singleCategoryDetails = {
                        delete: deleteIcon,
                        edit: editIcon,
                        categoryDiscription: CategoryDetails.Discription,
                        CategoryType: CategoryDetails.CategoryType,
                        CategoryID: CategoryDetails.CategoryID,
                    };


                    if(modifiedState.formViewMode == "insertMode"){
                        for(let j = 0; j < stateCategoryDetails.length; j++){
                            if(stateCategoryDetails[j].CategoryID == singleCategoryDetails.CategoryID){
                                stateCategoryDetails.splice(j, 1);
                            }
                        }
                        stateCategoryDetails.unshift(singleCategoryDetails);
                        modifiedState.selectedRowIndex = 0;
                        modifiedState.page = 0;
                    } else if(modifiedState.formViewMode == "editMode"){
                        for(let j = 0; j < stateCategoryDetails.length; j++){
                            if(stateCategoryDetails[j].CategoryID == singleCategoryDetails.CategoryID){
                                stateCategoryDetails.splice(j, 1);
                            }
                        }
                        modifiedState.selectedRowIndex = 0;
                        modifiedState.page = 0;
                        stateCategoryDetails.unshift(singleCategoryDetails);
                    } else { 
                        stateCategoryDetails.push(singleCategoryDetails);
                    }
                } 
                modifiedState.data = stateCategoryDetails;
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

  toggle = () => {
    this.setState(prevState => {
        let modifiedState = prevState;
        modifiedState.modal = !modifiedState.modal
        modifiedState.CategoryID = "";
        modifiedState.enteredcategoryName = "";
        modifiedState.formViewMode = "insertMode";
        modifiedState.categoryDiscription = "";

        return modifiedState
    });
  }

  closeModal = () => {
      this.toggle();
  }

  oneditProductDetails = (rowInfo, column) => {
    let modifiedState = this.state;
    modifiedState.formViewMode = "editMode";

    modifiedState.enteredcategoryName = rowInfo.original.CategoryType;
    modifiedState.categoryDiscription = rowInfo.original.categoryDiscription;
    modifiedState.CategoryID = rowInfo.original.CategoryID

    modifiedState.modal = true;
    this.setState(modifiedState);
  }

  oncategoryCreationFormSubmit = (event) => {
    event.preventDefault();

    let modifiedState = this.state;
    modifiedState.errors.others = "";
    modifiedState.successfulAddedCategaroyMsg = "";

    const allData = {
      FormViewMode: modifiedState.formViewMode,
      CategoryID: modifiedState.CategoryID,
      categoryName: modifiedState.enteredcategoryName, 
      categoryDiscription: modifiedState.categoryDiscription
    };

      axios.post(`${getAPIHostURL()}/wclient/saveCategoryInformation`, allData)
      .then(response => {
        if(response.data.code == "SUCCESS") {
          let alertMsg = modifiedState.formViewMode == 'deleteMode' ? 'Successfully Deleted Category.' : 'Successfully Created Category.'
          alert(alertMsg);

          modifiedState.modal = false;
          if(modifiedState.formViewMode == 'deleteMode'){
              for(let i=0; i< modifiedState.data.length; i++) {
                if(modifiedState.data[i]['CategoryID'] == modifiedState.CategoryID){
                    modifiedState.data.splice(i,1)
                }
              }
            modifiedState.data = [...modifiedState.data];
            this.setState(modifiedState);
          } else {
            this.getLatestCategoryInfo();
          }
        } else {

          if (response.data.code == "REQ_PARAMS_MISSING") {
            modifiedState.errors.others = "Server experiencing issues.\nTry again later.";
          } else if(response.data.code == "SQL_ERROR"){
            modifiedState.errors.others = "Server experiencing issues.\nTry again later.";
          } else if(response.data.code == "CATEGORY_NAME_ALREADY_EXIST"){
            modifiedState.errors.others = "Category Type Already exist, please create new category.";
          } else{
            modifiedState.successfulAddedCategaroyMsg = "category created Successfully. For Creating Product, Click the Link below.";
          }
        }
        this.setState(modifiedState);
      })
      .catch(error => {
        console.log(error);
        modifiedState.errors.others = 'Network issues.\nCheck your Internet and Try again later.';
        this.setState(modifiedState);  
      });
  }

  onPageChange = (page) => {
    let modifiedState = this.state;
    modifiedState.page = page;
  }

  onDeleteProductDetails = (rowInfo, column) => {

    let modifiedState = this.state;
    modifiedState.formViewMode = "deleteMode";

    modifiedState.enteredcategoryName = rowInfo.original.CategoryType;
    modifiedState.categoryDiscription = rowInfo.original.categoryDiscription;
    modifiedState.CategoryID = rowInfo.original.CategoryID

    modifiedState.modal = true;
    this.setState(modifiedState);

  }

  onChangecategoryName = (e) => {
    let modifiedState = this.state;
    modifiedState.errors.others = "";
    modifiedState.successfulAddedCategaroyMsg = "";
    modifiedState.enteredcategoryName = e.target.value;
    this.setState(modifiedState);
  }

  render() {
      const{errors, successfulAddedCategaroyMsg}=this.state;

      const color = {
          color : "var(--errorColor)",
          fontSize:"13px"
      }

      return (
          <div>
              <div style = {{position: "relative", display: "flex", justifyContent: "center"}}>
                  <div className = "ProductTableHeading"  style={{display: "flex", marginRight: "0.3rem"}}>
                      View All Categories Details
                  </div> 
                      <div style={{display: "flex", position: "absolute", right: "0rem"}}>
                          <button type = "button" 
                              className = "btn-md productScreenBut" 
                              onClick = {this.toggle}>Add New Category
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
                      noDataText = "No Category Data Found."  
                      previousText = "Previous"
                      nextText = "Next"
                      getTrProps = {this.getSelectedTrProps}
                      onPageChange = {this.onPageChange}
                      page={this.state.page}
                      totalPage={10}
                  />
              </div>

              <div> <Link to ="/">Go To Home Page</Link></div>

              <div>
                  <Modal size="lg" isOpen={this.state.modal} backdrop={this.state.backdrop}>
                      <ModalHeader toggle={this.toggle} style={{textAlign: "center"}}>
                          {this.state.formViewMode == "editMode" 
                          ? <span>Edit selected Category Details </span> 
                          : this.state.formViewMode == "deleteMode" 
                          ? <span>Delete Selected Category Details </span> 
                          : <span>Add New Category Details </span>}
                      </ModalHeader>
                      <ModalBody>  
                          <div className="container-fluid">
                              <div className="row justify-content-center">
                                  <div className="container col-lg-11 col-md-12">
                                      <div className="modal-body addProductBox">
                                          <form onSubmit={this.oncategoryCreationFormSubmit} 
                                              style={{pointerEvents: this.state.formViewMode == "viewMode" ? "none" : "auto"}} 
                                          >
                                              <div className="form-group addProductForm" 
                                                  style={this.state.formViewMode == "insertMode" ? {display: "none"} : {display: "block"}}
                                              >
                                                  <div className="input-group">
                                                      <label className="addProductFormLabelWithRequiredFiled">Category ID:
                                                          <span className="addProductRequiredMarkStar">*</span>
                                                      </label>
                                                      <div className="addProductAndErr">
                                                          <input type='text' name='ProductID' className="AddProductForm"  
                                                              value={this.state.CategoryID} noValidate  readOnly = {true}
                                                              style={{color: "#505050", backgroundColor: "#F0F0F0"}}
                                                          />  
                                                      </div>
                                                  </div>
                                              </div>

                                              <div className="form-group addProductForm" 
                                              >
                                                  <div className="input-group">
                                                      <label className="addProductFormLabelWithRequiredFiled">Category Name:
                                                          <span className="addProductRequiredMarkStar">*</span>
                                                      </label>
                                                      <div className="addProductAndErr">
                                                          <input type='text' name='ProductID' className="AddProductForm"  
                                                              value={this.state.enteredcategoryName} noValidate 
                                                              onChange={this.onChangecategoryName}
                                                          />  
                                                      </div>
                                                  </div>
                                              </div>

                                              <div className="form-group addProductForm" 
                                              >
                                                  <div className="input-group">
                                                      <label className="addProductFormLabelWithRequiredFiled">Category Description:
                                                      </label>
                                                      <div className="addProductAndErr">
                                                          <input type='text' name='CategoryDescription' className="AddProductForm"  
                                                              value={this.state.categoryDiscription} noValidate
                                                              onChange={this.onChangeCategoryDiscription}
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
export default AddCategory;


