import React from 'react';
import './Admin.css'
import { strings } from '../Localization';
import $ from 'jquery';
import { Common } from '../Common';


export class Admin extends React.Component {

    static self;
    static category_id;
    static company_id;
    static company_creating = true;
    static company;
    static category_creating = true;

    constructor(props) {
        super(props);

        this.state = { 
            categories: [],
            category_name: ''
        };

        Admin.self = this;
    }
    
    componentDidMount() {
        this.createList();
    }

    componentDidUpdate() {
        let self = this;
        let category_id = localStorage.getItem('admin_category_id');

        if ($('#category-' + category_id).length === 0 || category_id === null) {
            let firstCategory = $('.admin-category-item').first();
            self.selectCategory(firstCategory.attr('data-id'));
        } else {
            self.selectCategory(category_id);
        }

        $('.admin-category-item').click(function () {
            self.selectCategory($(this).attr('data-id'));
        });
    }

    selectCategory(id) {
        Admin.category_id = id;
        localStorage.setItem('admin_category_id', id);
        $('.admin-category-item.active').removeClass('active');
        $('#category-' + id).addClass('active');
        // console.log('select category', id);
        this.createCompanies(id);
    }

    selectCompany(id) {
        $('.admin-company-item.active').removeClass('active');
        if(id === 0) {
            return;
        } else if (id === undefined) {
            $('#categorySelectButton, #companyEditButton, #companyDeleteButton').addClass('disable');
            return;
        }

        $('#categorySelectButton, #companyEditButton, #companyDeleteButton').removeClass('disable');
        
        Admin.company_id = id;
        $('#company-' + id).addClass('active');
        // console.log('select company', id);

        $('.loading').show();

        fetch(Common.BACKEND + '/company/show?id=' + id, {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                $('.loading').hide();

                Admin.company = data.company;
                this.refreshCompany();

                let ids = [];
                let categories = data.categories;
                for (let i in categories) {
                    ids.push(categories[i].id);
                }
                this.checkCategoryList(ids);
            })
            .catch(function (error) {
                Common.handleError(error);
            });
    }

    createList() {
        fetch(Common.BACKEND + '/category/index', {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => this.setState({ categories: data }))
            .catch(function (error) { console.log(error) });
    }

    createCompanies(id) {
        $('.loading').show();

        fetch(Common.BACKEND + '/company/category?id=' + id, {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                $('.loading').hide();


                // data.companies = Common.sortHot(data.companies);
                let html = '';
                console.log(data.companies);
                for(let i in data.companies) {
                    let item = data.companies[i].company;
                    let url = '/company/' + Common.getCompanyLinkName(item.name) + "/" + item.id + "/1";
                    html += '<div id="company-' + item.id + '" class="admin-company-item" data-id="' + item.id + '">';
                    html +=     '<a href="' + url + '" class="green-link">' + item.name + '</a>';
                    html += '</div>';
                }
                $("#companyContainer").html(html);

                // Company events
                let firstCompany = $('.admin-company-item').first();
                Admin.self.selectCompany(firstCompany.attr('data-id'));

                $('.admin-company-item').click(function () {
                    Admin.self.selectCompany($(this).attr('data-id'));
                });
            })
            .catch(function (error) { console.log(error) });
    }

    handleChangeCategory(event) {
        let state = Admin.self.state;
        state.category_name = event.target.value;
        Admin.self.setState(state);
    }

    addCategory() {
        $('.company-input[name=name]').val('');
        $('.company-input[name=description]').val('');

        Admin.category_creating = true;
    }

    deleteCategory() {
        if (!window.confirm('Are you sure to delete this category?')) {
            return;
        }
        console.log('delete category', Admin.category_id);
        $('.loading').show();
        
        fetch(Common.BACKEND + '/category/delete?id=' + Admin.category_id, {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                $('.loading').hide();
                
                window.location.reload();
            })
            .catch(function (error) { console.log(error) });
    }

    editCategory() {
        let id = Admin.category_id;
        console.log('edit category', id);
        let category;
        for(let i in this.state.categories) {
            let row = this.state.categories[i];
            if (parseInt(row.id, 10) === parseInt(id, 10)) {
                category = row;
                break;
            }
        }
        console.log(category);

        $('.category-input[name=name]').val(category.name);
        $('.category-input[name=description]').val(category.description);

        Admin.category_creating = false;
    }

    refreshCompany() {
        let company = Admin.company;
        $('.company-input[name=name]').val(company.name);
        $('.company-input[name=description]').val(company.description);
        $('.company-input[name=year_found]').val(company.year_found);
        $('.company-input[name=headquarter]').val(company.headquarter);
        $('.company-input[name=size]').val(company.size);
        $('.company-input[name=site]').val(company.site);
        $('.company-input[name=email]').val(company.email);
        $('.company-input[name=phone]').val(company.phone);
        $('.company-input[name=services]').val(company.services);
    }

    addCompany() {
        Admin.company = {
            name: '',
            description: '',
            year_found: '',
            headquarter: '',
            size: '',
            site: '',
            email: '',
            phone: '',
            services: '',
        }
        Admin.company_creating = true;
        $('#categorySelectButton, #companyEditButton, #companyDeleteButton').addClass('disable');
        this.refreshCompany();
        this.selectCompany(0);
    }

    deleteCompany() {
        if(!window.confirm('Are you sure to delete this company?')) {
            return;
        }
        let id = Admin.company_id;
        console.log('delete company', id);
        $('.loading').show();

        fetch(Common.BACKEND + '/company/delete?id=' + id, {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => {
                $('.loading').hide();

                this.createCompanies(Admin.category_id);
            })
            .catch(function (error) {
                Common.handleError(error);
            });
    }

    editCompany() {
        let id = Admin.company_id;
        Admin.company_creating = false;
        console.log('edit company', id);
    }

    getCompanyForm() {
        Admin.company = {
            name: $('.company-input[name=name]').val(),
            description: $('.company-input[name=description]').val(),
            year_found: $('.company-input[name=year_found]').val(),
            headquarter: $('.company-input[name=headquarter]').val(),
            size: $('.company-input[name=size]').val(),
            site: $('.company-input[name=site]').val(),
            email: $('.company-input[name=email]').val(),
            phone: $('.company-input[name=phone]').val(),
            services: $('.company-input[name=services]').val()
        }
    }

    onSubmitCompany(event) {
        event.preventDefault();

        let creating = Admin.company_creating;
        console.log('submit creating', creating);
        console.log('company', Admin.company);
        Admin.self.getCompanyForm();
        $('.loading').show();

        if(creating) {
            $.ajax({
                url: Common.BACKEND + '/company/create',
                method: 'POST',
                data: {
                    company: Admin.company,
                    category_id: Admin.category_id,
                    auth_token: Common.getToken()
                },
                success: function (data) {
                    $('.loading').hide();

                    window.location.reload();
                },
                error: function (error) {
                    Common.handleError(error);
                }
            })
        } else {
            $.ajax({
                url: Common.BACKEND + '/company/update',
                method: 'POST',
                data: {
                    id: Admin.company_id,
                    company: Admin.company,
                    auth_token: Common.getToken()
                },
                success: function (data) {
                    $('.loading').hide();

                    window.location.reload();
                },
                error: function (error) {
                    Common.handleError(error);
                }
            })
        }
    }

    openCategoryList() {       
        
    }

    onSubmitCategory(event) {
        event.preventDefault();

        let name = $('.category-input[name=name]').val();
        let description = $('.category-input[name=description]').val();

        let url;
        let body = {
            name: name,
            description: description
        };
        if(Admin.category_creating) {
            url = Common.BACKEND + '/category/create';
        } else {
            body['id'] = Admin.category_id;
            url = Common.BACKEND + '/category/update';
        }

        console.log('submit category', name);
        $('.loading').show();

        $.ajax({
            url: url,
            method: 'POST',
            data: body,
            success: function (data) {
                $('.loading').hide();

                window.location.reload();
            },
            error: function (error) {
                Common.handleError(error);
            }
        });
    }

    checkCategoryList(ids) {
        // console.log(ids);
        $('.select-category-item input').each(function(i, item) {
            $(item)[0].checked = false;
        });

        for(let i in ids) {
            $('#select-category-' + ids[i] + ' input')[0].checked = true;
        }
    }

    onSubmitCategoryList() {
        console.log('submit category list');
        
        let ids = [];
        $('.select-category-item input:checked').each(function(i, item) {
            if(item.checked) {
                ids.push($(this).parent().parent().attr('data-id'));
            }
        });
        
        $.ajax({
            url: Common.BACKEND + '/company/updateCategories',
            method: 'POST',
            data: {
                category_ids: ids,
                company_id: Admin.company_id,
                auth_token: Common.getToken()
            },
            success: function (data) {
                $('.loading').hide();

                window.location.reload();
            },
            error: function (error) {
                Common.handleError(error);
            }
        })
    }

    render() {
        if (this.state.categories.length === 0) {
            return (<div></div>);
        }

        const categories = this.state.categories.map((item, i) => (
            <div key={item.id} id={'category-' + item.id} className='admin-category-item'
                data-id={item.id}>
                {item.name}
            </div>
        ));

        const selectCategories = this.state.categories.map((category, i) => (
            <div key={category.id} id={'select-category-' + category.id} className='select-category-item'
                data-id={category.id}>
                <label><input type="checkbox" /> <span>{category.name}</span></label>
            </div>
        ));

        return (
            <div>
                <div className="admin-header">
                    <h2><i className="fa fa-cogs"></i> {strings.administrator}</h2>
                    <p className="admin-description">
                        - {strings.adminDescription1}
                        <br />
                        - {strings.adminDescription2}
                    </p>
                </div>
                <div className="admin-body">
                    <div className="admin-form box-shadow" onSubmit={this.submit}>
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className='admin-list-header'>{strings.categories}</h4>
                                <div className="input-group" style={{ marginBottom: '20px' }}>
                                    <button className="admin-button-add" style={{width: '100%'}}
                                        onClick={() => this.addCategory()}
                                        data-toggle="modal" data-target="#categoryModal">
                                        <i className="fa fa-plus"></i> {strings.category}
                                    </button>
                                </div>
                                <div id="categoryContainer">
                                    {categories}
                                </div>
                                <div style={{marginTop: '30px', textAlign: 'center'}}>
                                    <button className="admin-button-edit"
                                        onClick={() => this.editCategory()}
                                        data-toggle="modal" data-target="#categoryModal">
                                        <i className="fa fa-pencil"></i> {strings.edit}
                                    </button>

                                    <button className="admin-button-delete"
                                        onClick={() => this.deleteCategory()}>
                                        <i className="fa fa-trash-o"></i> {strings.delete}
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h4 className='admin-list-header'>{strings.companies}</h4>
                                <div style={{textAlign: 'center'}}>
                                    <button className="admin-button-add" data-toggle="modal" data-target="#companyModal"
                                        onClick={() => this.addCompany()}>
                                        <i className="fa fa-plus"></i> {strings.company}
                                    </button>
                                    <button className="admin-button-category" data-toggle="modal" data-target="#categoryListModal"
                                        onClick={() => this.openCategoryList()} id="categorySelectButton">
                                        <i className="fa fa-sitemap"></i> {strings.category}
                                    </button>
                                </div>
                                <div id="companyContainer"></div>
                                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                    <button className="admin-button-edit" data-toggle="modal" data-target="#companyModal"
                                        onClick={() => this.editCompany()} id="companyEditButton">
                                        <i className="fa fa-pencil"></i> {strings.category}
                                    </button>
                                    <button className="admin-button-delete"
                                        onClick={() => this.deleteCompany()} id="companyDeleteButton">
                                        <i className="fa fa-trash-o"></i> {strings.delete}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="companyModal" tabIndex="-1" role="dialog" aria-labelledby="companyModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <form className="modal-content" onSubmit={this.onSubmitCompany}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="companyModalLabel">{strings.edit} {strings.company}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.name}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control company-input" name="name" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.description}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <textarea className="form-control company-input" rows="5" name="description"></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.yearFounded}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control company-input" type="number" name="year_found" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.headquarter}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control company-input" name="headquarter" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.companySize}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control company-input" name="size" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.website}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control company-input" name="site" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.email}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control company-input" name="email" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.phone}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control company-input" name="phone" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.services}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control company-input" name="services" />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-first" data-dismiss="modal">{strings.close}</button>
                                <button type="submit" className="btn btn-secondary btn-submit">{strings.submit}</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="modal fade" id="categoryListModal" tabIndex="-1" role="dialog" aria-labelledby="categoryListModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="categoryListModalLabel">{strings.selectCategories}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {selectCategories}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-first" data-dismiss="modal">{strings.close}</button>
                                <button type="button" className="btn btn-secondary btn-submit" data-dismiss="modal"
                                    onClick={this.onSubmitCategoryList}>{strings.submit}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="categoryModal" tabIndex="-1" role="dialog" aria-labelledby="categoryModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <form className="modal-content" onSubmit={this.onSubmitCategory}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="categoryModalLabel">{strings.edit} {strings.category}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.name}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <input className="form-control category-input" name="name" required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label>{strings.description}</label>
                                    </div>
                                    <div className="col-md-10">
                                        <textarea className="form-control category-input" rows="5" name="description" required></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-first" data-dismiss="modal">{strings.close}</button>
                                <button type="submit" className="btn btn-secondary btn-submit">{strings.submit}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

}