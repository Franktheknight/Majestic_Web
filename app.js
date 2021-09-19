if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const blogs = require("./routes/blog");
const bcrypt = require("bcrypt");
const correctPass = process.env.SECRET;
const session = require("express-session");
const secret = process.env.SESSION;
const flash = require("connect-flash");
const MongoStore = require('connect-mongo');
const admin = "Admin";
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/majestic-web";
const catchAsync = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

const returnTo = (req, res, next) => {
    if(req.method === "GET") {
        req.session.returnTo = req.originalUrl;
        return next();
    } else return next();
}

//needs session to log me in, and there is only one user--Frank
//anyone can leave a comments, no registration needed
//Front-end is crucial here, learn svg animations
// const dbUrl = "mongodb://localhost:27017/majestic-web"
mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("once", () => {
    console.log("Database connected");
})


const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        secret: secret,
        touchAfter: 24 * 3600 
      }),
    name: 'sessionID',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, when using Https protocols
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const app = express();
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session(sessionConfig));
app.use(returnTo);
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


//There are five link, this is the home page, make it beautiful
app.get("/", (req, res) => {
    res.render("home");
})

//This shall be the about page, about frank
app.get("/about", (req, res) => {
    res.render("about")
})

//This shall be the project page this may also be a route?
app.get("/project", (req, res) => {
    res.render("project");
})

//This shall be the post ROUTE
app.use("/blogs", blogs );

//a login post request through chatbot
app.post("/login", catchAsync(async (req, res) => {
    const { password } = req.body;
    const hashPass = await bcrypt.hash(correctPass, 12);
    const validation = await bcrypt.compare(password, hashPass);
    if(validation) {
        req.session.user_id = admin;
        const returnUrl = req.session.returnTo || "/";
        req.flash("success", "Welcome back, Frank")
        res.redirect(returnUrl);
    }
    else {
        req.flash("error", "Incorrect Passwords");
        const returnUrl = req.session.returnTo || "/";
        res.redirect(returnUrl);
    };
}))

app.post("/logout", (req, res) => {
    req.session.user_id = null;
    const returnUrl = req.session.returnTo || "/";
    req.flash("success", "You have logout, Frank")
    res.redirect(returnUrl);
})

//This shall be the music page
app.get("/music", (req, res) => {
    res.render("jazz");
})
//needs an interesting error page in the end

app.all('*', (req, res, next) => {
    next(new ExpressError('Are you looking for a crypto treasure? Not in my website', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on Port ${port}`);
})