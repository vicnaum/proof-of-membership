import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, Container } from '@chakra-ui/react';
import {
    ApolloClient,
    ApolloProvider,
    gql,
    InMemoryCache,
} from '@apollo/client';
import {
    HyperThemeEditor,
    ThemeEditorProvider,
} from '@hypertheme-editor/chakra-ui';
import Footer from './Footer';

const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/centrehq/usdc',
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider>
            <ThemeEditorProvider>
                <ApolloProvider client={client}>
                    <Container>
                        <App />
                    </Container>
                    <Footer />
                </ApolloProvider>
            </ThemeEditorProvider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
