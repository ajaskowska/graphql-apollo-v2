import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink } from '@apollo/client';

const link = createHttpLink({
    uri: 'http://localhost:5000/graphql',
    credentials: 'include'
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <GoogleOAuthProvider clientId='1053437263950-d5d8ccirrvt942lva50m8qnl560ukld3.apps.googleusercontent.com'>
                <App />
            </GoogleOAuthProvider>
        </ApolloProvider>
    </React.StrictMode>
);
