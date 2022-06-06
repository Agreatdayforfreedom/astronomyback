import * as dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import { runDatabase } from './database';
import routerPost from './routes/post';
import routerUser from './routes/auth';
import routerMessage from './routes/message';
dotenv.config();

if(!process.env.PORT){
    process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();
runDatabase();

app.set('port', PORT);

/*
 * middlewares 
 */

app.use(express.json());
app.use(cors());

/*
* routes
*/

app.use('/api/post', routerPost);
app.use('/api/auth', routerUser);
app.use('/api/message', routerMessage);

export default app;