import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AddCategory from './Component/JS/AddCategory';
import React, {Component} from 'react';
import HomePg from './Component/JS/HomePg';
import CreateNewProductAndTrackProductInfo from './Component/JS/CreateNewProductAndTrackProductInfo';

class App extends Component {

  render() {
    
    return (
        <div className="App">
          <Router>              
             <Switch>
                  <Route exact path="/" 
                    render = { props => (
                      <HomePg  />
                    )}
                  />

                <Route path="/addCategoryType" component={AddCategory} /> 
                <Route path="/createNewProductAndTrackProductInfo" component={CreateNewProductAndTrackProductInfo} />
              </Switch>
            </Router>  
        </div>
    )
  }

} 
export default App;
