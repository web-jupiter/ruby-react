import React from 'react';
import './Profile.css'
import $ from 'jquery';
import { strings } from '../Localization';
import { Common } from '../Common';


const DEFAULT_AVATAR = '/assets/img/avatar.png';

export class Profile extends React.Component {

    static self = this;

    constructor(props) {
        super(props);

        this.state = {
            first_name: '',
            last_name: '',
            changingAvatar: false,
            avatar: DEFAULT_AVATAR,
            avatar_src: DEFAULT_AVATAR,
            level: 10,
            review_count: 100,
            vote_count: 1000,
        }
    }

    componentDidMount() {
        document.title = 'WeRate - Profile';
        let self = this;

        $('#avatarInput').change(function (event) {
            var FR = new FileReader();

            FR.addEventListener("load", function (e) {
                let type = e.target['result'].split("/")[0];
                if (type !== 'data:image') {
                    Common.notify('warning', 'Please select an image.');
                } else {
                    self.setState({ avatar_src: e.target['result'] });
                }
            });

            FR.readAsDataURL(event.target.files[0]);
        });
    }

    onSubmit(event) {
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

    handleChange(event) {
        let name = event.target.name;
        let state = this.state;
        state[name] = event.target.value;
        this.setState(state);
    }

    changeAvatar(flag) {
        if(!flag) {
            this.setState({
                avatar_src: this.state.avatar,
                changingAvatar: false
            });

            $('#avatarInput').val('');
        } else {
            this.setState({
                changingAvatar: true
            });
        }
    }

    uploadAvatar() {

    }
    
    render() {
        let profile = this.state;
        let showFileInput = profile.changingAvatar ? { display: 'block' } : { display: 'none' };
        let showChangeButton = !profile.changingAvatar ? { display: 'block' } : { display: 'none' };

        return (
            <div>
                <div className="profile-header">
                    <div className="profile-form">
                        <div className="row">
                            <div className="col-md-3 text-center">
                                <img src={profile.avatar_src} alt="" width="150px" />
                                <div className="mt-3">
                                    <div style={showChangeButton}>
                                        <button type="button" className="btn btn-primary small-button btn-sm"
                                            onClick={this.changeAvatar.bind(this, true)}><i className="fa fa-pencil"></i> {strings.changeAvatar}</button>
                                    </div>
                                    <div style={showFileInput}>
                                        <input id="avatarInput" type="file" className="btn-sm" style={{ width: 220 }} />
                                        <div className="mt-2">
                                            <button type="button" className="btn btn-primary small-button btn-sm"
                                                onClick={this.uploadAvatar.bind(this)}>{strings.upload}</button>
                                            <button type="button" className="btn btn-default small-button btn-sm ml-2 avatar-cancel-button"
                                                onClick={this.changeAvatar.bind(this, false)}>{strings.cancel}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <h5 style={{ fontWeight: 'bold' }}>{profile.first_name} {profile.last_name}</h5>
                                <div>
                                    <label>{strings.level} :</label>
                                    &nbsp;
                                    <span>{profile.level}</span>
                                </div>
                                <div>
                                    <label>{strings.reviewCount} :</label>
                                    &nbsp;
                                    <span>{profile.review_count}</span>
                                </div>
                                <div>
                                    <label>{strings.voteCount} :</label>
                                    &nbsp;
                                    <span>{profile.vote_count}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-body">
                    <div className="row">
                        <div className="col-md-9">
                            Reviews
                        </div>
                        <div className="col-md-3">
                            <label className="label-description-title">WeRate</label>
                            <p className="label-description-description">10/F, The Wave, 4 Hing Yip Street, Kwun Tong, Hong Kong</p>
                            <label className="label-description-email">{strings.adminEmail}</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}