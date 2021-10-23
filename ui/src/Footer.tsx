import { Box, Link } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Box bg="tomato" w="100%" p={4} color="white" mt={20}>
            Crafted by the{' '}
            <Link href="https://nethermind.io/" isExternal>
                Nethermind team
            </Link>
        </Box>
    );
};

export default Footer;
