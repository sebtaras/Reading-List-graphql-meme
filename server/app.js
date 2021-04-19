import express from "express";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import schema from "./schema/schema.js";
import cors from "cors";
import { CONN_STRING } from "./config.js";
const app = express();
app.use(cors());

mongoose.connect(CONN_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
	console.log("Connected to database");
});

app.use(
	"/graphql",
	graphqlHTTP({
		graphiql: true,
		schema: schema,
	})
);

app.listen(5000, () => {
	console.log("Listening on 5000");
});
