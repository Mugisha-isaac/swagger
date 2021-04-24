const express =require('express');
const cors = require('cors');
const morgan = require('morgan');
const low = require('lowdb');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const FileSync = require('lowdb/adapters/FileSync');
const booksRouter = require('./routes/books');

const adapters = new FileSync('db.json');
const db = low(adapters);
db.defaults({books:[]}).write();

const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Library info",
            version:"1.0.0",
            desctiption:"A Simple Express Api Libraly"
        },
        servers:
            [
                {
                url:"http://locahost:4000"
                }
            ]
        },
        apis:["./routes/*.js"]
}
const specs = swaggerJsDoc(options);
const app = express();
app.db = db;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(specs))
app.use('books',booksRouter);

const PORT = process.env.PORT || 4000

app.listen(PORT,()=>console.log(`app is running on the port ${PORT}`));
