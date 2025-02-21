import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { db, storage } from "../authentication/firebaseConfig";
import Navbar from "../components/HeaderFooters/Navbar";

import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ChangeProfilePic from "../components/AccountSettings/changeProfilePic";
import AccountSettingsMenu from "../components/AccountSettingsMenu";
import { useShowToast } from "../hooks/showToast";

// function to check if a username is unique
async function uniqueUsername(username: string): Promise<boolean> {
  const queryUsernames = await getDocs(collection(db, "users"));
  // get the usernames
  const usernames = queryUsernames.docs.map((doc) => doc.data().username);
  // if the username parameter is in the username array, return true
  if (usernames.includes(username)) {
    return false;
  }
  return true;
}
/**
 * FUnction to populate data onto Profile page
 * @returns
 */
const Profile: React.FC = () => {
  const bgC = useColorModeValue("gray.300", "gray.400");
  const [isEditing, setIsEditing] = useState(false); //checks if user is editing
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = JSON.parse(localStorage.getItem("EMAIL") as string); // get the current user's email from local storage
  const headerColor = useColorModeValue("gray.300", "gray.700");
  const [profile] = useDocumentData(doc(db, "users/", email)); //listener to the user's profile
  const navigate = useNavigate(); // navigate hook to switch between pages
  const [selectedFile, setSelectedFile] = useState<any>();
  const docRef = doc(db, "users/", email);
  const showToast = useShowToast();

  const validEdit = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    biography: Yup.string().required("Biography is required"),
    name: Yup.string().required("Name is required"),
  });

  const initVariables = {
    username: profile?.username,
    biography: profile?.biography,
    email: email,
    name: profile?.name,
  };

  useEffect(() => {
    if (profile) {
      getDownloadURL(ref(storage, profile.profilePic)).then((url) =>
        setSelectedFile(url)
      );
    }
  }, [profile]);

  console.log("PROF", profile);
  const onSubmitForm = async (values: any): Promise<void> => {
    setIsSubmitting(true);
    const unique = await uniqueUsername(values.username);
    if (!unique && values.username !== profile?.username) {
      console.log(profile?.username);
      console.log(values.username);
      showToast("error", "Username already exists");
    }
    try {
      await updateDoc(docRef, {
        username: values.username,
        biography: values.biography,
        name: values.name,
      }).then(() => {
        showToast("success", "Profile updated successfully");
        setIsEditing(false);
        setIsSubmitting(false);
      });
    } catch (error) {
      showToast("error", "Error updating profile");
    }
  };

  return (
    <>
      <Navbar pageHeader="Profile Page" />

      <Flex justify="center" align="center" h="100vh">
        <Grid templateColumns="1fr 3fr" gap={6} w="full" maxW="8xl" p={6}>
          <Box
            w="80%"
            borderColor={headerColor}
            borderWidth={1}
            borderRadius="md"
            fontSize="md"
          >
            <Box bgColor={headerColor} p={2} borderTopRadius="md">
              <Text>Account Settings</Text>
            </Box>
            <Box p={2}>
              <AccountSettingsMenu />
            </Box>
          </Box>
          <Box>
            <Stack
              spacing={4}
              w={"full"}
              bg={useColorModeValue("white", "gray.700")}
              rounded={"xl"}
              boxShadow={"lg"}
              p={6}
              my={12}
            >
              <HStack>
                <VStack>
                  <Heading
                    lineHeight={1.1}
                    fontSize={{ base: "2xl", sm: "3xl" }}
                  >
                    Edit Profile
                  </Heading>
                  <Button
                    leftIcon={<FaEdit />}
                    onClick={() => {
                      setIsEditing(!isEditing);
                    }}
                    colorScheme={isEditing ? "red" : "teal"}
                    mr={2}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  <ChangeProfilePic isEditProfilePage={true} />
                </VStack>
                <Spacer />

                {selectedFile && (
                  <VStack>
                    <Avatar size="2xl" src={profile?.profilePic} />
                  </VStack>
                )}
              </HStack>
              <Box height="4px" bg={bgC} my={2} borderRadius="sm" />
              {profile ? (
                <Formik
                  onSubmit={onSubmitForm}
                  initialValues={initVariables}
                  validationSchema={validEdit}
                >
                  {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <Stack spacing={4}>
                        <FormControl>
                          <FormLabel>Full Name</FormLabel>
                          <Field
                            as={Input}
                            name="name"
                            isDisabled={!isEditing}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Username</FormLabel>
                          <Field
                            as={Input}
                            name="username"
                            isDisabled={!isEditing}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Field
                            as={Input}
                            name="email"
                            isDisabled={!isEditing}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Biography</FormLabel>
                          <Field
                            as={Input}
                            name="biography"
                            isDisabled={!isEditing}
                            minHeight={150}
                          />
                        </FormControl>
                        {isEditing && (
                          <Button
                            type="submit"
                            colorScheme="teal"
                            isDisabled={isSubmitting}
                          >
                            Save
                          </Button>
                        )}
                      </Stack>
                    </form>
                  )}
                </Formik>
              ) : (
                <Text>Loading...</Text>
              )}
            </Stack>
          </Box>
        </Grid>
      </Flex>
    </>
  );
};

export default Profile;
