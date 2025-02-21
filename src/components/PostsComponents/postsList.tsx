import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmarks, BsFillBookmarksFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { db } from "../../authentication/firebaseConfig";
import { useShowToast } from "../../hooks/showToast";
import Comments from "./comments";
import ProfileModal from "./profileModal";
import { Recipe } from "../InterfaceTypes/types";

export interface FriendsPostsInterface {
  postsList: any;
  profiles: any;
  savedRecipes: any;
}

const PostsList: React.FC<FriendsPostsInterface> = ({
  postsList,
  profiles,
  savedRecipes,
}) => {
  const email = JSON.parse(localStorage.getItem("EMAIL") as string);
  const userQuery = doc(db, "users/", email);
  const docRef = doc(db, "users/", email);
  const [user] = useDocumentData(userQuery);
  const [following, setFollowing] = useState<any[]>([]);
  const [liked, setLiked] = useState<any[]>([]);
  const showToast = useShowToast();

  const navigate = useNavigate();

  const isLiked = (datetime: any) => {
    return liked?.some((like: any) => like.seconds === datetime.seconds);
  };

  const like = async (datetime: any) => {
    await updateDoc(docRef, {
      liked: arrayUnion(datetime),
    });

    const q = query(
      collection(db, "posts/"),
      where("date_time", "==", datetime)
    );
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      updateDoc(doc.ref, {
        likes: increment(1),
      });
    });
  };

  const isSaved = (recipe: Recipe) => {
    return savedRecipes?.some(
      (savedRecipe: any) => savedRecipe.data.recipe_name === recipe.recipe_name
    );
  };

  const unlike = async (datetime: any) => {
    await updateDoc(docRef, {
      liked: arrayRemove(datetime),
    });

    const q = query(
      collection(db, "posts/"),
      where("date_time", "==", datetime)
    );
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      updateDoc(doc.ref, {
        likes: increment(-1),
      });
    });
  };

  const saveRecipe = async (recipe: Recipe, creatorEmail: string) => {
    const docRef = doc(db, "users", creatorEmail);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const username = docSnap.data()?.username;
      await setDoc(
        doc(db, "users/" + email + "/SavedRecipes", recipe.recipe_name),
        {
          data: recipe,
          creator: username,
        }
      );
    }
  };

  const unsaveRecipe = async (recipe: Recipe) => {
    await deleteDoc(
      doc(db, "users/" + email + "/SavedRecipes", recipe.recipe_name)
    );
  };

  const getIndex = (profiles: any[], email: string): number => {
    return profiles?.findIndex((profile) => profile.email === email) ?? -1;
  };

  const removeFollowing = async (followingEmail: string) => {
    if (following?.includes(followingEmail)) {
      const getUser = doc(db, "users", email);
      await updateDoc(getUser, {
        following: arrayRemove(followingEmail),
      });
    }
  };

  const addFollowing = async (followingEmail: string) => {
    if (!following?.includes(followingEmail)) {
      const getUser = doc(db, "users", email);
      await updateDoc(getUser, {
        following: arrayUnion(followingEmail),
      });
    } else {
      console.log("Already following");
    }
  };

  useEffect(() => {
    setFollowing(user?.following);
    setLiked(user?.liked);
  }, [user]);
  return (
    <VStack minH="100vh">
      {postsList?.length === 0 ? (
        <Heading textAlign="center" minH="100vh" fontSize={80}>
          You have no friends
        </Heading>
      ) : (
        postsList &&
        profiles &&
        savedRecipes &&
        postsList.map((post: any) => (
          <Container
            shadow={1000}
            maxW="container.lg"
            color="white"
            display="flex"
            flexDirection="column"
            padding={1}
            rounded="lg"
            boxShadow="dark-lg"
            backgroundColor="rgba(0, 128, 128, 1)"
          >
            <Box
              padding={4}
              rounded="md"
              maxW="container.lg"
              backgroundColor="rgba(0, 128, 128, 1)"
              color="white"
              minH="350"
              display="flex"
              flexDirection="column"
            >
              <div style={{ flex: 1, fontSize: "24px" }}>
                {post?.recipe.data.recipe_name}
              </div>
              <HStack>
                <VStack width="40%">
                  <Center>
                    <Image
                      borderRadius="30px"
                      src={post.pic}
                      alt="No Image"
                      w={300}
                      mb={15}
                    />
                  </Center>
                </VStack>
                <VStack width="60%" align="flex-start">
                  <Stack
                    direction="row"
                    spacing={4}
                    align="stretch"
                    marginBottom={3}
                    paddingLeft="4"
                  >
                    <Button
                      variant="link"
                      colorScheme="white"
                      onClick={() =>
                        isLiked(post.date_time)
                          ? unlike(post?.date_time)
                          : like(post?.date_time)
                      }
                    >
                      {isLiked(post.date_time) ? (
                        <AiFillHeart style={{ fontSize: "34px" }} />
                      ) : (
                        <AiOutlineHeart style={{ fontSize: "34px" }} />
                      )}
                    </Button>

                    <Comments profiles={profiles} post={post} user={user} />

                    <Button
                      variant="link"
                      colorScheme="white"
                      onClick={() => {
                        if (isSaved(post.recipe.data)) {
                          showToast(
                            "success",
                            "Recipe removed from your recipe book"
                          );
                          unsaveRecipe(post.recipe.data);
                        } else {
                          showToast(
                            "success",
                            "Recipe saved to your recipe book"
                          );
                          saveRecipe(post.recipe.data, post.email);
                        }
                      }}
                    >
                      {isSaved(post.recipe.data) ? (
                        <BsFillBookmarksFill style={{ fontSize: "34px" }} />
                      ) : (
                        <BsBookmarks style={{ fontSize: "34px" }} />
                      )}
                    </Button>
                    <Spacer />
                    <Text fontSize={20}>
                      {post?.date_time.toDate().getMonth()}/
                      {post?.date_time.toDate().getDay()}/
                      {post?.date_time.toDate().getFullYear()}
                    </Text>
                  </Stack>

                  <Box rounded="md" padding="4" bg="teal" maxW="container.lg">
                    <Text fontSize={25}>{post.title}</Text>

                    <Flex>
                      <Text fontSize={18}>Posted by: </Text>
                      <Text fontSize={18} marginLeft={2}>
                        {
                          // get the profile of the person who posted this recipe
                          profiles[getIndex(profiles, post.email)]?.username
                        }{" "}
                      </Text>

                      <ProfileModal
                        profile={profiles[getIndex(profiles, post.email)]}
                        profiles={profiles}
                        email={post.email}
                        following={following}
                        addFollowing={addFollowing}
                        removeFollowing={removeFollowing}
                        getIndex={getIndex}
                        post={post}
                      />
                      <Button
                        marginLeft={2}
                        colorScheme="whiteAlpha"
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          window.localStorage.setItem(
                            "VIEWRECIPE",
                            JSON.stringify(post?.recipe.data)
                          );
                          navigate("../recipeDetail");
                        }}
                      >
                        View Recipe
                      </Button>
                    </Flex>
                    <Text fontSize={18}>
                      {post.likes} {post.likes === 1 ? "like" : "likes"}
                    </Text>
                    <Text fontSize={20}>Caption:</Text>
                    <Text>{post.description}</Text>
                  </Box>
                </VStack>
              </HStack>
            </Box>
          </Container>
        ))
      )}
    </VStack>
  );
};

export default PostsList;
