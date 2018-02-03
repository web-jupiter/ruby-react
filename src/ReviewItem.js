import React from 'react';
import './ReviewItem.css'
import StarRatings from 'react-star-ratings';
import { Common } from '../Common';
import App, { BACKEND } from '../App';
import $ from 'jquery';
import { strings } from '../Localization';


export class ReviewItem extends React.Component {

    static self;

    constructor(props) {
        super(props);

        this.state = {
            review: props.review.data,
            elections: props.review.elections
        }
        ReviewItem.self = this;
    }

    edit(id) {
        window.location.href = '/review/edit/' + this.state.review.id;
    }

    delete(id) {
        console.log('delete', id);
        if(!window.confirm('Are you sure to delete this review?')) {
            return;
        }

        $('.loading').show();

        fetch(BACKEND + '/review/delete?id=' + id, {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                $('.loading').hide();

                console.log(data);
                window.location.reload();
            })
            .catch(function (error) { console.log(error) });
    }

    approve(id) {
        console.log('approve', id);

        this.approveDismiss(id, true);
    }

    dismiss(id) {
        console.log('dismiss', id);

        this.approveDismiss(id, false);
    }

    approveDismiss(id, flag) {
        $('.loading').show();

        fetch(BACKEND + '/review/approveDismiss?id=' + id + '&flag=' + flag, {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                $('.loading').hide();

                console.log(data);
                window.location.href = window.location.href;
            })
            .catch(function (error) { console.log(error) });
    }

    render() {
        const review = this.state.review;
        let review_date = new Date(review.created_at.split(".")[0]);
        review.review_ago = Common.diff(review_date, this.props.server_time);
        review.review_ago = review.review_ago + ' ' + strings.ago;

        const values = {}
        let sum = 0;
        for(let i in this.state.elections) {
            let election = this.state.elections[i];
            values[election.rate_id] = election.value;
            sum += election.value;
        }
        
        let sum_string = (sum * 2 / 5).toFixed(1);

        const rate_labels = this.props.rates.map((item, i) => (
            <td key={item.id} className="rate-item">
                <span className="rate-name">{item.name}</span>
            </td>
        ));

        const rates = this.props.rates.map((item, i) => (
            <td key={item.id} className="rate-item">
                <span className="rate-stars">
                    <StarRatings
                        rating={values[item.id] || 1}
                        numberOfStars={5}
                        name={'' + item.id}
                        starDimension='15px'
                        starSpacing='1px'
                        starRatedColor='#FFCC66'
                        starHoverColor='#FFCC66'
                    />
                </span>
            </td>
        ));


        return (
            <div className="review-item-container">
                <div className="review">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="review-summary-head">
                                <label className="sum-string">{sum_string}</label>
                                <label className="total-string"> / 10</label>
                            </div>
                            <label>{strings.reviewBy}:</label>
                            <div className="review-summary-span">
                                {review.is_anonymous ?
                                    <span><i>{strings.anonymous}</i></span>
                                    :
                                    <span>{review.user_name}</span>
                                }
                                &nbsp;{review.review_ago}
                            </div>
                            <label>{strings.serviceDetails}:</label>
                            <div className="review-summary-span">{review.service_details}</div>
                            {App.USER.logged_in ?
                                <div style={{ marginTop: '20px' }}>
                                    <button className="simple-button" style={{ fontSize: '14px' }}
                                        onClick={() => this.edit(review.id)}>{strings.edit}</button>
                                    <label style={{ color: 'lightgrey', fontWeight: 'normal' }}>&nbsp;|&nbsp;</label>
                                    <button className="simple-button" style={{ fontSize: '14px' }}
                                        onClick={() => this.delete(review.id)}>{strings.delete}</button>
                                    <label style={{ color: 'lightgrey', fontWeight: 'normal' }}>&nbsp;|&nbsp;</label>
                                    {review.approved ?
                                        <button className="simple-button" style={{ fontSize: '14px' }}
                                            onClick={() => this.dismiss(review.id)}>{strings.dismiss}</button>
                                        :
                                        <button className="simple-button" style={{ fontSize: '14px' }}
                                            onClick={() => this.approve(review.id)}>{strings.approve}</button>
                                    }
                                </div>
                                : null}
                        </div>
                        <div className="col-md-9">
                            <h4 className="review-title">
                                {review.title}
                                {review.verified ?
                                    <label className="verified-review">Verified review</label>
                                    : null}
                                {review.attachment != null ?
                                    <a href={BACKEND + '/' + review.attachment.path} className="attachment-link">{review.attachment.file_name}</a>
                                    : null}

                            </h4>
                            <p>{review.description}</p>
                            <div>
                                <table className="rates-table">
                                    <tbody>
                                        <tr>
                                            {rate_labels}
                                        </tr>
                                        <tr>
                                            {rates}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <hr />
                            <div style={{ marginTop: '-10px', marginBottom: '10px' }}>
                                <i className="disabled">{strings.reviewSubjectiveOpinion}</i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}