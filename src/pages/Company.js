import React from 'react';
import './Company.css'
import $ from 'jquery';
import { Common } from '../Common'
import Pagination from "react-js-pagination";
import { ReviewItem } from '../components/ReviewItem';
import { RateItem } from '../components/RateItem';
import { strings } from '../Localization';

export const pageSize = 10;
export const DEFAULT_LOGO_SRC = '/assets/img/company-icon.png';
export const DEFAULT_BANNER_SRC = '/assets/img/geometry2.png';

export class Company extends React.Component {

    static self;

    constructor(props) {
        super(props);

        this.state = {
            company: null,
            reviews: [],
            activePage: 1,
            rates: [],
            company_edit: null,
            files: {
                logo: null,
                banner: null
            },
            logo_src: DEFAULT_LOGO_SRC,
            banner_src: DEFAULT_BANNER_SRC,
            logo_name: null,
            banner_name: null,
            logo: null,
            banner: null,
            server_time: null
        };

        Company.self = this;
    }

    componentDidMount() {
        this.getRates();
    }

    handlePageChange(pageNumber) {
        // console.log(`active page is ${pageNumber}`);
        let array = window.location.href.split('/');
        array[array.length - 1] = pageNumber;
        window.location.href = array.join('/');
        // Company.self.setState({ activePage: pageNumber });
        // $("html, body").animate({ scrollTop: 0 }, "fast");
    }

    getRates() {
        fetch(Common.BACKEND + '/rate/index', {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                this.setState({
                    rates: data.rates,
                })

                this.createCompany()
            })
            .catch(function (error) { Common.handleError(error) });
    }

    createCompany() {
        let array = window.location.href.split('/');
        let company_id = array[array.length - 2];
        let page = array[array.length - 1];
        this.setState({ activePage: page });
        $('.loading').show();

        fetch(Common.BACKEND + '/company/show?id=' + company_id, {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                $('.loading').hide();
                let company_edit = Common.clone(data.company);

                // Admin filter
                let reviews = [];
                for (let i in data.reviews) {
                    let item = data.reviews[i];
                    if (!Common.loggedIn() && !item.data.approved) {
                        continue;
                    }
                    item.data.attachment = item.attachment;
                    reviews.push(item);
                }
                console.log(reviews);
                reviews.sort(function(a, b){return b.data.created_at > a.data.created_at});

                this.setState({
                    company: data.company,
                    reviews: reviews,
                    rate: data.rate,
                    company_edit: company_edit,
                    categories: data.categories,
                    logo: data.logo,
                    banner: data.banner,
                    server_time: data.server_time
                })

                if (data.logo) {
                    this.setState({
                        logo_src: Common.BACKEND + '/' + data.logo.path,
                        logo_name: data.logo.file_name,
                    })
                }
                if (data.banner) {
                    this.setState({
                        banner_src: Common.BACKEND + '/' + data.banner.path,
                        banner_name: data.banner.file_name,
                    })
                }

                document.title = 'WeRate - ' + this.state.company.name;
            })
            .catch(function (error) { Common.handleError(error) });
    }

    handleChange(event) {
        let name = event.target.name;
        let state = Company.self.state;
        state.company_edit[name] = event.target.value;
        Company.self.setState(state);
    }

    onSubmit() {
        $('.loading').show();

        let formData = new FormData();
        let logo = this.state.files.logo;
        let banner = this.state.files.banner;
        if (logo !== undefined && logo !== null) {
            formData.append('logo', logo, logo.name);
        }
        if (banner !== undefined && banner !== null) {
            formData.append('banner', banner, banner.name);
        }

        $.ajax({
            type: "POST",
            url: Common.BACKEND + "/company/upload",
            success: function (data) {
                console.log(data);
                const company_edit = Company.self.state.company_edit;
                const id = Company.self.state.company.id;
                if (Company.self.state.logo_name != null) {
                    company_edit.logo_id = Company.self.state.logo.id;
                } else {
                    company_edit.logo_id = data.logo.id;
                }
                if (Company.self.state.banner_name != null) {
                    company_edit.banner_id = Company.self.state.banner.id;
                } else {
                    company_edit.banner_id = data.banner.id;
                }

                $.ajax({
                    url: Common.BACKEND + '/company/update',
                    method: 'POST',
                    data: {
                        id: id,
                        company: company_edit,
                        auth_token: Common.getToken()
                    },
                    success: function (data) {
                        $('.loading').hide();

                        window.location.reload();
                    },
                    error: function (error) {
                        $('.loading').hide();
                    }
                });
            },
            error: function (error) {
                Common.handleError(error);
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    }

    declareHot() {
        console.log('declare hot');
        if (window.confirm('Do you want to declare hot company?')) {
            Company.self.hot('true');
        }
    }

    declareCool() {
        console.log('declare cool');
        if (window.confirm('Do you want to declare cool company?')) {
            Company.self.hot('false');
        }
    }

    hot(is_hot) {
        $('.loading').show();
        let url = Common.BACKEND + '/company/hot?id=' + Company.self.state.company.id;
        url += '&is_hot=' + is_hot;

        fetch(url, {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                $('.loading').hide();

                // console.log(data);
                window.location.reload();
            })
            .catch(function (error) { Common.handleError(error) });
    }

    onFileChange(e) {
        let name = e.target.name;
        let files = this.state.files;
        files[name] = e.target.files[0];
        this.setState({ files: files });
        if (name === 'logo') {
            this.setState({ logo_name: null });
        } else if (name === 'banner') {
            this.setState({ banner_name: null });
        }
        // console.log(this.state);
    }

    deleteLogo() {
        this.setState({
            logo_src: DEFAULT_LOGO_SRC,
            logo_name: null
        })
    }

    deleteBanner() {
        this.setState({
            banner_src: DEFAULT_BANNER_SRC,
            banner_name: null
        })
    }

    reload() {
        window.location.reload();
    }

    render() {
        const company = this.state.company;
        const company_edit = this.state.company_edit;
        if (company === null) {
            return (
                <div></div>
            )
        }

        const reviews = [];

        const reviewCount = this.state.reviews.length;

        if (reviewCount === 0) {
            reviews.push(
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>No data to display</div>
            )
        } else {
            let start = (this.state.activePage - 1) * pageSize;
            for (let i = start; i < Math.min(start + pageSize, reviewCount); i++) {
                let item = this.state.reviews[i];
                reviews.push(
                    <ReviewItem key={item.data.id} review={item} rates={this.state.rates} server_time={this.state.server_time} />
                )
            }
        }

        let service_tags = [];
        if (this.state.company.services !== null && this.state.company.services !== "") {
            let services = this.state.company.services.split(", ");
            service_tags = services.map((item, i) => (
                <label key={'service-' + i} className='company-service-item'>
                    {item}
                </label>
            ));
        }
        

        // console.log(this.state.reviews);

        const page = parseInt(this.state.activePage, 10);

        return (
            <div className="company-container">
                <div className="company-banner">
                    <img id="bannerImage" src={this.state.banner_src} width="100%" alt="" />
                </div>
                <div className="company-summary">
                    <div className="row">
                        <div className="col-md-3">
                            <img id="logoImage" className="company-summary-icon" src={this.state.logo_src} alt="" />
                            <div className="company-info">
                                <div>
                                    <label>{strings.yearFounded}:</label> {company.year_found}
                                </div>
                                <div>
                                    <label>{strings.headquarter}:</label> {company.headquarter}
                                </div>
                                <div>
                                    <label>{strings.companySize}:</label> {company.size}
                                </div>
                                <div>
                                    <label>{strings.website}:</label>&nbsp;
                                    <span style={{ wordWrap: 'break-word' }}>{company.site}</span>
                                </div>
                                <div>
                                    <label>{strings.email}:</label> {company.email}
                                </div>
                                <div>
                                    <label>{strings.phone}:</label> {company.phone}
                                </div>
                            </div>
                            <a className="btn btn-primary btn-rounded claim-button" href="/contact">{strings.claimCompany}</a>
                        </div>
                        <div className="col-md-9">
                            {Common.loggedIn() ?
                                <button className="simple-button" style={{ float: 'right' }}
                                    data-toggle="modal" data-target="#companyModal"><i className="fa fa-pencil"></i> {strings.edit}</button>
                                : null}
                            <h3>
                                <span className="company-name">{company.name}</span>
                            </h3>
                            <RateItem rate={this.state.rate} type="lg" />
                            <p className="company-description">{company.description}</p>
                            <div style={{ marginTop: '30px' }}>
                                {service_tags}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="review-container">
                    <div className="row">
                        <div className="col-md-9">
                            <label className="reviews-label">{strings.reviews}</label>

                            <a href={'/review/' + company.id} className="simple-button"
                                style={{ float: 'right' }}><i className="fa fa-edit"></i> {strings.writeReview}</a>
                        </div>
                        <div className="col-md-3">
                            {Common.loggedIn() ?
                                !company.is_hot ?
                                    <button className="simple-button pull-right"
                                        onClick={this.declareHot}><i className="fa fa-fire"></i> {strings.hotCompany}</button>
                                    :
                                    <button className="simple-button pull-right"
                                        onClick={this.declareCool}><i className="fa fa-tint"></i> {strings.collCompany}</button>
                                : null}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-9">
                            <div className="review-list">
                                {reviews}
                                <div className="pagination-container">
                                    <Pagination
                                        activePage={page}
                                        itemsCountPerPage={pageSize}
                                        totalItemsCount={reviewCount}
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
                        <div className="col-md-3 review-rules">
                            <h5>{strings.reviewGuidelines}</h5>
                            <ul className="rules">
                                <li>{strings.guideline1}</li>
                                <li>{strings.guideline2}</li>
                                <li>{strings.guideline3}</li>
                                <li>{strings.guideline4}</li>
                                <li>{strings.guideline5}</li>
                                <li>{strings.guideline6}</li>
                            </ul>
                            <p>{strings.werateRetains}</p>
                            <a href={'/review/' + company.id} className="btn btn-primary review-button">{strings.writeReview}</a>
                            <label className="disabled" style={{ marginTop: '10px' }}>
                                {strings.readOurTerms} <a className="green-link" href="/terms">{strings.here}</a>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="companyModal" tabIndex="-1" role="dialog" aria-labelledby="companyModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="companyModalLabel">{strings.editCompany}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.name}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control" name="name" value={company_edit.name}
                                            onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.description}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <textarea className="form-control" rows="5" name="description"
                                            onChange={this.handleChange} value={company_edit.description}></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.yearFounded}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control" type="number" name="year_found"
                                            onChange={this.handleChange} value={company_edit.year_found} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.headquarter}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control" name="headquarter"
                                            onChange={this.handleChange} value={company_edit.headquarter} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.companySize}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control" name="size"
                                            onChange={this.handleChange} value={company_edit.size} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.website}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control" name="site"
                                            onChange={this.handleChange} value={company_edit.site} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.email}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control" name="email"
                                            onChange={this.handleChange} value={company_edit.email} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.phone}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control" name="phone"
                                            onChange={this.handleChange} value={company_edit.phone} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.services}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control" name="services"
                                            onChange={this.handleChange} value={company_edit.services} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.logo}</label>
                                    </div>
                                    <div className="col-md-4">
                                        <input name="logo" type="file"
                                            onChange={this.onFileChange.bind(this)} />
                                    </div>
                                    {this.state.logo_name !== null ?
                                        <div className="col-md-6">
                                            <a href={this.state.logo_src} style={{ verticalAlign: 'middle' }}>
                                                {this.state.logo_name}
                                            </a>
                                            <button className="simple-button" style={{ marginLeft: 20, marginTop: 5, verticalAlign: 'middle' }}
                                                onClick={this.deleteLogo.bind(this)}>
                                                <i className="fa fa-trash-o"></i>
                                            </button>
                                        </div>
                                        : null}
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.banner}</label>
                                    </div>
                                    <div className="col-md-4">
                                        <input name="banner" type="file"
                                            onChange={this.onFileChange.bind(this)} />
                                    </div>
                                    {this.state.banner_name !== null ?
                                        <div className="col-md-6">
                                            <a href={this.state.banner_src} style={{ verticalAlign: 'middle' }}>
                                                {this.state.banner_name}
                                            </a>
                                            <button className="simple-button" style={{ marginLeft: 20, marginTop: 5, verticalAlign: 'middle' }}
                                                onClick={this.deleteBanner.bind(this)}>
                                                <i className="fa fa-trash-o"></i>
                                            </button>
                                        </div>
                                        : null}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-first" data-dismiss="modal"
                                    onClick={this.reload}>{strings.cancel}</button>
                                <button type="button" className="btn btn-secondary btn-submit"
                                    onClick={this.onSubmit.bind(this)}>{strings.submit}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}