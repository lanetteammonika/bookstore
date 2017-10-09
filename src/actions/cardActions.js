"use strict"

import axios from 'axios';

export function getCart(){
    return function (dispatch) {
        axios.get('api/cart')
            .then(function(response){
                dispatch({
                    type:"GET_CART",
                    payload:response.data
                })
            })
            .catch(function(err){
                dispatch({
                    type:"GET_CART_REJECTED",
                    msg:"error while getting the cart from session"
                })
            })
    }
}


export function addToCart(book) {
    return function (dispatch) {
        axios.post('/api/cart',book)
            .then(function(res){
                dispatch(
                    {
                        type:"ADD_TO_CART",
                        payload: res.data
                    }
                )
            })
            .catch(function(err){
                dispatch(
                    {
                        type:"ADD_TO_CART_REJECTED",
                        msg:"error when adding to the cart"
                    }
                )
            })
    }
    

}

export function updateToCart(_id,unit,cart) {
    const currentBookToUpdate=cart;
    const indexToUpdate=currentBookToUpdate.findIndex(
        function (cart) {
            return cart._id === _id;
        }
    )

    const newBookToUpdate={
        ...currentBookToUpdate[indexToUpdate],
        quantity:currentBookToUpdate[indexToUpdate].quantity+unit
    }



    let cartUpdate=[...currentBookToUpdate.slice(0,indexToUpdate),newBookToUpdate,
        ...currentBookToUpdate.slice(indexToUpdate+1)
    ]

    return function (dispatch) {
        axios.post('/api/cart',cartUpdate)
            .then(function(res){
                dispatch(
                    {
                        type:"UPDATE_TO_CART",
                        payload: res.data
                    }
                )
            })
            .catch(function(err){
                dispatch(
                    {
                        type:"UPDATE_TO_CART_REJECTED",
                        msg:"error when adding to the cart"
                    }
                )
            })
    }

    return{
        type:"UPDATE_TO_CART",
        payload:cartUpdate
    }
}

export function deleteToCart(cart) {
    return function (dispatch) {
        axios.post('/api/cart',cart)
            .then(function(res){
                dispatch(
                    {
                        type:"DELETE_TO_CART",
                        payload: res.data
                    }
                )
            })
            .catch(function(err){
                dispatch(
                    {
                        type:"DELETE_TO_CART_REJECTED",
                        msg:"error when adding to the cart"
                    }
                )
            })
    }

}