"use strict"

export function booksReducers(state = {
    books:[]
}, action) {
    switch (action.type) {
        case "POST_BOOK":
            //console.log('books=',[...state.books,...action.payload])
            return {...state,books:[...state.books,...action.payload],msg:"Saved! click to continue",style:"success",validation:'success'};
            break;
        case "POST_BOOK_REJECTED":
            //console.log('books=',[...state.books,...action.payload])
            return {...state,msg:"Please, try again",style:"danger",validation:'error'};
            break;
        case "RESET_BUTTON":
            //console.log('books=',[...state.books,...action.payload])
            return {...state,msg:null,style:"primary",validation:null};
            break;
        case "GET_BOOK":

            return {...state, books: [...action.payload]};
            break;
        case "DELETE_BOOK":
            const currentBookToDelete=[...state.books];
            const indexToDelete=currentBookToDelete.findIndex(
                function (book) {
                    return book._id == action.payload;
                }
            )
            return {books:[...currentBookToDelete.slice(0,indexToDelete),
                ...currentBookToDelete.slice(indexToDelete+1)
            ]}
            break;
        case "UPDATE_BOOK":
            const currentBookToUpdate=[...state.books];
            const indexToUpdate=currentBookToUpdate.findIndex(
                function (book) {
                    return book._id === action.payload._id;
                }
            )

            const newBookToUpdate={
                ...currentBookToUpdate[indexToUpdate],
                title:action.payload.title
            }

            console.log('what is it newBookToUpdate',newBookToUpdate)

            return {books:[...currentBookToUpdate.slice(0,indexToUpdate),newBookToUpdate,
                ...currentBookToUpdate.slice(indexToUpdate+1)
            ]}
            break;
    }
    return state;
}
