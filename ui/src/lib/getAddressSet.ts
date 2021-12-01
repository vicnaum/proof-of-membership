export const getAddressSet = async (proofHash: string): Promise<any> => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key':
                '$2b$10$rJt/jHy0W/OoJaX3Som3lu7NepipWzBp/QviO0c28o8Zad0.0RHaO',
        },
    }

    try {
        const responseObj = await fetch(
            `https://api.jsonbin.io/v3/b/${proofHash}/latest`,
            requestOptions,
        )
        const responseJson = await responseObj.json()
        console.log('responseJson', responseJson)

        return responseJson.record.addressSet.data.users
    } catch (e) {
        console.log('error', e)
        return []
    }
}