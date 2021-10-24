import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Box, ChakraProvider, Container, Flex, Stack } from '@chakra-ui/react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Footer from './Footer';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProofSet from './ProofSet';

const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/centrehq/usdc',
    cache: new InMemoryCache(),
});

console.log('process.env.PUBLIC_URL', process.env.PUBLIC_URL);

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider>
            <ApolloProvider client={client}>
                <Flex
                    style={{ height: '100vh' }}
                    direction={'column'}
                    justifyContent={'space-between'}
                >
                    <Box bgGradient="linear(to-b, orange.50, transparent)">
                        <Container>
                            <Stack>
                                <img src="./logo.svg" alt="" />
                                <BrowserRouter
                                    basename={process.env.PUBLIC_URL}
                                >
                                    <Switch>
                                        <Route path="/:proofHash">
                                            <ProofSet />
                                        </Route>
                                        <Route path="/">
                                            <App />
                                        </Route>
                                    </Switch>
                                </BrowserRouter>
                            </Stack>
                        </Container>
                    </Box>
                    <Footer />
                </Flex>
            </ApolloProvider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
