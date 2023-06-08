const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookieParser');
const session = require('express-session');
const passport = require('passport');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();

const indexRouter = require('./routes');
