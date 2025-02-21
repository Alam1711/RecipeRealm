import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Field, Formik } from "formik";
import React, { useCallback, useState } from "react";
import { useShowToast } from "../../hooks/showToast";
import { passUpdateValues } from "../InterfaceTypes/types";

const UpdatePassword: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const auth = getAuth();

  const showToast = useShowToast();
  const [isSaving, setIsSaving] = useState(false);
  const email = JSON.parse(localStorage.getItem("EMAIL") as string);

  const passInitValues: passUpdateValues = {
    username: "",
    oldPassword: "",
    newPassword: "",
  };

  const handleSubmit = useCallback(
    async (values: passUpdateValues) => {
      // Handle form submission here
      setIsSaving(true);
      const credential = EmailAuthProvider.credential(
        email,
        values.oldPassword
      );
      const user = auth.currentUser;
      if (user) {
        // reauthenticate the user with the oldPassword
        reauthenticateWithCredential(user, credential)
          .then(async () => {
            await updatePassword(user, values.newPassword);
            showToast("success", "Password updated successfully");
            setIsSaving(false);
            onClose();
          })
          .catch(() => {
            showToast("error", "Error updating credentials");
            setIsSaving(false);
          });
      }
    },
    [auth, email, showToast, onClose]
  );

  return (
    <>
      <Button variant="ghost" onClick={onOpen} size="sm">
        Update Password
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik onSubmit={handleSubmit} initialValues={passInitValues}>
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <FormControl id="username" isRequired>
                    <FormLabel>Username</FormLabel>
                    <Field as={Input} type="text" name="username" />
                  </FormControl>
                  <FormControl id="old-password" isRequired mt={4}>
                    <FormLabel>Old Password</FormLabel>
                    <Field as={Input} type="password" name="oldPassword" />
                  </FormControl>
                  <FormControl id="new-password" isRequired mt={4}>
                    <FormLabel>New Password</FormLabel>
                    <Field as={Input} type="password" name="newPassword" />
                  </FormControl>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      type="submit"
                      isLoading={isSaving}
                    >
                      Update
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatePassword;
