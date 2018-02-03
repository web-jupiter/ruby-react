import { Component } from 'react';
import { notify } from 'react-notify-toast';
import $ from 'jquery';
import { strings } from './Localization';

export class Common extends Component {

    static BACKEND = "http://138.197.203.247:3000";

    static login(user) {
        localStorage.setItem('_user', JSON.stringify(user));
        window.location.reload();
    }

    static logout() {
        let user = {
            token: '',
            logged_in: false
        }
        localStorage.setItem('_user', JSON.stringify(user));
        window.location.reload();
    }

    static loggedIn() {
        return !Common.isNone(Common.getToken());
    }

    static getUser() {
        let user = localStorage.getItem('_user');
        if(user === null) {
            return null;
        }

        return JSON.parse(user);
    }

    static getToken() {
        let user = Common.getUser();
        if(user === null) {
            return null;
        }

        return user.token;
    }

    static handleError(error) {
        $('.loading').hide();

        console.error(error);
        // if (error.status === 401) {
        //     Common.logout();
        //     return;
        // }
        // if (error.status === 0) {
        //     Common.notify('error', 'Server connection error!');
        //     if (Common.loggedIn()) {
        //         Common.logout();
        //     }
        //     return;
        // }
        let msg = '';
        if (error.errorMessage !== undefined) {
            msg = error.errorMessage;
        } else if (error.responseJSON !== undefined) {
            if (error.responseJSON.message !== undefined) {
                if (error.responseJSON.message.message !== undefined) {
                    msg = error.responseJSON.message.message;
                } else {
                    msg = error.responseJSON.message;
                }
            } else if (error.responseJSON.error) {
                msg = error.responseJSON.error;
            } else {
                msg = 'Some errors happended!';
            }
        } else {
            msg = 'Some errors happended!';
        }
        Common.notify('error', msg);
    }

    static isNone(value) {
        return value === '' || value === undefined || value === null || value === 'null';
    }
    
    static today() {
        return (new Date()).toISOString().split("T")[0];
    }

    static diff(date, server_time) {
        let today = new Date(server_time);
        let timeDiff = Math.abs(today.getTime() - date.getTime());
        if(timeDiff < 1000 * 60) {
            return Math.floor(timeDiff / 1000).toString() + strings.second;
        } else if (timeDiff < 1000 * 3600) {
            return Math.floor(timeDiff / (1000 * 60)).toString() + strings.minute;
        } else if (timeDiff < 1000 * 3600 * 24) {
            return Math.floor(timeDiff / (1000 * 3600)).toString() + strings.hour;
        } else if(timeDiff < 1000 * 3600 * 24 * 7) {
            return Math.floor(timeDiff / (1000 * 3600 * 24)).toString() + strings.day;
        } else if (timeDiff < 1000 * 3600 * 24 * 30) {
            return Math.floor(timeDiff / (1000 * 3600 * 24 * 7)).toString() + strings.week;
        } else if (timeDiff < 1000 * 3600 * 24 * 365) {
            return Math.floor(timeDiff / (1000 * 3600 * 24 * 30)).toString() + strings.month;
        } else {
            return Math.floor(timeDiff / (1000 * 3600 * 24 * 365)).toString() + strings.year;
        }
    }

    static truncate(text, len) {
        if(text.length > len) {
            return text.substr(0, len) + '...';
        } else {
            return text;
        }
    }

    static clone(object) {
        let new_object = {};
        for(let key in object) {
            new_object[key] = object[key];
        }

        return new_object;
    }

    static sortHot(array, pageSize) {
        let data = [];
        let a_array = [];
        let b_array = [];

        for(let i in array) {
            let row = array[i];
            if (row.company.is_hot) {
                row.company['number'] = strings.hot;
                a_array.push(row);
            } else {
                b_array.push(row);
            }
        }

        a_array = a_array.sort(function (a, b) { return b.rate.rate - a.rate.rate; });
        b_array = b_array.sort(function (a, b) { return b.rate.rate - a.rate.rate; });

        for(let i in b_array) {
            b_array[i].company.number = '#' + (parseInt(i, 10) + 1);
            if (i % pageSize === 0) {
                for(let j in a_array) {
                    data.push(a_array[j]);
                }
            }
            data.push(b_array[i]);
        }

        return {
            companies: data,
            hotCount: a_array.length
        };
    }

    static getCompanyLinkName(name) {
        name = name.split(" ").join("+").split("/").join("~");

        return name;
    }

    static notify(type, msg) {
        if (type === 'success') {
            notify.show(msg, 'success');
        } else if (type === 'error') {
            notify.show(msg, 'error');
        } else if (type === 'warning') {
            notify.show(msg, 'warning');
        }
    }
}