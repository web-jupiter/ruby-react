import React from 'react';
import './Header.css'
import Modal from 'react-awesome-modal';
import { strings } from '../Localization';
import { Link } from 'react-router-dom'
import { Common } from '../Common';
import * as $ from 'jquery';


export class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            registerVisible: false,
            email: '',
            password: '',
            signup_email: '',
            signup_password: '',
            confirm_password: '',
        }
    }

    login(event) {
        event.preventDefault();

        let body = this.state;
        console.log('log in', body);
        $('.loading').show();

        $.ajax({
            url: Common.BACKEND + '/authenticate',
            method: 'POST',
            data: body,
            success: function (data) {
                $('.loading').hide();
                console.log(data);

                let user = {
                    token: data.auth_token,
                    logged_in: true
                }
                Common.login(user);
            },
            error: function (error) {
                $('.loading').hide();
                Common.notify('error', 'Invalid credentials!');
            }
        })
    }

    register(event) {
        event.preventDefault();

        if (this.state.signup_password !== this.state.confirm_password) {
            Common.notify('error', 'Confirm password does not match!');
            return;
        }

        let body = {
            email: this.state.signup_email,
            password: this.state.password
        };
        console.log('register', body);
        let self = this;
        $('.loading').show();

        $.ajax({
            url: Common.BACKEND + '/register',
            method: 'POST',
            data: body,
            success: function (data) {
                $('.loading').hide();
                console.log(data);
                Common.notify('success', data.message);
                self.closeRegisterModal();
            },
            error: function (error) {
                Common.handleError(error);
            }
        })
    }

    handleChange(event) {
        let name = event.target.name;
        let state = this.state;
        state[name] = event.target.value;
        this.setState(state);
    }

    logout() {
        Common.logout();
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
    }

    openRegisterModal() {
        this.setState({
            registerVisible: true
        });
    }

    closeRegisterModal() {
        this.setState({
            registerVisible: false
        });
    }

    render() {

        return (
            <div>
                <header className="header">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <a className="navbar-brand" href="/">
                            <img src="/assets/img/logo.png" height="30px" alt="" />
                        </a>
                        <div className="navbar-links float-right">
                            {Common.loggedIn() ?
                                <div>
                                    <Link to="/profile">
                                        {strings.myProfile}
                                    </Link>
                                    <span className="ml-2 mr-2">/</span>
                                    <Link to="#" onClick={this.logout}>
                                        {strings.logout}
                                    </Link>
                                </div>
                            :
                                <div>
                                    <Link to="#" onClick={this.openModal.bind(this)}>
                                        {strings.signIn}
                                    </Link>
                                    <span className="ml-2 mr-2">/</span>
                                    <Link to="#" onClick={this.openRegisterModal.bind(this)}>
                                        {strings.signUp}
                                    </Link>
                                </div>
                            }
                        </div>
                    </nav>
                </header>

                {/* Modals */}
                <Modal
                    visible={this.state.visible}
                    width="400"
                    height="365"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div className="popup-modal">
                        <div className="popup-body signup-container">
                            <form className="modal-body" action="#" onSubmit={this.login.bind(this)}>
                                <h3>{strings.signIn}</h3>
                                <hr/>
                                <div className="form-group-container">
                                    <div className="form-group row">
                                        <div className="col-md-3">
                                            {strings.email}:
                                    </div>
                                        <div className="col-md-9">
                                            <input className="form-control" name='email' type='email' value={this.state.email} required
                                                onChange={this.handleChange.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-3">
                                            {strings.password}:
                                    </div>
                                        <div className="col-md-9">
                                            <input className="form-control" type="password" name='password' value={this.state.password} required
                                                onChange={this.handleChange.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary btn-rounded sign-button">{strings.login}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
                <Modal
                    visible={this.state.registerVisible}
                    width="450"
                    height="415"
                    effect="fadeInUp"
                    onClickAway={() => this.closeRegisterModal()}
                >
                    <div className="popup-modal">
                        <div className="popup-body signup-container">
                            <form className="modal-body" action="#" onSubmit={this.register.bind(this)}>
                                <h3>{strings.signUp}</h3>
                                <hr />
                                <div className="form-group-container">
                                    <div className="form-group row">
                                        <div className="col-md-3">
                                            {strings.email}:
                                    </div>
                                        <div className="col-md-9">
                                            <input className="form-control" name='signup_email' type='email' value={this.state.signup_email} required
                                                onChange={this.handleChange.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-3">
                                            {strings.password}:
                                    </div>
                                        <div className="col-md-9">
                                            <input className="form-control" type="password" name='signup_password' value={this.state.signup_password} required
                                                onChange={this.handleChange.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-3">
                                            {strings.confirmPassword}:
                                    </div>
                                        <div className="col-md-9">
                                            <input className="form-control" type="password" name='confirm_password' value={this.state.confirm_password} required
                                                onChange={this.handleChange.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary btn-rounded sign-button" data-dismiss="modal">{strings.signUp}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

}