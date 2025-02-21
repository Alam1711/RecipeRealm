import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { doc } from "firebase/firestore";
import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import { db } from "../../authentication/firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageHeader from "./PageHeader";

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export interface NavbarProps {
  pageHeader?: string;
}

const Links = [
  { text: "Calendar", href: "/calendar" },
  { text: "Profile", href: "/profile" },
  { text: "Recipe Book", href: "/recipes" },
  { text: "Explore", href: "/explore" },
  { text: "My Friends", href: "/friends" },
];

const NavLink = (props: NavLinkProps) => {
  const { children, href } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={href} // Use the href prop
    >
      {children}
    </Box>
  );
};

const Navbar: React.FC<NavbarProps> = ({ pageHeader }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const email = useSelector((state: RootState) => state.auth.email);
  const [profile] = useDocumentData(email ? doc(db, "users", email) : null);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Image
              borderRadius="40px"
              src="newlogoteal.png"
              alt="Logo"
              w={100}
            />
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link.text} href={link.href}>
                  {link.text}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"} height="17">
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  pt={1}
                  size="md"
                  src={profile?.profilePic}
                  mb={4}
                  pos="relative"
                  _after={{
                    content: '""',
                    w: 2,
                    h: 2,
                    bg: "green.300",
                    border: "2px solid white",
                    rounded: "full",
                    pos: "absolute",
                    bottom: 0,
                    right: 1,
                  }}
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Add Friends</MenuItem>
                <MenuDivider />
                <Link to="/login">
                  <MenuItem>Logout</MenuItem>
                </Link>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.text} href={link.href}>
                  {link.text}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <PageHeader pageHeader={pageHeader} />
    </>
  );
};

export default Navbar;
