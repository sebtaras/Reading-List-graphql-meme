import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull } from "graphql";
import { books, authors } from "../dummyData.js";
import pkg from "lodash";
import Book from "../models/Book.js";
import Author from "../models/Author.js";
import Mongoose from "mongoose";

const { find, filter } = pkg;

const BookType = new GraphQLObjectType({
	name: "Book",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, arg) {
				return Author.findById(parent.authorId);
			},
		},
	}),
});

const AuthorType = new GraphQLObjectType({
	name: "Author",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: GraphQLList(BookType),
			resolve(parent, arg) {
				return Book.find({ authorId: parent.id });
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Book.findById(args.id);
			},
		},
		books: {
			type: GraphQLList(BookType),
			resolve(parent, args) {
				return Book.find({});
			},
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Author.findById(args.id);
			},
		},
		authors: {
			type: GraphQLList(AuthorType),
			resolve(parent, args) {
				return Author.find({});
			},
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				let author = new Author({
					name: args.name,
					age: args.age,
				});
				return author.save();
			},
		},
		addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId,
				});
				return book.save();
			},
		},
		removeBook: {
			type: BookType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				return Book.findByIdAndDelete(args.id);
			},
		},
	},
});

export default new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
