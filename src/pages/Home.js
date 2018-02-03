import React from 'react';
import './Home.css'
import { strings } from '../Localization';
import $ from 'jquery';
import { Common } from '../Common';

export class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            suggestions: []
        }
    }

    componentDidMount() {
        document.title = 'WeRate';
        var self = this;
        
        $('#searchIcon').click(function() {
            self.search();
        })
        $('#searchInput').keyup(function(event) {
            if(event.key === 'Enter') {
                self.search();
            } else {
                self.suggest();
            }
        });

        this.onResized();

        $(window).resize(function() {
            self.onResized();
        })
    }

    onResized() {
        window.setInterval(function(){
            let rate = 0.65;
            if($(window).width() < 700) rate = 0.85;
            let height = $(".logo-bg").height() * rate;
            $(".logo-container").height(height);
            $(".logo-container").css('margin-top', - height - 20);
            $(".logo-container").fadeIn();
        }, 1);
    }

    search() {
        let search = $('#searchInput').val();
        if(search === '') {
            alert('Please type your search keyword.');
            return;
        }

        window.location.href = '/search/' + search + "/1";
    }

    suggest() {
        let search = $('#searchInput').val();

        fetch(Common.BACKEND + '/company/suggest?key=' + search, {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                $('.loading').hide();
                console.log(data.length);
                this.setState({suggestions: data})
                if(data.length > 0) {
                    $('.suggestion-container').show();
                } else {
                    $('.suggestion-container').hide();
                }
            })
            .catch(function (error) { Common.handleError(error) });
    }

    render() {
        const suggestions = this.state.suggestions.map((item, i) => (
            <div key={item.id} className='suggestion-item'>
                <a href={'/company/' + Common.getCompanyLinkName(item.name) + '/' + item.id + '/1'}>{item.name}</a>
            </div>
        ));

        return (
            <div>
                <img className="logo-bg" src="/assets/img/city-background.jpeg" alt="" />
                <div className="logo-container">
                    <h1 className="site-title">{strings.siteTitle}</h1>
                    <p>{strings.siteDescription1}</p>
                    <p className="site-description2">{strings.siteDescription2}</p>
                    <div className="search-container">
                        <div className="row">
                            <div className="col-md-3" style={{textAlign: 'center'}}>
                                <label className="search-company">{strings.searchCompany}</label>
                            </div>
                            <div className="col-md-9" style={{ padding: '0', width: '100%' }}>
                                <input id="searchInput" className="search-input" />
                                <span id="searchIcon"><i className="fa fa-search"></i></span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-9">
                                <div className='suggestion-container'>
                                    {suggestions}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}