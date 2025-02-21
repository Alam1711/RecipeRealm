import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Input,
  Button,
  Image,
  Spacer,
  useColorModeValue,
  Stack,
  Text,
  Center,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../authentication/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import LoginNavbar from "../../components/HeaderFooters/LoginNav";
import { Formik, Form, Field } from "formik";
import { setEmail } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  useEffect(() => {
    localStorage.removeItem("EMAIL");
  }, []);

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const initialValues = {
    email: "",
    password: "",
  };

  const signIn = (values: { email: string; password: string }) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.clear();
        localStorage.setItem("EMAIL", JSON.stringify(values.email));
        //set email from auth slice

        dispatch(setEmail(values.email));
        if (user.email !== null) {
          navigate("../recipes");
        }
      })
      .catch((e) => {
        toast({
          title: "Incorrect Information",
          description: "We could not validate your information",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <LoginNavbar />
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        direction="column"
        backgroundColor={"#D3D3D3"}
        backgroundImage={
          "url(https://hips.hearstapps.com/hmg-prod/images/wdy050113taco-01-1624540365.jpg)"
        }
      >
        <Box
          boxShadow="dark-lg"
          backgroundColor="white"
          p={8}
          borderWidth={2}
          borderRadius={15}
          bg="primary.50"
        >
          <Center>
            <Image
              borderRadius="30px"
              src="newlogoteal.png"
              alt="Logo"
              w={350}
              mb={15}
            />
          </Center>
          <Center>
            <Text as="b" fontSize={30} marginBottom={4}>
              Login below to start your experience!
            </Text>
          </Center>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              signIn(values);
              actions.setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field name="email">
                  {({ field }: { field: any }) => (
                    <Input
                      {...field}
                      placeholder="Email"
                      variant="filled"
                      mb={4}
                    />
                  )}
                </Field>
                <InputGroup size="md">
                  <Field name="password">
                    {({ field }: { field: any }) => (
                      <Input
                        {...field}
                        variant="filled"
                        mb={6}
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                      />
                    )}
                  </Field>
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShow(!show)}
                    >
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Flex>
                  <Link to="/signup">
                    <Button
                      color="teal"
                      colorScheme="white"
                      size="lg"
                      variant="outline"
                    >
                      <Text color="teal">Sign up</Text>
                    </Button>
                  </Link>
                  <Spacer />
                  <Button
                    colorScheme="teal"
                    size="lg"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Login
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
      <Stack
        bg={useColorModeValue("gray.50", "gray.800")}
        py={16}
        px={8}
        spacing={{ base: 8, md: 10 }}
        align={"center"}
        direction={"column"}
      >
        <Box textAlign={"center"}></Box>
      </Stack>
    </>
  );
};

export default Login;
