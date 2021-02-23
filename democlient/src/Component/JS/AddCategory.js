import React, { Component } from 'react';
import '../CSS/AddCategory.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import { getAPIHostURL } from '../../ClientConfig';



class AddCategory extends Component {
  constructor(props) {
      super(props);
      this.state = {
        redirect:false,
        enteredcategoryName: "",
        categoryDiscription: "",
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

  oncategoryCreationFormSubmit = (event) => {
    event.preventDefault();

    let modifiedState = this.state;
    modifiedState.errors.others = "";
    modifiedState.successfulAddedCategaroyMsg = "";

    const allData = {
      categoryName: modifiedState.enteredcategoryName, 
      categoryDiscription: modifiedState.categoryDiscription
    };

      axios.post(`${getAPIHostURL()}/wclient/saveCategoryInformation`, allData)
      .then(response => {
        if(response.data.code == "SUCCESS" && window.confirm("Category Created Successfully.\nDo You Want To Add New Prodcut?")) {
            modifiedState.redirect = !modifiedState.redirect;

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

  renderRedirect = () =>{
    if(this.state.redirect){
      return<Redirect to="/"/>    
    }
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
          <div className="container">
              <div className="row justify-content-center">
                  <div className="container col-lg-6 col-lg-offset-3
                                            col-md-8 col-md-offset-2">
                      <div className="modal-body box">
                          <div className="form-group category-form" style={{fontSize:"1rem", color:"orange", fontWeight:"bold"}}>
                              Create New category
                          </div>
                          <form onSubmit={this.oncategoryCreationFormSubmit} >
                              <div className="form-group category-form">
                                  <div className="input-group">
                                      <label className="category-form-label">Enter Category Type<span style={{color:"red"}}>*</span>:</label>
                                      <input type='text' name='categoryName' className=" input-form" required="required" 
                                        value={this.state.enteredcategoryName}
                                        onChange={this.onChangecategoryName} noValidate />     
                                  </div>
                              </div>
                              <div className="form-group category-form">
                                  <div className="input-group">
                                      <label className="category-form-label">Category Discription:</label>
                                      <input type="text" className="input-form" name="firstname" 
                                        value={this.state.categoryDiscription}
                                        onChange={this.onChangeCategoryDiscription} 
                                      />
                                  </div>
                              </div>
                              <div className="form-group category-form">
                                  {this.renderRedirect()}
                                  <button type="submit" className="btn-sm category-btn">Save</button>
                                  <div className = "buttonErrorMessage">
                                      {errors.others.length > 0 && 
                                          <p style={color} className='error'>{errors.others}</p>}
                                      {successfulAddedCategaroyMsg.length > 0 &&
                                          <p style={{color:'green'}} className='error'>{successfulAddedCategaroyMsg}</p>}
                                  </div>
                              </div>
                              <div> <Link to ="/">Go To Home Page</Link></div>
                          </form>
                      </div>

                  </div>
              </div>
          
          </div>
      );
  }
}
export default AddCategory;


