import React from 'react';
import './Review.css'
import { Common } from '../Common';
import { strings } from '../Localization';
import $ from 'jquery';
import StarRatings from 'react-star-ratings';
import Modal from 'react-awesome-modal';

export class Review extends React.Component {

    static self;

    constructor(props) {
        super(props);

        Review.self = this;

        this.state = {
            review: {
                user_name: '',
                is_anonymous: false,
                title: '',
                service_details: '',
                description: '',
                user_email: '',
                verified: false,
            },
            rates: [],
            rate_values: {},
            editing: false,
            file: [],
            visible: false,
            attachment: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    componentWillMount() {
        document.title = 'WeRate - Review';

        let type = window.location.href.split("/")[4];
        if (type === 'edit') {
            this.setState({ editing: true });
            let id = window.location.href.split('/')[5];

            fetch(Common.BACKEND + '/review/show?id=' + id, {
                method: 'GET',
            })
                .then(results => results.json())
                .then(data => {
                    // console.log(data.review);
                    this.setState({
                        review: data.review,
                        rates: data.rates,
                        rate_values: data.rate_values,
                        attachment: data.attachment
                    })
                })
                .catch(function (error) { Common.handleError(error) });
        } else {
            this.createRates();
        }
    }

    openModal() {
        this.setState({
            visible: true
        });
    }

    closeModal() {
        this.setState({
            visible: false
        });

        window.history.back();
    }

    handleChange(event) {
        let name = event.target.name;
        let state = this.state;
        state.review[name] = event.target.value;
        // console.log(state);
        this.setState(state);
    }

    handleCheckChange(event) {
        let name = event.target.name;
        let state = this.state;
        state.review[name] = event.target.checked;
        // console.log(state);
        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();

        // File upload
        $('.loading').show();

        let formData = new FormData();
        let file = this.state.file;
        formData.append('file', file, file.name);
        if (file.name === undefined) {
            let review = Review.self.state.review;
            if (this.state.attachment == null) {
                review.attachment_id = 0;
            } else {
                review.attachment_id = this.state.attachment.id;
            }
            Review.self.setState({ review: review });
            Review.self.submit(review.attachment_id);
        } else {
            $.ajax({
                type: "POST",
                url: Common.BACKEND + "/review/upload",
                success: function (data) {
                    // console.log(data);
                    let review = Review.self.state.review;
                    review.attachment_id = data.id;
                    Review.self.setState({ review: review });
                    Review.self.submit(data.id);
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
    }

    submit(attachment_id) {
        $('.loading').show();

        let company_id = this.state.editing ? 0 : window.location.href.split('/')[4];

        $.ajax({
            url: Common.BACKEND + '/review/submit',
            method: 'POST',
            data: {
                company_id: company_id,
                review: this.state.review,
                stars: this.state.rate_values,
                auth_token: Common.getToken()
            },
            success: function (data) {
                $('.loading').hide();

                Review.self.openModal();
            },
            error: function (error) {
                $('.loading').hide();
            }
        })
    }

    createRates() {
        fetch(Common.BACKEND + '/rate/index', {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                this.setState({
                    rates: data.rates,
                    rate_values: data.rate_values
                })
            })
            .catch(function (error) { Common.handleError(error) });
    }

    onStarClick(rate, id) {
        const values = Review.self.state.rate_values;
        values[id] = rate;
        Review.self.setState({ rate_values: values })
    }

    onFileChange(e) {
        this.setState({ file: e.target.files[0] })
    }

    deleteAttachment() {
        this.setState({attachment: null})
    }

    render() {
        const values = this.state.rate_values;

        const rate_labels = this.state.rates.map((item, i) => (
            <td key={item.id} className="rate-item">
                <span className="review-rate-name">{item.name}</span>
            </td>
        ));

        const rates = this.state.rates.map((item, i) => (
            <td key={item.id} className="rate-item">
                <span className="rate-stars">
                    <StarRatings
                        rating={values[item.id] || 1}
                        changeRating={this.onStarClick.bind(item.id)}
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

        // console.log(this.state);

        return (
            <div>
                <div className="review-container">
                    <div className="row">
                        <div className="review-form1 col-md-9">
                            <h3>{strings.reviewThisCompany}</h3>
                            <hr />
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group row">
                                    <div className="col-md-3">
                                        <label>{strings.yourName}:</label>
                                    </div>
                                    <div className="col-md-4">
                                        {this.state.review.is_anonymous ?
                                            <label className="disabled"><i>{strings.anonymous}</i></label>
                                            :
                                            <input className="form-control" name="user_name" value={this.state.review.user_name || ''} onChange={this.handleChange} />
                                        }
                                    </div>
                                    <div className="col-md-3">
                                    </div>
                                    <div className="col-md-3">
                                    </div>
                                    <div className="col-md-9">
                                        <label className="keep-review-label">
                                            <input type="checkbox" checked={this.state.review.is_anonymous} name="is_anonymous"
                                                onChange={(event) => this.handleCheckChange(event)} /> {strings.keepAnonymous}
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-3">
                                        <label>{strings.reviewTitle}:</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" name="title" required
                                            value={this.state.review.title || ''} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-3">
                                        <label>{strings.serviceDetails}:</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input id="serviceDetailsInput" className="form-control" placeholder={strings.whatWasYourServiceReceived}
                                            name="service_details" required
                                            value={this.state.review.service_details || ''} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-3">
                                        <label>{strings.reviewContent}:</label>
                                    </div>
                                    <div className="col-md-9">
                                        <textarea className="form-control" rows="7" required
                                            name="description" value={this.state.review.description || ''} onChange={this.handleChange}>
                                        </textarea>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-3">
                                        <label>{strings.rating}:</label>
                                    </div>
                                    <div className="col-md-9">
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
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-3">
                                        <label>{strings.verify}<br />({strings.optional}):</label>
                                    </div>
                                    <div className="col-md-9">
                                        <label className="review-checkbox" style={{ fontWeight: 'normal' }}>
                                            <input type="checkbox" checked={this.state.review.verified} name="verified"
                                                onChange={(event) => this.handleCheckChange(event)} />&nbsp;
                                        {strings.wantVerifyReview}
                                        </label>
                                    </div>
                                    <div className="col-md-3">
                                    </div>
                                    <div className="col-md-6">
                                        {this.state.review.verified ?
                                            <div>
                                                {this.state.attachment != null ?
                                                    <p>
                                                        <a href={Common.BACKEND + '/' + this.state.attachment.path}
                                                            className="review-attachment-link">{this.state.attachment.file_name}</a>
                                                        <button type="button" className="simple-button" style={{ marginLeft: '40px', fontSize: '13px' }}
                                                            onClick={() => this.deleteAttachment()}>
                                                            <i className="fa fa-trash-o"></i> {strings.remove}
                                                    </button>
                                                    </p>
                                                    :
                                                    <input type="file" className="form-control review-file"
                                                        onChange={this.onFileChange} />
                                                }
                                            </div>
                                            : null}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-3">
                                        <label>{strings.yourEmail}:</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" type="email" required
                                            name="user_email" value={this.state.review.user_email || ''} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <label className="review-checkbox font-12" style={{ fontWeight: 'normal' }}>
                                    <input id="agreeInput" type="checkbox" className="review-checkbox" required />&nbsp;
                                    {strings.agreeWebrate} <a href="/terms" className="green-link">{strings.termsOfUse}</a>{strings.certifyReviewSubmit}
                                </label>

                                <div>
                                    <button className="btn btn-primary submit-button" type="submit">{strings.submit}</button>
                                </div>
                            </form>
                        </div>
                        <div className="review-form2 col-md-3">
                            <h5>{strings.reviewGuidelines}</h5>
                            <ul className="review-list">
                                <li>{strings.guideline1}</li>
                                <li>{strings.guideline2}</li>
                                <li>{strings.guideline3}</li>
                                <li>{strings.guideline4}</li>
                                <li>{strings.guideline5}</li>
                                <li>{strings.guideline6}</li>
                            </ul>
                            <p>{strings.werateRetains}</p>
                            <button className="btn btn-primary review-button" style={{ marginBottom: '10px' }}>{strings.review}</button>
                            <span className="disabled guideline-end-label">
                                {strings.readOurTerms} <a href="/terms" className="green-link">{strings.here}</a>
                            </span>
                        </div>
                    </div>
                </div>
                <Modal
                    visible={this.state.visible}
                    width="400"
                    height="300"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div className="popup-modal">
                        <div className="popup-body">
                            <h3>{strings.reviewSubmitted}</h3>
                            <p>{strings.weWillReviewYourSubmission}</p>
                        </div>
                        <hr />
                        <button onClick={() => this.closeModal()} className="small-button btn btn-primary btn-rounded">{strings.ok}</button>
                    </div>
                </Modal>
            </div>
        );
    }

}