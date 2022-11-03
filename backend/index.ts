//Apollo & Graohql imports
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import expressPlayground from "graphql-playground-middleware-express";
import {typeDefs} from './graphql/typeDefs';
import {resolvers} from './graphql/resolvers';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import {makeExecutableSchema} from "@graphql-tools/schema";

//Middlewares and other imports
import express from 'express';
import cookieParser from "cookie-parser";
import { json } from 'body-parser';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import "dotenv/config";
import session from 'express-session';
import passport from 'passport';
import './services/passportStrategy';

//Routes imports
import authRoutes from "./routes/auth";
import {isAuthenticated} from "./middlewares/isAuthenticated";

async function startApolloServer() {

    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('DB CONNECTED'));

    const app = express();

    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });


    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            }
            ],
    });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer({ schema }, wsServer);

    await server.start();

    app.use(cors({
        origin: ["http://localhost:3000", "https://studio.apollographql.com"],
        methods: "GET, POST, PUT, DELETE",
        credentials: true
    }));
    app.use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(        //<-- set middleware
        '/graphql',
        json(),
        cookieParser(),
        expressMiddleware(server, {     //<-- add to apollo context
            context: async({ req }) => (
                {
                    session: req.session,
                }),
        }),
    );

    //Google Auth
    app.get('/', (req, res) => {
        res.send('<a href="/auth/google"> Authenticate with google</a>');
    })

    app.use("/auth", authRoutes);

    app.get('/auth/failure', (req, res) => {
        res.send('something went wrong. Login failed!')
    })

    app.get("/protected", isAuthenticated, (req, res) => {
        console.log(req.user);
        res.send("Congrats, you are authenticated");
    });

    app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

    await new Promise<void>((res) =>
        httpServer.listen({ port: 5000 }, res));
}

startApolloServer().then(() => console.log(`Server is ready at http://localhost:5000/`));