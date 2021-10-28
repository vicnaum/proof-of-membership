export interface postAddressSetBody {
    proofHash: string;
    minUsdc: number | undefined;
    maxUsdc: number | undefined;
    setSize: number | undefined;
    addressSet: Object;
    proof: Object;
}

export const postAddressSet = (body: postAddressSetBody) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key':
                '$2b$10$rJt/jHy0W/OoJaX3Som3lu7NepipWzBp/QviO0c28o8Zad0.0RHaO',
        },
        body: JSON.stringify(body),
    };

    return fetch('https://api.jsonbin.io/v3/b', requestOptions).then(
        (response) => response.json(),
    );
};
