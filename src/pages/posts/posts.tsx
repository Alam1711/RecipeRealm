import React, { useState, useEffect } from "react";
import { db, storage } from "../../authentication/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/HeaderFooters/Navbar";
import { Grid, GridItem, Spacer, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  Box,
  Stack,
  Text,
  Button,
  Flex,
  Input,
  Heading,
  Center,
  FormControl,
  FormLabel,
  Textarea,
  FormHelperText,
  Select,
  HStack,
  Image,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import PageHeader from "../../components/HeaderFooters/PageHeader";
import { Field, Form, Formik } from "formik";
import { TextInputControl } from "../../components/form-helpers/TextInputControl";
import StarRating from "../../components/form-helpers/StarRating";
import { FaArrowLeft, FaRegEdit } from "react-icons/fa";
import { useShowToast } from "../../hooks/showToast";

const getRecipeIndex = (recipes: any[], recipeId: string) => {
  return recipes.findIndex((recipe) => recipe.id === recipeId);
};

interface PostValues {
  description: string;
  recipe: string;
  pic: string;
}

// function to send data to the database (db)
async function toDB(description: string, recipe: any, pic: string) {
  // get the active user's account using their email
  const email = JSON.parse(localStorage.getItem("EMAIL") as string);
  const getUser = doc(db, "users/", email);
  const getUserData = await getDoc(getUser);
  // get their username
  const username = getUserData?.data()?.username;
  // get the current date
  const date = new Date();

  // update the recipe that is being posted
  const recipeDoc = doc(
    db,
    "users/",
    email,
    "Recipes/",
    recipe.data.recipe_name
  );
  // change posted to true, indicating that this recipe has been posted
  const updated = await updateDoc(recipeDoc, {
    posted: true,
  });
  const comments: any[] = [];
  // create a document, assign these variables
  await addDoc(collection(db, "posts"), {
    // name in database: variable
    email: email,
    username: username,
    date_time: date,
    description: description,
    recipe: recipe,
    likes: 0,
    pic: pic,
    comments: comments,
  });
}
const Posts: React.FC = () => {
  const showToast = useShowToast();
  const [rating, setRating] = React.useState(0);
  const navigate = useNavigate();

  //
  const [recipes, setRecipes] = useState<any[]>([]);
  const email = JSON.parse(localStorage.getItem("EMAIL") as string);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [fileLink, setFileLink] = useState<any>();

  useEffect(() => {
    const recipesQuery = query(collection(db, "users/" + email + "/Recipes"));
    onSnapshot(recipesQuery, (querySnapshot) => {
      const temp: any[] = [];
      querySnapshot.forEach((doc) => {
        temp.push(doc.data());
      });
      setRecipes(temp);
    });
  }, []);

  // useEffect(() => {
  //   const fetchRecipes = async () => {
  //     if (email) {
  //       const recipesQuery = query(
  //         collection(db, "users/" + email + "/Recipes")
  //       );
  //       const querySnapshot = await getDocs(recipesQuery);
  //       const temp: any[] = [];
  //       querySnapshot.forEach((doc) => {
  //         temp.push(doc.data());
  //       });
  //       setRecipes(temp);
  //     }
  //   };

  //   fetchRecipes();
  // }, [email]);

  // function to uplaod an image to firebase storage and firestore
  async function uploadImage(file: any) {
    // storageRef created with random key
    const storageRef = ref(storage, Math.random().toString(16).slice(2));
    // 'file' comes from the Blob or File API
    // upload the file to storage
    uploadBytes(storageRef, file).then(async (snapshot) => {
      // once the file has been uploaded, set fileLink to the downloadURL
      await getDownloadURL(snapshot.ref).then((link) => {
        setFileLink(link);
      });
    });
  }

  const onSubmit = (values: PostValues, actions: any) => {
    try {
      const { description, recipe: recipeId } = values;
      const recipeIndex = getRecipeIndex(recipes, recipeId);
      const recipe = recipes[recipeIndex];

      // Send this data to the DB
      toDB(description, recipe, fileLink as string);
      console.log("Document created!");
      navigate("/explore");
    } catch (error) {
      showToast("error", "Error uploading image");
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar pageHeader="Create Post" />

      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
        marginBottom={180}
      >
        <Formik
          onSubmit={onSubmit}
          initialValues={{ title: "", description: "", recipe: "", pic: "" }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <Form>
              <Heading
                paddingTop={5}
                w="100%"
                textAlign={"center"}
                fontWeight="normal"
                mb="2%"
              >
                Create a Post!!
              </Heading>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Caption</FormLabel>
                  <Field name="description">
                    {({ field }: { field: any }) => (
                      <Textarea
                        {...field}
                        placeholder="I loved this recipe because..."
                        rows={5}
                        shadow="sm"
                        focusBorderColor="brand.400"
                        fontSize={{ sm: "sm" }}
                      />
                    )}
                  </Field>
                </FormControl>
                <FormControl>
                  <FormLabel>Recipe</FormLabel>
                  <Field name="recipe">
                    {({ field }: { field: any }) => (
                      <Select {...field} placeholder="Select a recipe">
                        {recipes.map((recipe) => (
                          <option key={recipe.id} value={recipe.id}>
                            {recipe?.data.recipe_name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </FormControl>
                <FormControl>
                  <FormLabel>Image</FormLabel>
                  <Box>
                    <Center>
                      {selectedFile && (
                        <div>
                          <img
                            alt="Selected"
                            width="250px"
                            src={selectedFile}
                          />
                          <br />
                          <Button
                            mt={2}
                            colorScheme="red"
                            onClick={() => setSelectedFile(undefined)}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </Center>
                  </Box>
                  <input
                    type="file"
                    name="myImage"
                    onChange={(event) => {
                      if (event?.target?.files) {
                        setSelectedFile(
                          URL.createObjectURL(event.target.files[0])
                        );
                        uploadImage(event.target.files[0]);
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Rating</FormLabel>
                  <StarRating rating={rating} setRating={setRating} />
                </FormControl>
                <Flex>
                  <Link to="/recipes">
                    <Button colorScheme="red" leftIcon={<FaArrowLeft />}>
                      Back
                    </Button>
                  </Link>
                  <Spacer />
                  <Button
                    type="submit"
                    colorScheme="teal"
                    ml="auto"
                    // isLoading={isSubmitting}
                    // isDisabled={isSubmitting}
                    // spinner={<Spinner size="sm" />}
                  >
                    Create Post
                    <Box pl={2}>
                      <FaRegEdit />
                    </Box>
                  </Button>
                </Flex>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default Posts;
