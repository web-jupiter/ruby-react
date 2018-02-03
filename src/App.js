import React, {Component} from 'react';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Notifications from 'react-notify-toast';
import { Header } from './layouts/Header';
import { Footer } from './layouts/Footer';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { Review } from './pages/Review';
import { Companies } from './pages/Companies';
import { Company } from './pages/Company';
import { Profile } from './pages/Profile';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Admin } from './pages/Admin';
import $ from 'jquery';
import { Common } from './Common';

export const HomeView = () => (
    <Home />
);

export const ContactView = () => (
    <Contact />
);

export const ReveiwView = () => (
    <Review />
);

export const CompaniesView = () => (
    <Companies />
);

export const ProfileView = () => (
    <Profile />
);

export const CompanyView = () => (
    <Company />
);

export const TermsView = () => (
    <Terms />
);

export const PrivacyView = () => (
    <Privacy />
);

export const AdminView = () => (
    <Admin />
);

class App extends Component {

    constructor(props) {
        super(props);

        App.self = this;
    }

    componentDidMount() {
        let self = this;
        this.onResized();

        $(window).resize(function() {
            self.onResized();
        })
    }

    onResized() {
        let height = $(window).height() - $('header').height() - $('.footer').height() - 70;
        $('.content-wrapper').css('min-height', height);
    }

    render() {

        return (
            <Router>
                <div className="App">
                    <Notifications />
                    <Header />
                    <div className="content-wrapper">
                        <Route exact path="/" component={HomeView} />
                        <Route exact path="/companies/:id/:page" component={CompaniesView} />
                        <Route exact path="/search/:search/:page" component={CompaniesView} />
                        <Route exact path="/company/:name/:id/:page" component={CompanyView} />
                        <Route exact path="/review/:id" component={ReveiwView} />
                        <Route exact path="/review/edit/:id" component={ReveiwView} />
                        <Route exact path="/contact" component={ContactView} />
                        <Route exact path="/profile" component={ProfileView} />
                        <Route exact path="/terms" component={TermsView} />
                        <Route exact path="/privacy" component={PrivacyView} />
                        {Common.loggedIn() ?
                            <Route exact path="/admin" component={AdminView} />
                            : null}
                    </div>
                    <Footer />
                    <div className="loading" style={{display: 'none'}}>Loading&#8230;</div>
                </div>
            </Router>
        );
    }

}

export default App;
