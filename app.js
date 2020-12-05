const appSrc = (express, bodyParser, createReadStream, crypto, http) => {

    const LOGIN = 'mariianasonkina';

    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE'
    };

    const contentType = {
        "Content-Type": "text/html; charset=utf-8"
    };


    const finalHandler = (e, r, rs, n) => {
        rs.status(e.status).set({
            ...contentType,
            ...CORS
        }).send(`Error: ${rs.statusCode}`)
    };

    const getClientRequest = async (url, httpModule) => {
        return new Promise((resolve, reject) => {

            const request = httpModule.get(url, (resp) => {
                const data = [];
                resp.on('error', (err) => {
                    reject(err);
                });
                resp.on('data', (chunk) => data.push(chunk));
                resp.on('end', () => {
                    resolve(data.join(''));
                });

            });

            request.on('error', (err) => {
                reject(err);
            });

        })

    }

    const app = express();

    app
        .use((req, resp, next) => {
            resp
                .status(200)
                .set({
                    ...contentType,
                    ...CORS
                });
            next();
        })
    app
        .all('/', r => {
            r.res.send(LOGIN);
        })

    app
        .use(bodyParser.urlencoded({
            extended: true
        }))

        .get('/login/', r => {
            r.res.send(LOGIN);
        })

        .get('/code/', r => {
            createReadStream(
                import.meta.url.substring(7)).pipe(r.res);
        })

        .get('/sha1/:input', r => {
            const hash = crypto.createHash('sha1').update(r.params.input).digest('hex');
            r.res.send(hash);
        })

        .all('/req/', async (req, res) => {
            const address = req.method === 'GET' ? req.query.addr : req.body.addr;

            if (address) {
                try {
                    const clientResponse = await getClientRequest(address, http).catch((err) => {
                        throw new Error(err);
                    });
                    return res.send(clientResponse);

                } catch (err) {
                    return res.send('not ok');
                }
            }
            return res.send(`I'm terribly sorry, could not get addr`);
        })


        .all(/./, (req, res) => res
            .status(200)
            .set({
                ...contentType,
                ...CORS
            })
            .end(LOGIN)
        )
        .use(finalHandler)
        .set('x-powered-by', false);

    return app;
};

export default appSrc