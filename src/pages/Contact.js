import React from 'react';
import './Contact.css'
import $ from 'jquery';
import Modal from 'react-awesome-modal';
import { strings } from '../Localization';
import { Common } from '../Common';


export class Contact extends React.Component {

    static self;

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            name: '',
            title: '',
            message: ''
        }

        Contact.self = this;
    }

    componentDidMount() {
        document.title = 'WeRate - Contact Us';
    }

    handleChange(event) {
        let name = event.target.name;
        let state = Contact.self.state;
        state[name] = event.target.value;
        Contact.self.setState(state);
    }

    submit(event) {
        event.preventDefault();

        let contact = Contact.self.state;
        console.log('submit', contact);

        $('.loading').show();

        $.ajax({
            url: Common.BACKEND + '/welcome/contact',
            method: 'POST',
            data: {
                name: contact.name,
                title: contact.title,
                message: contact.message,
                auth_token: Common.getToken()
            },
            success: function (data) {
                $('.loading').hide();

                Contact.self.openModal();
            },
            error: function (error) {
                $('.loading').hide();
            }
        })
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

        window.location.href = '/';
    }

    render() {
        const contact = this.state;
        if(contact == null) {
            return (<div></div>)
        }

        return (
            <div>
                <div className="contact-header">
                    <h2>{strings.contactUs}</h2>
                </div>
                <div className="contact-body">
                    <div className="row">
                        <div className="col-md-9">
                            <form className="contact-form" onSubmit={this.submit}>
                                <div className="form-group row">
                                    <div className="col-md-3">
                                        <label>{strings.yourName}:</label>
                                    </div>
                                    <div className="col-md-4">
                                        <input className="form-control" name="name" value={contact.name}
                                            onChange={this.handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-3">
                                        <label>{strings.messageTitle}:</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" name="title" value={contact.title}
                                            onChange={this.handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-3">
                                        <label>{strings.message}:</label>
                                    </div>
                                    <div className="col-md-9">
                                        <textarea className="form-control" rows="7" name="message" value={contact.message}
                                            onChange={this.handleChange} required></textarea>
                                    </div>
                                </div>
                                <div className="contact-action">
                                    <button type="submit" className="btn btn-primary contact-button">{strings.submit}</button>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-3">
                            <label className="label-description-title">WeRate</label>
                            <p className="label-description-description">10/F, The Wave, 4 Hing Yip Street, Kwun Tong, Hong Kong</p>
                            <label className="label-description-email">{strings.adminEmail}</label>
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
                            <h3>{strings.thanksForYourMessage}</h3>
                            <p>{strings.weWillBeInTouch}</p>
                        </div>
                        <hr />
                        <button onClick={() => this.closeModal()} className="small-button btn btn-primary btn-rounded">{strings.ok}</button>
                    </div>
                </Modal>
            </div>
        );
    }

}