"use strict"

import axios from 'axios';

export function getBooks() {
    return function (dispatch) {

        axios.get('/api/book')
            .then(function (res) {

                dispatch({
                    type: "GET_BOOK",
                    payload: res.data
                })
            })
            .catch(function (err) {
                dispatch({
                    type: "GET_BOOK_REJECTED",
                    payload: err
                })
            })

    }
}
export function postBooks(book) {
    return function(dispatch){

        axios.post('/api/bookstore',book[0])
            .then(function(res){

                dispatch({
                    type: "POST_BOOK",
                    payload:res.data
                })
            })
            .catch(function (err) {
                dispatch({
                    type: "POST_BOOK_REJECTED",
                    payload:"THERE WAS AN ERROR WHILE POSTING NEW BOOK"
                })
            })
    }


    // return{
    //     type: "POST_BOOK",
    //     payload:book
    // }

}
export function deleteBooks(id) {
    return function (dispatch) {
        axios.delete('/api/bookstore/'+id)
            .then(function(res){
                dispatch({
                    type:"DELETE_BOOK",
                    payload:id
                })
            })
            .catch(function (err) {
                dispatch({
                    type: "DELETE_BOOK_REJECTED",
                    payload: err
                })
            })
    }
}

export function updateBooks(book) {
    return{
        type:"UPDATE_BOOK",
        payload:book
    }
}

export function resetButton(book) {
    return{
        type:"RESET_BUTTON",
    }
}