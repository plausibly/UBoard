import express from 'express';
import db from './models/index';
import emailRoute from './routes/emailRoute';

const app = express();
const port = 8080;
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/v1/test", (req: express.Request, res: express.Response) => {
    res.send({ express: 'Hello From Express' });
});

app.use(emailRoute);

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
})