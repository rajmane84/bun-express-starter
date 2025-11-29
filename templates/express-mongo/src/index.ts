import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  origin: process.env.CORS_ORIGIN
}))
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  return res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
