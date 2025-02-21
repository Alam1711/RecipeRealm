import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  Box,
  Heading,
  Text,
  Stack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useShowToast } from "../../hooks/showToast";

interface ProfileModalProps {
  profile: any;
  profiles: any[];
  post: any;
  email: string;
  following: string[];
  addFollowing: (email: string) => void;
  removeFollowing: (email: string) => void;
  getIndex: (profiles: any[], email: string) => number;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  profiles,
  email,
  following,
  addFollowing,
  removeFollowing,
  post,
  getIndex,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();

  return (
    <>
      <Button
        marginLeft={2}
        colorScheme="whiteAlpha"
        variant="outline"
        size="xs"
        onClick={onOpen}
      >
        {isOpen ? "Close" : "View"} Profile
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody bg="teal" rounded="lg">
            <Box w="full" bg="teal" rounded="lg" textAlign="center">
              <Avatar
                size="xl"
                src={profile?.profilePic}
                mb={4}
                pos="relative"
                _after={{
                  content: '""',
                  w: 4,
                  h: 4,
                  bg: "green.300",
                  border: "2px solid white",
                  rounded: "full",
                  pos: "absolute",
                  bottom: 0,
                  right: 3,
                }}
              />
              <Heading fontSize="2xl" fontFamily="body" textColor="white">
                @{profile?.username}
              </Heading>
              <Text textAlign="center" as="b" color="white" px={3}>
                {profile?.name}
              </Text>

              <Text textAlign="center" color="white" px={3}>
                {profile?.biography}
              </Text>
              <Stack mt={8} direction="row" spacing={4}>
                <Link to="/FriendsProfile">
                  <Button
                    variant="outline"
                    flex={1}
                    fontSize="sm"
                    rounded="full"
                    _focus={{ bg: "gray.200" }}
                    onClick={() => {
                      window.localStorage.setItem(
                        "USERNAME",
                        JSON.stringify(
                          profiles[getIndex(profiles, post.email)]?.username
                        )
                      );
                    }}
                  >
                    <Text textColor="white">View Recipes</Text>
                  </Button>
                </Link>
                {following?.includes(post.email) ? (
                  <Button
                    flex={1}
                    fontSize="sm"
                    rounded="full"
                    bg="red.400"
                    color="white"
                    boxShadow="0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                    _hover={{ bg: "red.500" }}
                    _focus={{ bg: "red.500" }}
                    onClick={() => {
                      showToast("success", "Unfollowed");
                      removeFollowing(post.email);
                    }}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    flex={1}
                    fontSize="sm"
                    rounded="full"
                    bg="green.400"
                    color="white"
                    boxShadow="0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                    _hover={{ bg: "green.500" }}
                    _focus={{ bg: "green.500" }}
                    onClick={() => {
                      if (post.email === email) {
                        showToast("error", "Cannot Follow");
                      } else {
                        addFollowing(post.email);
                        showToast("success", "Followed");
                      }
                    }}
                  >
                    Follow
                  </Button>
                )}
              </Stack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
