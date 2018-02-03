import React from 'react';
import './Companies.css'
import { CompanyItem } from '../components/CompanyItem';
import { strings } from '../Localization';
import { Common } from '../Common'
import Pagination from "react-js-pagination";
import $ from 'jquery';

export const pageSize = 10;

export class Companies extends React.Component {
    
    static self;
    
    constructor(props) {
        super(props);

        this.state = { 
            companies: [], 
            category: null,
            activePage: 1,
            hotCount: 0
        };

        Companies.self = this;
    }

    componentDidMount() {
        this.createList();
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        let array = window.location.href.split('/');
        array[array.length - 1] = pageNumber;
        window.location.href = array.join('/');
        // Companies.self.setState({ activePage: pageNumber });
        // $("html, body").animate({ scrollTop: 0 }, "fast");
    }

    createList() {
        let type = window.location.href.split('/')[3];
        let url = "";
        if(type === 'search') {
            url = Common.BACKEND + '/company/search?key=' + window.location.href.split('/')[4];
        } else {
            url = Common.BACKEND + '/company/category?id=' + window.location.href.split('/')[4];
        }
        
        $('.loading').show();

        fetch(url, {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                $('.loading').hide();

                let hotData = Common.sortHot(data.companies, pageSize);
                console.log(hotData);
                let page = window.location.href.split('/')[5];
                this.setState({
                    companies: hotData.companies,
                    category: data.category,
                    hotCount: hotData.hotCount,
                    activePage: page
                })
                document.title = 'WeRate - ' + this.state.category.name;
            })
            .catch(function (error) { Common.handleError(error) });
    }

    render() {
        
        if(this.state.category == null) {
            return (<div></div>);
        }

        const companies = [];
        const companyCount = this.state.companies.length;

        let start = (this.state.activePage - 1) * (pageSize + this.state.hotCount);
        for (let i = start; i < Math.min(start + pageSize + this.state.hotCount, companyCount); i++) {
            let item = this.state.companies[i];
            // item['company'].description = Common.truncate(item['company'].description, 85);
            companies.push(
                <CompanyItem key={item['company'].id} company={item['company']} rate={item['rate']} logo={item['logo']} />
            )
        }

        if (companyCount === 0) {
            return (
                <div>
                    <div className="company-header">
                        <h2>{this.state.category.name}</h2>
                        <p>{this.state.category.description}</p>
                    </div>
                    <div className="company-body">
                        <div className="company-list">
                            <p className="no-data">
                                No data to display
                            </p>
                        </div>
                    </div>
                </div>
            )
        }

        const page = parseInt(this.state.activePage, 10);

        return (
            <div>
                <div className="company-header">
                    <h2>{this.state.category.name}</h2>
                    <p>{this.state.category.description}</p>
                </div>
                <div className="company-body">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="company-list">
                                {companies}
                                <div className="pagination-container">
                                    <Pagination
                                        activePage={page}
                                        itemsCountPerPage={pageSize + this.state.hotCount}
                                        totalItemsCount={companyCount}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange}
                                        prevPageText="Prev"
                                        nextPageText="Next"
                                        firstPageText="First"
                                        lastPageText="Last"
                                    // hideFirstLastPages="true"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="label-description-title">{strings.cantFindCompany}</label>
                            <p className="label-description-description">{strings.cantDescription}</p>
                            <label className="label-description-email">{strings.adminEmail}</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}