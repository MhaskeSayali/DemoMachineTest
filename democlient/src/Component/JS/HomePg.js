import React, { Component } from 'react';
import '../CSS/homePg.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class HomePg extends Component {
	constructor(props) {
    super(props);
    this.state = {
      errors: {
        others: ''        
      },
    };
  }

  render() {
    const {errors} = this.state;

    return (
        <div className="container col-lg-4 col-lg-offset-3 centered
                                  col-md-4 col-md-offset-3">
            <div className="modal-body homePg" style={{height:"15rem"}}>
              <div className="form-group homePgForm">					
                  Welcome To Demo Project
              </div>
              <div style={{paddingTop:"1.5rem"}}> <Link to ="/addCategoryType">Add New Category</Link></div>

              <div style={{paddingTop:"1.5rem"}}>
                <Link to ="/createNewProductAndTrackProductInfo">Track Product Information</Link>
              </div>
            </div>
        </div>
      )
  }

}

export default HomePg;