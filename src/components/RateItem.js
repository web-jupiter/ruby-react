import React from 'react';
import './RateItem.css'
import { strings } from '../Localization';


export class RateItem extends React.Component {

    render() {

        const rate = this.props.rate;
        let rate_level;
        if (rate.rate.toFixed(1) >= 8) rate_level = 5;
        else if (rate.rate.toFixed(1) >= 6) rate_level = 4;
        else if (rate.rate.toFixed(1) >= 4) rate_level = 3;
        else if (rate.rate.toFixed(1) >= 2) rate_level = 2;
        else rate_level = 1;
        let number_class = "";
        if(this.props.type === 'lg') number_class = " rate-number-lg";

        return (
            <div className={"rate-color-" + rate_level}>
                <span className={"rate-number" + number_class}>{rate.rate.toFixed(1)}</span>
                <span className="rate-star"><i className="fa fa-star"></i></span>
                <label className="review-count disabled">{rate.review_count} {strings.smallReviews}</label>
            </div>
        );
    }

}