import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { collection, doc, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { db } from "../../authentication/firebaseConfig";
import Navbar from "../../components/HeaderFooters/Navbar";
import PostsList from "../../components/PostsComponents/postsList";

const Explore: React.FC = () => {
  const email = JSON.parse(localStorage.getItem("EMAIL") as string);

  const [following, setFollowing] = useState<any[]>([]);
  const userQuery = doc(db, "users/", email);
  const [user] = useDocumentData(userQuery);
  const allPostsQuery = query(
    collection(db, "posts"),
    orderBy("date_time", "desc")
  );
  const [allPosts] = useCollectionData(allPostsQuery);
  const [profiles] = useCollectionData(query(collection(db, "users")));
  const savedRecipesQuery = query(
    collection(db, "users/" + email + "/SavedRecipes")
  );
  const [savedRecipes] = useCollectionData(savedRecipesQuery);

  useEffect(() => {
    setFollowing(user?.following);
  }, [user]);

  const friendsPostsQuery =
    following && following.length !== 0
      ? query(
          collection(db, "posts"),
          where("email", "in", following),
          orderBy("date_time", "desc")
        )
      : null;
  const [friendsPosts] = useCollectionData(friendsPostsQuery);
  return (
    <>
      <Navbar pageHeader="Explore" />
      <Tabs isFitted variant="enclosed" size="lg">
        <TabList mb="1em">
          <Tab>
            <Text as="b">Feed</Text>
          </Tab>
          <Tab>
            <Text as="b">Following</Text>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PostsList
              postsList={allPosts}
              profiles={profiles}
              savedRecipes={savedRecipes}
            />
          </TabPanel>
          <TabPanel>
            <PostsList
              postsList={friendsPosts}
              profiles={profiles}
              savedRecipes={savedRecipes}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Explore;
