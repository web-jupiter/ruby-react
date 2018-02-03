import React from 'react';
import './Footer.css'
import { Categories } from './Categories';
import { strings } from '../Localization';
import { Common } from '../Common';


export class Footer extends React.Component {

    render() {
        
        return (
            <div className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <h5 className="browse-category">{strings.browseCategory}</h5>
                        </div>
                        <div className="col-lg-9">
                            <Categories />
                        </div>
                    </div>
                    <hr />
                    <div className="footer-info">
                        &copy;2018 WeRate - <a href="/privacy" className="green-link">{strings.privacy}</a> {strings.and} <a href="/terms" className="green-link">{strings.terms}</a>
                        <div className="link-container">
                            <a href="/">{strings.home}</a>&nbsp;|&nbsp;
                            <a href="/contact">{strings.contactUs}</a>
                            {Common.loggedIn() ?
                                <span>&nbsp;|&nbsp;<a href="/admin"><i className="fa fa-cogs"></i> {strings.admin}</a></span>
                            : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}