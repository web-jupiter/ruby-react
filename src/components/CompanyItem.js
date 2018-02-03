import React from 'react';
import './CompanyItem.css'
import { RateItem } from './RateItem';
// import { strings } from '../Localization';
import $ from 'jquery';
import { Common } from '../Common';
import LinesEllipsis from 'react-lines-ellipsis'

export const DEFAULT_LOGO_SRC = '/assets/img/company-icon.png';

export class CompanyItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            logo_src: DEFAULT_LOGO_SRC
        }
    }

    componentDidMount() {
        $('.company-link').click(function() {
            let id = $(this).attr('data-id');
            let name = $(this).attr('data-name');
            name = Common.getCompanyLinkName(name);
            window.location.href = '/company/' + name + '/' + id + '/1';
        });

        if(this.props.logo != null) {
            this.setState({logo_src: Common.BACKEND + '/' + this.props.logo.path});
        }
    }

    render() {

        const company = this.props.company;
        const rate = this.props.rate;

        return (
            <div>
                <div className="company-link" data-id={company.id} data-name={company.name}>
                    <div className="row">
                        <div className="col-sm-5 col-md-4 col-lg-3">
                            <div className="company-number">
                                <label className="company-name-label">{company.number}</label>
                                <img className="company-icon" height="110px" src={this.state.logo_src} alt="" />
                            </div>
                        </div>
                        <div className="col-sm-7 col-md-8 col-lg-9">
                            <h6 className="company-item-name">
                                {company.name}
                            </h6>
                            <RateItem rate={rate} />
                            <div className="company-description">
                                <LinesEllipsis
                                    text={company.description}
                                    maxLine='3'
                                    ellipsis='...'
                                    trimRight
                                    basedOn='letters'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}