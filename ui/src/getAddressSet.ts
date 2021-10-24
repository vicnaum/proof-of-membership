export const getAddressSet = (proofHash: string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key':
                '$2b$10$rJt/jHy0W/OoJaX3Som3lu7NepipWzBp/QviO0c28o8Zad0.0RHaO',
        },
    };

    return fetch(
        `https://api.jsonbin.io/v3/b/${proofHash}/latest`,
        requestOptions,
    ).then((response) => response.json());
};
