"use strict"

import axios from 'axios';
import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {renderToString} from 'react-dom/server';
import {match,RouterContext} from 'react-router';

import reducers from './src/reducers/index';
import routes from './src/routes';

function handleRender(req,res) {
    axios.get('http://localhost:3001/book')
        .then(function (response) {
            //console.log(res)
            debugger
            //var myHtml=JSON.stringify(response.data);
          // res.render('index',{ myHtml })
           // console.log('store--',response.data)

            const store=createStore(reducers,{"books":{"books":response.data}});
            //console.log('store--',store)

            const initialState=JSON.stringify(store.getState()).replace(/<\/script/g,
            '<\\/script').replace(/<!--/g,'<\\!--');
            //console.log('initialState--',initialState)

            const Routes={
                routes:routes,
                location:req.url
            }

            match(Routes,function (error,redirect,props) {
                //console.log('error--',error)
               // console.log('redirect--',redirect)
               // console.log('props--',props)
                //console.log('store--',response.data)

                if(error){
                    res.status(500).send("error fullfilling the request")
                }else if(redirect){
                    res.status(302,redirect.pathname+redirect.search)
                }else if(props){
                    debugger
                    const reactComponent = renderToString(
                        <Provider store={store} >
                            <RouterContext {...props}/>
                        </Provider>
                    )
                   // console.log('reactComponent--',reactComponent)

                    res.status(200).render('index',{reactComponent,initialState})
                }else {
                    res.status(404).send("not found");
                }
            })

        })
        .catch(function (err) {
            console.log('# initial server side rendering error',err);
         })
}
module.exports = handleRender;