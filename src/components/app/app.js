import React, { Component } from 'react';

import AppHeader from "../app-header";
import SearchPanel from "../search-panel";
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter/';
import ItemAddForm from '../item-add-form/';
import './app.css';

export default class App extends Component {
    maxID = 100;

    state = {
        todoData: [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Learn React'),
            this.createTodoItem('Make App')
        ],
        term: '',
        filter: 'all'
    };

    createTodoItem(label) {
        return {
            label,
            important: false,
            done: false,
            id: this.maxID++,
        };
    };

    deleteItem = id => {
        this.setState(({todoData}) => {
            const idx = todoData.findIndex(el => el.id === id);

            const newArr = [
                ...todoData.slice(0, idx), 
                ...todoData.slice(idx + 1)
            ];

            return {
                todoData: newArr
            };
        });
    };

    addItem = text => {
        const newItem = this.createTodoItem(text);

        this.setState(({todoData}) => {
            console.log('added', text);

            const newArr = [...todoData, newItem];

            return {
                todoData: newArr
            };
        });
    };

    toggleProp(arr, id, propName) {

        const idx = arr.findIndex(el => el.id === id);
        const oldItem = arr[idx];
        const newItem = {...oldItem, [propName]: !oldItem[propName]};

        return [
            ...arr.slice(0, idx),
            newItem, 
            ...arr.slice(idx + 1)
        ];
    }

    toggleImportant = id => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProp(todoData, id, 'important')
            };
        });
    };

    toggleDone = id => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProp(todoData, id, 'done')
            };
        });
    };

    searchChange = term => {
        this.setState({term});
    };

    filterChange = filter => {
        this.setState({filter});
    }

    search(items, term) {
        if (term.length === 0) {
            return items;
        }

        return items.filter(item => item.label.toLowerCase()
            .indexOf(term.toLowerCase()) > -1);
    }

    filter(items, filter) {
        if (filter === 'active') {
            return items.filter(item => !item.done);
        } else if (filter === 'done') {
            return items.filter(item => item.done);
        }
        return items;
    };

    render() {
        const {todoData, term, filter} = this.state;

        const visibleItems = this.filter(this.search(todoData, term), filter);
    
        const doneCount = todoData.filter(el => el.done).length;
        const todoCount = todoData.length - doneCount;

        return (
            <div className="todo-app">
                <AppHeader todo={todoCount} done={doneCount} />
                <div className="top-panel d-flex">
                    <SearchPanel onSearchChange={this.searchChange}/>
                    <ItemStatusFilter onFilterChange={this.filterChange}
                        filter={filter} />
                </div>
                <TodoList todos={visibleItems}
                    onDeleted={this.deleteItem}
                    onToggleImportant={this.toggleImportant}
                    onToggleDone={this.toggleDone} />
                <ItemAddForm onItemAdded={this.addItem} />
            </div>
        );
    }
}; 
