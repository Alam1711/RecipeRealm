import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Avatar,
  VStack,
  Box,
} from "@chakra-ui/react";
import { db, storage } from "../../authentication/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useShowToast } from "../../hooks/showToast";
import { useDocumentData } from "react-firebase-hooks/firestore";

export interface ChangeProfilePicProps {
  isEditProfilePage: boolean;
}

const ChangeProfilePic: React.FC<ChangeProfilePicProps> = ({
  isEditProfilePage,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const email = JSON.parse(localStorage.getItem("EMAIL") as string);
  const [profile] = useDocumentData(doc(db, "users/", email));
  const showToast = useShowToast();

  async function uploadImage(file: any) {
    try {
      const storageRef = ref(storage, email + "Profile");

      uploadBytes(storageRef, file).then(async (snapshot) => {
        const userRef = doc(db, "users/", email);

        await getDownloadURL(snapshot.ref).then(async (link) => {
          await updateDoc(userRef, {
            profilePic: link,
          });
        });
      });
      onClose();
    } catch (error) {
      showToast("error", "Error uploading image");
    }
  }

  return (
    <>
      {isEditProfilePage === false ? (
        <Button onClick={onOpen} variant="ghost" size="sm">
          Change Profile
        </Button>
      ) : (
        <Button onClick={onOpen} variant="solid" size="sm">
          Change Profile Picture
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Profile Picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Choose Profile Picture to uplaod</Text>
            <Text pb={5} fontSize="xs" color="gray.500">
              {`No files above 500Tb *`}
            </Text>
            {profile?.profilePic && (
              <VStack pb={5}>
                <Avatar
                  size="2xl"
                  name={
                    // default's to the current user's initials
                    profile?.name
                  }
                  src={
                    // display the current user's profile picture
                    profile?.profilePic
                  }
                />
              </VStack>
            )}
            <Box pl={20}>
              <input
                type="file"
                name="myImage"
                onChange={(event) => {
                  if (event?.target?.files) {
                    uploadImage(event.target.files[0]);
                  }
                }}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangeProfilePic;
