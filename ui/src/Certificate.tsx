import {
    Button,
    Center,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';

const Certificate = ({ isOpen, isClose }: any) => {
    return (
        <Modal isOpen={isOpen} onClose={isClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Certificate</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Center>
                        <img src="./certificate.svg" alt="" />
                    </Center>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost">Print</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Certificate;
