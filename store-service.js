/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Ranjan Kaduwal
Student ID: 126578228
Date: 1 July, 2024
Vercel Web App URL: 
GitHub Repository URL: 

********************************************************************************/ 
const fs = require('fs');
let items = [];
let categories = [];

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/items.json', 'utf8', (err, data) => {
            if (err) {
                reject('unable to read file');
            } else {
                items = JSON.parse(data);
                fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                    if (err) {
                        reject('unable to read file');
                    } else {
                        categories = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
};

module.exports.getAllItems = function() {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            reject('no results returned');
        } else {
            resolve(items);
        }
    });
};

module.exports.getPublishedItems = function() {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);
        if (publishedItems.length === 0) {
            reject('no results returned');
        } else {
            resolve(publishedItems);
        }
    });
};

module.exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            reject('no results returned');
        } else {
            resolve(categories);
        }
    });
};
