import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));

// enable cors
app.use(cors());

app.get('/status', (_: Request, res: Response) => {
  res.status(200).json({ status: 'ok', envs: process.env });
});

app.get('/favicon.ico', (_: Request, res: Response) => {
  res.sendStatus(204);
});

/* app.get("/get-cache", async (req, res) => {
    const { key } = req.query;
    const data = await cache.getAsync(key)
    return res.status(200).json(data)
})
app.get("/set-cache", async (req, res) => {
    const { key, val } = req.query;
    if(key && val){
        await cache.setAsync(key, JSON.stringify(val))
        return res.status(200).json({ status: "success", key, val})
    }
    return res.status(200).json({ status: "failed", key, val })
}) */

// Routes
// app.use('/api/v1', apiRoutesV1);

export default app;
