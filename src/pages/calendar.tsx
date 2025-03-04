import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Image,
  Input,
  Select,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { AiFillPrinter } from "react-icons/ai";
import { Link } from "react-router-dom";
import { db } from "../authentication/firebaseConfig";
import Navbar from "../components/HeaderFooters/Navbar";
import { Recipe, event, Ingredient } from "../components/InterfaceTypes/types";
function getRecipeIndex(recipes: any[], recipe_name: string): number {
  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i]?.data.recipe_name.localeCompare(recipe_name) === 0) {
      return i;
    }
  }
  return -1;
}

const CalendarPage: React.FC = () => {
  const toast = useToast();
  const email = JSON.parse(localStorage.getItem("EMAIL") as string);
  const savedRecipesQuery = query(
    collection(db, "users/" + email + "/SavedRecipes")
  );

  const [savedRecipes] = useCollectionData(savedRecipesQuery);
  const recipesQuery = query(collection(db, "users/" + email + "/Recipes"));

  const [recipes] = useCollectionData(recipesQuery);
  const [profile] = useDocumentData(doc(db, "users/", email));
  const [dateEvents, setDateEvents] = useState<any>([]);
  const [date, setDate] = useState("");
  const [recipeName, setRecipeName] = useState<any>();
  const [dateSelected, setDateSelected] = useState("");
  useEffect(() => {
    if (profile?.events) {
      const tempEvents: Recipe[] = profile.events
        .filter((event: any) => event.date?.includes(dateSelected))
        .map((event: any) => event.recipe);
      setDateEvents(tempEvents);
    }
  }, [profile, dateSelected]);

  function titleSize(title: string) {
    return 34 - title.length * 0.2 + "px";
  }
  /**
   * Handles the change of name for a recipe
   * @param e the temporary event object passed in
   */
  const handleRecipeChange = (e: any) => {
    const targ = e.target.value;
    setRecipeName(targ);
  };
  /**
   * Handles the date change in an input component later on, used to set the date and time
   * for an event
   * @param e temporary object to handle the date and time string being passed in
   */
  const handleDateChange = (e: any) => {
    const targ = e.target.value;
    setDate(targ);
  };
  /**
   * Handles the the information being submitted when user is setting the date, time, and recipe
   * being scheduled to the data base
   * @param recipe_name name of the recipe being saved
   * @param date the date and time that the meal is being scheduled on
   * @returns the event object if date time and meal were entered
   */
  const handleSubmit = async (recipe_name: string, date: string) => {
    if (recipes && savedRecipes) {
      if (date === "") {
        toast({
          //
          title: "No Time",
          description: "Please choose a time for your recipe",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      var index = getRecipeIndex(recipes, recipe_name);
      if (index === -1) {
        index = getRecipeIndex(savedRecipes, recipe_name);
        const newEvent: event = {
          recipe: savedRecipes[index].data,
          date: date,
          title: recipe_name,
        };
        const docRef = doc(db, "users", email);
        await updateDoc(docRef, {
          events: arrayUnion(newEvent),
        });
      } else {
        const newEvent: event = {
          recipe: recipes[index].data,
          date: date,
          title: recipe_name,
        };
        const docRef = doc(db, "users", email);
        await updateDoc(docRef, {
          events: arrayUnion(newEvent),
        });
      }
      toast({
        //
        title: "Recipe Created",
        description: "Recipe added to your calendar.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  function displayMeals() {
    return (
      <VStack spacing={10}>
        <Box>
          {/* Component that creates a block of information for each individual meal on selected date */}
          {dateEvents &&
            dateEvents.map((recipe: Recipe) => (
              <Container
                boxShadow={"2xl"}
                maxW="md"
                borderRadius="lg"
                overflow="hidden"
                justify-content="space-between"
                bg="teal"
                minH="350"
                flexDirection="column"
                rounded="md"
                padding={4}
                margin={4}
                shadow={"dark-lg"}
              >
                <VStack align="2x1">
                  <Center>
                    <Image
                      borderRadius="30px"
                      minH="250px"
                      src={
                        // image attached to the recipe
                        recipe.pic
                      }
                      alt="No Picture"
                      w={300}
                      mb={15}
                    />
                  </Center>

                  <Button
                    variant="link"
                    rounded="md"
                    as="h3"
                    size="lg"
                    color="black"
                    padding={1}
                  >
                    <Center>
                      <Text
                        as="b"
                        fontSize={titleSize(recipe.recipe_name)}
                        textColor="white"
                      >
                        {
                          // name of the recipe
                          recipe.recipe_name
                        }
                      </Text>
                    </Center>
                  </Button>
                  <Box
                    boxShadow="xs"
                    rounded="md"
                    padding="4"
                    bg="white"
                    color="black"
                    maxW="container.sm"
                  >
                    {/* displaying recipe data */}
                    <Text noOfLines={1}>Difficulty: {recipe.difficulty}</Text>
                    <Text noOfLines={1}>
                      Time: {recipe.cooking_time.format("HH:mm")}
                    </Text>
                    <Text noOfLines={1}>Servings: {recipe.servings}</Text>
                    <Text noOfLines={1}>
                      Cost Per Serving: {recipe.cost_per_serving}
                    </Text>
                    <Text noOfLines={1}>
                      Cooking Applications:{" "}
                      {recipe.cooking_applications.join(", ")}
                    </Text>
                    <Text noOfLines={1}>Allergens: {recipe.allergens}</Text>
                  </Box>
                  <Accordion allowMultiple>
                    <AccordionItem>
                      <h2>
                        {/* accordion for nutrition data  */}
                        <AccordionButton bg="white">
                          <Box as="span" flex="1" textAlign="left">
                            <Text as="b" textColor="black">
                              Nutrition Data
                            </Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Box padding="4" color="black" maxW="container.sm">
                          {/* each accordion panel contains:  */}
                          <Text noOfLines={1} textColor="white">
                            Calories: {recipe.nutrients.calories.toFixed(2)}{" "}
                            kCal
                          </Text>
                          <Text noOfLines={1} textColor="white">
                            Protein: {recipe.nutrients.protein.toFixed(2)}g
                          </Text>
                          <Text noOfLines={1} textColor="white">
                            Carbs:{" "}
                            {recipe.nutrients.total_carbohydrate.toFixed(2)}g
                          </Text>
                          <Text noOfLines={1} textColor="white">
                            Sugar: {recipe.nutrients.sugars.toFixed(2)}g
                          </Text>
                          <Text noOfLines={1} textColor="white">
                            Fat: {recipe.nutrients.total_fat.toFixed(2)}g
                          </Text>
                          <Text noOfLines={1} textColor="white">
                            Saturated Fat:{" "}
                            {recipe.nutrients.saturated_fat.toFixed(2)}g
                          </Text>
                          <Text noOfLines={1} textColor="white">
                            Cholesterol:{" "}
                            {recipe.nutrients.cholesterol.toFixed(2)}g
                          </Text>
                          <Text noOfLines={1} textColor="white">
                            Sodium: {recipe.nutrients.sodium.toFixed(2)}g
                          </Text>
                          <Text noOfLines={1} textColor="white">
                            Fiber: {recipe.nutrients.dietary_fiber.toFixed(2)}g
                          </Text>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                  <Accordion allowMultiple>
                    <AccordionItem>
                      <h2>
                        {/* Accordion that displays the ingredient info */}
                        <AccordionButton bg="white">
                          <Box as="span" flex="1" textAlign="left">
                            <Text as="b" textColor="black">
                              Ingredients
                            </Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {recipe.ingredients.map(
                          (ingredient: Ingredient, index: number) => (
                            <Text key={index} textColor="whiteAlpha.900">
                              {" "}
                              <li> {ingredient.name}</li>
                            </Text>
                          )
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                  <Accordion allowMultiple>
                    <AccordionItem>
                      <h2>
                        {/* accordion for the instructions */}
                        <AccordionButton bg="white">
                          <Box as="span" flex="1" textAlign="left">
                            <Text as="b" textColor="black">
                              Instructions:
                            </Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Box padding="4" color="black" maxW="container.sm">
                          <Text textColor="white">
                            {/* display the instructions */}
                            {recipe.instructions}
                          </Text>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </VStack>
                <HStack align="right" marginTop={2}>
                  <Link to="/RecipeDetail">
                    {/* Button that take user to page that previews pdf to print */}
                    <Button
                      boxShadow="xs"
                      rounded="md"
                      variant="outline"
                      padding="4"
                      colorScheme="teal"
                      color="white"
                      maxW="container.sm"
                      onClick={() => {
                        window.localStorage.setItem(
                          "VIEWRECIPE",
                          JSON.stringify(recipe)
                        );
                      }}
                    >
                      <AiFillPrinter />
                      <Text marginLeft={2}>Print Recipe</Text>
                    </Button>
                  </Link>
                  <Spacer />
                  <Flex>
                    {/* Button that deschedules corresponding meal on select date */}
                    <Button
                      boxShadow="xs"
                      rounded="md"
                      padding="4"
                      colorScheme="red"
                      color="white"
                      maxW="container.sm"
                      onClick={() => {
                        for (let i = 0; i < profile?.events.length; i++) {
                          if (
                            profile?.events[i].date.includes(dateSelected) &&
                            profile?.events[i].title === recipe.recipe_name
                          ) {
                            console.log(dateSelected);
                            console.log(profile?.events[i]);
                            console.log(profile?.events[i].title);
                            updateDoc(doc(db, "users/", email), {
                              events: arrayRemove(profile?.events[i]),
                            });
                          }
                        }
                      }}
                    >
                      <Text>De-schedule</Text>
                    </Button>
                  </Flex>
                </HStack>
              </Container>
            ))}
        </Box>
      </VStack>
    );
  }
  /**
   * Function that displays a drawer component when the user clicks on the
   * "Schedule Recipe" button. The drawer displays boxes for the user to fill in
   * date, time, and which meal they want to schedule.
   * @returns displays the drawer component that allows the user to schedule a meal on a select date
   */
  function ScheduleRecipe() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <>
        {/* Button that displays the drawer for scheduling meal on a select date */}
        <Button alignSelf={"right"} colorScheme="teal" onClick={onOpen}>
          Schedule Recipe
        </Button>
        {/* Drawer component that displays input boxes and buttons that user interacts with to schedule meal on select date */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader
              bg={"teal"}
              paddingTop={"40px"}
              paddingBottom={"40px"}
              fontSize={"30px"}
              textAlign={"center"}
              color={"white"}
            >
              Choose when to schedule your meal!
            </DrawerHeader>

            <DrawerBody paddingTop={"20px"}>
              <Text padding={"20px"} fontSize={"20px"} fontWeight={"600"}>
                Enter a date: <br />
                (must include date and time)
              </Text>
              {/* Date and time input */}
              <Input
                type="datetime-local"
                outlineColor={"teal"}
                placeholder="Select Date and Time"
                onChange={handleDateChange}
              />
              <Text padding={"25px"} fontSize={"20px"} fontWeight={"600"}>
                Choose the recipe:
              </Text>
              {/* Select meal input box */}
              <Select
                size={"lg"}
                value={recipeName}
                outlineColor={"teal"}
                placeholder="Click to select..."
                onChange={handleRecipeChange}
              >
                {recipes?.map((recipe) => (
                  <option>{recipe?.data.recipe_name}</option>
                ))}
                {savedRecipes?.map((recipe) => (
                  <option>{recipe?.data.recipe_name}</option>
                ))}
              </Select>
            </DrawerBody>

            <DrawerFooter>
              {/* Closes drawer */}
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              {/* Schedule confirmation button */}
              <Button
                colorScheme="green"
                onClick={() => handleSubmit(recipeName, date)}
              >
                Schedule
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <Navbar pageHeader="Calendar" />

      <HStack height={"auto"} padding={"25px"}>
        <VStack w={"50%"} align={"left"}>
          <Container w={"750px"}>
            {/* Calendar component called FullCalendar. Built in calendar UI with props that allow customization */}
            <FullCalendar
              plugins={[interactionPlugin, dayGridPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              aspectRatio={0.8}
              unselectAuto={false}
              dateClick={function (info) {
                // Function to handle date clicking
                const selectedDate = info.dateStr;
                var tempEvents: Recipe[] = [];
                if (profile?.events) {
                  tempEvents = profile.events
                    .filter((event: any) => event.date.includes(selectedDate))
                    .map((event: any) => event.recipe);
                }

                setDateSelected(selectedDate);
                setDateEvents(tempEvents);
              }}
              // prop that restrict multi select of days
              selectAllow={function (selectInfo) {
                var startDate = selectInfo.start.getDate();
                var endDate;
                if (selectInfo.end.getDate() === 1) {
                  endDate = startDate;
                } else {
                  endDate = selectInfo.end.getDate() - 1;
                }
                var startMonth = selectInfo.start.getMonth();
                var endMonth;
                if (selectInfo.end.getMonth() === startMonth + 1) {
                  endMonth = startMonth;
                } else {
                  endMonth = selectInfo.end.getMonth();
                }
                if (startDate === endDate && startMonth === endMonth) {
                  return true;
                } else {
                  return false;
                }
              }}
              handleWindowResize={true}
              expandRows={true}
              dayMaxEvents={true}
              events={profile?.events}
              eventDisplay="list-item"
              eventBackgroundColor="teal"
            />
          </Container>
          <Container>{ScheduleRecipe()}</Container>
        </VStack>
        <Container
          id="MealPlanInfo"
          border={"solid"}
          borderColor={"teal"}
          height={"800px"}
          maxH="680px"
          overflowY={"scroll"}
          w={"1000px"}
        >
          {
            /* Checks if a date is selected to display a message for the user to select a day if user hasn't yet, else
             * it displays meal info from displayMeals() function
             */
            dateSelected === "" ? (
              <Text paddingTop={"200"} paddingLeft={"75"}>
                Select a day to view the meals scheduled
              </Text>
            ) : (
              displayMeals()
            )
          }
        </Container>
      </HStack>
    </>
  );
};

export default CalendarPage;
