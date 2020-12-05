import express from 'express';
import bodyParser from 'body-parser';
import {
    createReadStream
} from 'fs';
import crypto from 'crypto';
import http from 'http';

import appSrc from './app.js';


(() => {

    const PORT = process.env.PORT || 3000;


    const app = appSrc(express, bodyParser, createReadStream, crypto, http);

    app.listen(PORT, console.log(`Listening at ${PORT}, PID: ${process.pid}`));

})()