import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  Avatar,
  Divider,
  Text,
  Container,
  Textarea,
  useDisclosure,
  Flex,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { BsFillChatDotsFill } from "react-icons/bs";
import { db } from "../../authentication/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { AiOutlineSend } from "react-icons/ai";

export interface CommentsProps {
  profiles: any[];
  post: any;
  user: any;
}

const Comments: React.FC<CommentsProps> = ({ profiles, post, user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [comment, setComment] = useState("");

  // function to handle comment text input changing
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // function to add a comment to the db
  async function addComment(datetime: any) {
    // get the current date
    const date = new Date();
    // create a new comment
    const newComment = {
      date_time: date,
      username: user?.username,
      pic: user?.profilePic,
      comment: comment,
    };
    // get the right post
    const q = query(
      collection(db, "posts/"),
      where("date_time", "==", datetime)
    );
    const docs = await getDocs(q);
    // update the comments array in the DB
    docs.forEach((doc) => {
      updateDoc(doc.ref, {
        comments: arrayUnion(newComment),
      });
    });
    // reset the comment
    setComment("");
  }

  function getIndex(profiles: any[], email: string): number {
    return profiles?.findIndex((profile) => profile.email === email) ?? -1;
  }

  return (
    <>
      <Button variant="link" colorScheme="white" onClick={onOpen}>
        <BsFillChatDotsFill style={{ fontSize: "34px" }} />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minWidth={"825px"}>
          <ModalHeader
            bg={"teal"}
            rounded="md"
            paddingTop={"20px"}
            paddingBottom={"20px"}
            fontSize={"30px"}
            textAlign={"center"}
            color={"white"}
          >
            Comments on @{profiles[getIndex(profiles, post.email)]?.username}'s
            post
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            justifyContent={"space-between"}
            height={"100%"}
            minH={"645px"}
            maxH={"645px"}
            overflowY={"auto"}
          >
            <VStack>
              {post?.comments.map((comment: any) => (
                <HStack
                  width="100%"
                  minH="60px"
                  bg="teal"
                  rounded="md"
                  key={comment.date_time.seconds}
                  p={4}
                >
                  <Avatar size="xl" src={comment.pic} />
                  <Flex direction="column" ml={4} flex="1">
                    <Text fontWeight="bold">@{comment.username}</Text>
                    <Text>{comment.comment}</Text>
                  </Flex>
                  <Flex
                    ml={4}
                    whiteSpace="nowrap"
                    direction="column"
                    alignItems="flex-end"
                  >
                    <Text>
                      {new Date(
                        comment.date_time.seconds * 1000
                      ).toLocaleTimeString()}
                    </Text>
                    <Text>
                      {new Date(
                        comment.date_time.seconds * 1000
                      ).toLocaleDateString()}
                    </Text>
                  </Flex>
                </HStack>
              ))}
            </VStack>
          </ModalBody>
          <Divider orientation="horizontal" color={"teal"} />
          <ModalFooter blockSize={200} backgroundColor="gray.100">
            <Flex direction="row">
              <Box pr={3} p={4}>
                <Avatar size="xl" src={user.profilePic} />
              </Box>
              <Spacer />
              <Box pr={3}>
                <Textarea
                  placeholder="Type a comment here..."
                  blockSize={150}
                  minWidth={"570px"}
                  value={comment}
                  onChange={handleCommentChange}
                />
              </Box>

              <Button
                bg={"teal"}
                color={"white"}
                variant={"solid"}
                fontSize={"x-large"}
                height={160}
                width={"70px"}
                aria-label={"Send comment"}
                onClick={() => {
                  addComment(post?.date_time);
                }}
              >
                <AiOutlineSend />
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Comments;
