"use strict"

import {combineReducers} from 'redux';

import {booksReducers} from './boosReducers';
import {cartReducers} from './cartReducers'


export default combineReducers({
    books:booksReducers,
    cart:cartReducers
})