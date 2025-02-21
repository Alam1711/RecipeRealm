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
  Text,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useCallback } from "react";
import { Formik, Field } from "formik";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../authentication/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useShowToast } from "../../hooks/showToast";

const DeleteAccountModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const auth = getAuth();
  const [isSaving, setIsSaving] = useState(false);
  const email = JSON.parse(localStorage.getItem("EMAIL") as string);
  const navigate = useNavigate();
  const showToast = useShowToast();

  const passInitValues = {
    password: "",
  };

  const handleSubmit = useCallback(
    async (values: any) => {
      setIsSaving(true);
      const user = auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(email, values.password);
        const authenticated = reauthenticateWithCredential(user, credential)
          .then(async (snap) => {
            await deleteDoc(doc(db, "users", email));
            const deleted = user?.delete();
            const q = query(
              collection(db, "posts/"),
              where("email", "==", email)
            );
            const docs = await getDocs(q);
            docs.forEach((doc) => {
              deleteDoc(doc.ref);
            });
            navigate("/login");
            showToast("success", "Account deleted successfully");
          })
          .catch((error) => {
            showToast("error", "Error deleting account");
            setIsSaving(false);
          });
      }
      onClose();
    },
    [onClose]
  );

  return (
    <>
      <Button colorScheme="red" variant="ghost" size="sm" onClick={onOpen}>
        Delete Account
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik onSubmit={handleSubmit} initialValues={passInitValues}>
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Text>
                    Are you sure? You can't undo this action afterwards.
                  </Text>
                  <FormControl isRequired>
                    <FormLabel>Enter Password</FormLabel>
                    <Field as={Input} type="password" name="password" />
                  </FormControl>

                  <ModalFooter>
                    <Button variant="subtle" onClick={onClose}>
                      Cancel
                    </Button>
                    <Spacer />
                    <Button
                      colorScheme="red"
                      mr={3}
                      type="submit"
                      isLoading={isSaving}
                    >
                      Delete Account
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

export default DeleteAccountModal;
