/*********************************************************************************
WEB322 – Assignment 06
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Ranjan Kaduwal
Student ID: 126578228
Date: 31 July, 2024
Vercel Web App URL: https://web322-app322.vercel.app/
GitHub Repository URL: https://github.com/ranjankaduwal/web322-app.git

********************************************************************************/ 
const express = require('express');
const app = express();
const path = require('path');
const storeService = require('./store-service');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const exphbs = require('express-handlebars');

cloudinary.config({
    cloud_name: 'CloudName',
    api_key: '769313811728214',
    api_secret: 'GB7JqNv19TuJ5skC3JbIXQ7Li7k',
    secure: true
});

const hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        safeHTML: function (context) {
        return new hbs.handlebars.SafeString(context);
    },
        navLink: function (url, options) {
            return '<li' +
                ((url === app.locals.activeRoute) ? ' class="nav-item active"' : ' class="nav-item"') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue !== rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        formatDate: function (dateObj) {
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

const upload = multer();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

app.get('/', (req, res) => {
    res.redirect('/shop');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/shop', (req, res) => {
    let viewData = {};

    storeService.getPublishedItems()
        .then(items => {
            viewData.items = items;
        }).catch(err => {
            viewData.message = "no results";
        }).then(storeService.getCategories)
        .then(categories => {
            viewData.categories = categories;
        }).catch(err => {
            viewData.categoriesMessage = "no results";
        }).then(() => {
            res.render('shop', { data: viewData });
        });
});

app.get('/shop/:id', (req, res) => {
    let viewData = {};

    storeService.getItemById(req.params.id).then(item => {
        viewData.item = item;
    }).catch(err => {
        viewData.message = "no results";
    }).then(storeService.getPublishedItems)
        .then(items => {
            viewData.items = items;
        }).catch(err => {
            viewData.message = "no results";
        }).then(storeService.getCategories)
        .then(categories => {
            viewData.categories = categories;
        }).catch(err => {
            viewData.categoriesMessage = "no results";
        }).then(() => {
            res.render('shop', { data: viewData });
        });
});

app.get('/items', (req, res) => {
    if (req.query.category) {
        storeService.getItemsByCategory(req.query.category)
            .then(data => res.render('items', { items: data }))
            .catch(err => res.render('items', { message: "no results" }));
    } else if (req.query.minDate) {
        storeService.getItemsByMinDate(req.query.minDate)
            .then(data => res.render('items', { items: data }))
            .catch(err => res.render('items', { message: "no results" }));
    } else {
        storeService.getAllItems()
            .then(data => res.render('items', { items: data }))
            .catch(err => res.render('items', { message: "no results" }));
    }
});

app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(data => res.render('categories', { categories: data }))
        .catch(err => res.render('categories', { message: "no results" }));
});

app.get('/items/add', (req, res) => {
    storeService.getCategories()
        .then(data => res.render('addItem', { categories: data }))
        .catch(err => res.render('addItem', { categories: [] }));
});

app.post('/items/add', upload.single('featureImage'), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded) => {
            processItem(uploaded.url);
        });
    } else if (req.body.imageUrl) {
        processItem(req.body.imageUrl);
    } else {
        processItem('');
    }

    function processItem(imageUrl) {
        req.body.featureImage = imageUrl;
        req.body.itemDate = new Date().toISOString().split('T')[0]; // Set the date when the item is added

        storeService.addItem(req.body).then(() => {
            res.redirect('/items');
        }).catch(err => {
            res.status(500).send('Unable to add item');
        });
    }
});

app.get('/item/:id', (req, res) => {
    storeService.getItemById(req.params.id)
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

app.get('/categories/add', (req, res) => {
    res.render('addCategory');
});

app.post('/categories/add', (req, res) => {
    storeService.addCategory(req.body)
        .then(() => res.redirect('/categories'))
        .catch(err => res.status(500).send('Unable to add category'));
});

app.get('/categories/delete/:id', (req, res) => {
    storeService.deleteCategoryById(req.params.id)
        .then(() => res.redirect('/categories'))
        .catch(err => res.status(500).send('Unable to remove category / category not found'));
});

app.get('/items/delete/:id', (req, res) => {
    storeService.deleteItemById(req.params.id)
        .then(() => res.redirect('/items'))
        .catch(err => res.status(500).send('Unable to remove item / item not found'));
});

app.use((req, res) => {
    res.status(404).render('404');
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