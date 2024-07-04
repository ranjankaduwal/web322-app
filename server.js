/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Ranjan Kaduwal
Student ID: 126578228
Date: 3 July, 2024
Vercel Web App URL: 
GitHub Repository URL: 

********************************************************************************/ 
const express = require('express');
const app = express();
const path = require('path');
const storeService = require('./store-service');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/shop', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Shop</title>
            <link rel="stylesheet" href="/css/bootstrap.css"> 
            <link rel="stylesheet" href="/css/main.css"> 
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">Web322 – Assignment 3 - Ranjan Kaduwal</a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/shop">Shop</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/about">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/items">Items</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/categories">Categories</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="container mt-5">
                <div class="row">
                    <div class="col-md-12">
                        <h2>Shop</h2>
                        <div id="shop-container"></div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2024 Ranjan Kaduwal. All rights reserved.</p>
            </div>
            <script src="/js/main.js"></script>
        </body>
        </html>
    `);
});

app.get('/shop-data', (req, res) => {
    storeService.getPublishedItems()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

app.get('/items', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Items</title>
            <link rel="stylesheet" href="/css/bootstrap.css"> 
            <link rel="stylesheet" href="/css/main.css"> 
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">Web322 – Assignment 3 - Ranjan Kaduwal</a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/shop">Shop</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/about">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/items">Items</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/categories">Categories</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="container mt-5">
                <div class="row">
                    <div class="col-md-12">
                        <h2>Items</h2>
                        <div id="items-container"></div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2024 Ranjan Kaduwal. All rights reserved.</p>
            </div>
            <script src="/js/main.js"></script>
        </body>
        </html>
    `);
});

app.get('/items-data', (req, res) => {
    storeService.getAllItems()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

app.get('/categories', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Categories</title>
            <link rel="stylesheet" href="/css/bootstrap.css"> 
            <link rel="stylesheet" href="/css/main.css"> 
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">Web322 – Assignment 3 - Ranjan Kaduwal</a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/shop">Shop</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/about">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/items">Items</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/categories">Categories</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="container mt-5">
                <div class="row">
                    <div class="col-md-12">
                        <h2>Categories</h2>
                        <div id="categories-container"></div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2024 Ranjan Kaduwal. All rights reserved.</p>
            </div>
            <script src="/js/main.js"></script>
        </body>
        </html>
    `);
});

app.get('/categories-data', (req, res) => {
    storeService.getCategories()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

// Catch-all route for unmatched paths
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

const PORT = process.env.PORT || 8080;

storeService.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Express http server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(`Unable to start server: ${err}`);
    });
