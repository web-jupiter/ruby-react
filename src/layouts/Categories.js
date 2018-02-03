import React from 'react';
import './Categories.css'
import App from '../App';
import { Common } from '../Common'


export class Categories extends React.Component {
    constructor(props) {
        super(props);

        this.state = { categories: [] };
    }

    componentDidMount() {
        this.createList();
    }

    componentDidUpdate() {
        App.self.onResized();
    }
    
    createList() {
        fetch(Common.BACKEND + '/category/index', {
            method: 'GET',
        })
            .then(results => results.json())
            .then(data => this.setState({ categories: data }))
            .catch(function (error) { console.log(error) });
    }

    render() {
        const categories = this.state.categories.map((item, i) => (
            <div key={item.id} className='col-md-3 category-item'>
                <a href={"/companies/" + item.id + "/1"}>{item.name}</a>
            </div>
        ));

        return (
            <div className="categories">
                <div className="row">
                    {categories}
                </div>
            </div>
        );
    }

}