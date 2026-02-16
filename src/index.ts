import express, { static as static_} from "express";
import dotenv from "dotenv";
dotenv.config()
import { engine } from "express-handlebars";
import path from "path";
import router from "./app/routes"
import { dbConnect } from "./database";

const port = process.env.PORT || 3000;
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views")
app.use("/static", static_(path.join(__dirname, "..", "public")));
app.use(router);


app.get("", (req, res) => {
  res.render("home");
});

dbConnect().then(() => {
  app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
})


