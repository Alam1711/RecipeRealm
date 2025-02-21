import React from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "../components/HeaderFooters/Footer";

import CalendarPage from "../pages/calendar";
import Friends from "../pages/friends";
import FriendProfile from "../pages/Friends/friendProfile";
import Login from "../pages/Login/login";
import SignUp from "../pages/Login/signup";
import Recipes from "../pages/myrecipes";
import Posts from "../pages/Posts/posts";
import Profile from "../pages/profile";
import RecipeDetail from "../pages/Recipes/recipeDetail";
import Explore from "../pages/Explore/explore";
import CreateRecipe from "../pages/Recipes/CreateRecipeForm";

const AppShell: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route index element={<Login />} />
        <Route path="Login" element={<Login />} />
        <Route path="Signup" element={<SignUp />} />
        <Route path="FriendsProfile" element={<FriendProfile />} />
        <Route path="Posts" element={<Posts />} />
        <Route path="Friends" element={<Friends />} />
        <Route path="Calendar" element={<CalendarPage />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="Recipes" element={<Recipes />} />
        <Route path="Explore" element={<Explore />} />
        <Route path="CreateRecipe" element={<CreateRecipe />} />
        <Route path="RecipeDetail" element={<RecipeDetail />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppShell;
