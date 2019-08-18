import React, { Component } from 'react';
import axios from 'axios';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Navigation from './components/Navigation';
import UploadImage from './components/UploadImage';
import Reports from './components/Reports';

const httpClient = axios.create();
httpClient.defaults.timeout = 1000 * 10;

class App extends Component {
 
    render() {
        return (
            <Router>
                <div className="container">
                    <Navigation/>
                        <Switch>
                            <Route exact path='/' component={UploadImage} />
                            <Route exact path='/reports' component={Reports} />
                        </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
