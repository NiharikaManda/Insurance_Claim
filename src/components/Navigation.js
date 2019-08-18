import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Navigation extends Component {

    render() 
    {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header"><button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span className="sr-only">Toggle navigation</span><span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span></button>
                        <a className="navbar-brand" href="/">Receipt Summary</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li><NavLink exact={true} to="/" activeClassName="active">Upload Receipt</NavLink></li>
                            <li><NavLink exact={true} to="/reports" activeClassName="active">Reports</NavLink></li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
};

export default Navigation;
