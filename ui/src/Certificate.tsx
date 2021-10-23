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
import QRCode from 'react-qr-code';

const Certificate = ({ isOpen, isClose, membershipProof }: any) => {
    return (
        <Modal isOpen={isOpen} onClose={isClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Certificate</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Center>
                        {/*<img src="./certificate.svg" alt="" />*/}
                        <QRCode value={membershipProof} />
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
