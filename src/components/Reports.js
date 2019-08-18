import React, { Component } from 'react';
import axios from 'axios';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Reports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reportsList: [],
            startDate: new Date(),
            message: null
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({ startDate: date });
    }

    onSubmit = (e) =>
    {
        e.preventDefault();
        if(this.state.startDate){
            let formData = {
                startDate: this.state.startDate,
                endDate: new Date(this.state.startDate - 1000 * 60 * 60 * 24 * 7)
            }
            axios.post("http://localhost:8000/reports",formData)
            .then((response) => {
                if(response.data.data.length > 0){
                    this.setState({ reportsList: response.data.data, message:null });
                }
                else{
                    this.setState({ reportsList:[], message: "No records found." });
                }
            })
        }
    }

    render()
    {
        let totalCost = 0;
        let tableRows = this.state.reportsList.map((item,index) =>{
            totalCost = totalCost + item.totalPrice;
            return <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item._id}</td>
                <td>{item.qty}</td>
                <td>{item.totalPrice.toFixed(2)}</td>
            </tr>
        });

        return (
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Fetch Summary</legend>
                        <div className="control-group">
                            <div className="dateLabel">Select Date: </div>
                            <DatePicker selected={this.state.startDate} onChange={this.handleChange}/>
                            <button type="button" className="btn btn-primary btn-summary" onClick={this.onSubmit}>Fetch Details</button>
                        </div>
                    </fieldset>
                </div>
                {this.state.message !==null ?
                    <div className="error-message">{this.state.message}</div>
                    :
                    ""
                }
                {this.state.reportsList.length > 0 ?
                    <div className="col-lg-12 col-md-13 col-sm-12 col-xs-12">
                        <div className="report-title">Summary of last 7 days from selected date.</div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Item</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows}
                                <tr key={totalCost}>
                                    <th colspan="3" style={{textAlign:'right'}}>Total Cost</th>
                                    <th>{totalCost.toFixed(2)}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    :
                    ""
                }
            </div>
        );
    }
}

export default Reports;
