import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Select,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  Textarea,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { GiBubblingBowl } from "react-icons/gi";
import { Link } from "react-router-dom";
import { db, storage } from "../../authentication/firebaseConfig";
import { AppliancesSection } from "../../components/AppliancesSection";
import Navbar from "../../components/HeaderFooters/Navbar";
import { InstructionsSection } from "../../components/InstructionsSection";
import { IngredientsSection } from "../../components/ItemListSection";
import { NumberInputControl } from "../../components/form-helpers/NumberInputControl";
import { TextInputControl } from "../../components/form-helpers/TextInputControl";
import FocusError from "../../hooks/FocusError";
import { useShowToast } from "../../hooks/showToast";
import {
  UnitOfMeasurement,
  CookingAppliance,
  Ingredient,
  Nutrition,
} from "../../components/InterfaceTypes/types";
import TimeInputField from "../../components/form-helpers/TimeInputField";
import { doc, setDoc } from "@firebase/firestore";

const CreateRecipe: React.FC = () => {
  const initialValues = {
    recipeName: "",
    cookingTime: "",
    prepTime: "",
    ovenTime: "",
    difficulty: "Beginner",
    costPerServing: 0,
    servings: 0,
    ingredients: [
      { name: "", quantity: 0, unitofMeasurement: UnitOfMeasurement.Units },
    ],
    cookingAppliances: [],
    category: "breakfast",
    extraNotes: "",
  };

  // const validationSchema = Yup.object({
  //   recipeName: Yup.string().required("Recipe name is required"),
  //   cookingTime: Yup.string().required("Cooking time is required"),
  //   difficulty: Yup.string().required("Difficulty is required"),
  //   costPerServing: Yup.number().required("Cost per serving is required"),
  // });

  const showToast = useShowToast();
  const [progress, setProgress] = useState(33.33);
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const email = JSON.parse(localStorage.getItem("EMAIL") as string);
  const [cookingAppliances, setCookingAppliances] = useState<
    CookingAppliance[]
  >([]);
  const [instructions, setInstructions] = useState<string[]>([]);

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: 0, unitofMeasurement: UnitOfMeasurement.Units },
  ]);
  const [selectedFile, setSelectedFile] = useState<any>();

  const fetchNutritionData = async (query: string): Promise<string> => {
    const headers = new Headers({
      "Content-Type": "application/json",
      "x-app-id": "3a83fb27",
      "x-app-key": "135db1d7aaba12d363ad7b2225656590",
      search_nutrient: '"protein"',
    });
    const body = JSON.stringify({ query });
    const requestOptions: RequestInit = {
      method: "POST",
      headers,
      body,
      redirect: "follow" as RequestRedirect,
    };
    try {
      const response = await fetch(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Failed to fetch nutrition data:", error);
      throw error;
    }
  };

  const getIngredientNutrients = async (query: string): Promise<Nutrition> => {
    const defaultNutrients: Nutrition = {
      calories: 0,
      total_fat: 0,
      saturated_fat: 0,
      cholesterol: 0,
      sodium: 0,
      total_carbohydrate: 0,
      dietary_fiber: 0,
      sugars: 0,
      protein: 0,
    };

    try {
      const data = await fetchNutritionData(query);
      const obj = JSON.parse(data);
      const food = obj.foods[0];

      return {
        calories: parseFloat(food.nf_calories.toFixed(2)),
        total_fat: parseFloat(food.nf_total_fat.toFixed(2)),
        saturated_fat: parseFloat(food.nf_saturated_fat.toFixed(2)),
        cholesterol: parseFloat(food.nf_cholesterol.toFixed(2)),
        sodium: parseFloat(food.nf_sodium.toFixed(2)),
        total_carbohydrate: parseFloat(food.nf_total_carbohydrate.toFixed(2)),
        dietary_fiber: parseFloat(food.nf_dietary_fiber.toFixed(2)),
        sugars: parseFloat(food.nf_sugars.toFixed(2)),
        protein: parseFloat(food.nf_protein.toFixed(2)),
      };
    } catch (error) {
      console.error("Error fetching ingredient nutrients:", error);
      return defaultNutrients;
    }
  };

  async function getTotalNutrients(ingredients: string[]): Promise<Nutrition> {
    const initialNutrients: Nutrition = {
      calories: 0,
      total_fat: 0,
      saturated_fat: 0,
      cholesterol: 0,
      sodium: 0,
      total_carbohydrate: 0,
      dietary_fiber: 0,
      sugars: 0,
      protein: 0,
    };

    try {
      const nutrientsArray: Nutrition[] = await Promise.all(
        ingredients.map((ingredient) => getIngredientNutrients(ingredient))
      );
      const recipeNutrients = nutrientsArray.reduce(
        (acc, ingredientNutrients) => {
          return {
            calories: acc.calories + ingredientNutrients.calories,
            total_fat: acc.total_fat + ingredientNutrients.total_fat,
            saturated_fat:
              acc.saturated_fat + ingredientNutrients.saturated_fat,
            cholesterol: acc.cholesterol + ingredientNutrients.cholesterol,
            sodium: acc.sodium + ingredientNutrients.sodium,
            total_carbohydrate:
              acc.total_carbohydrate + ingredientNutrients.total_carbohydrate,
            dietary_fiber:
              acc.dietary_fiber + ingredientNutrients.dietary_fiber,
            sugars: acc.sugars + ingredientNutrients.sugars,
            protein: acc.protein + ingredientNutrients.protein,
          };
        },
        initialNutrients
      );
      return recipeNutrients;
    } catch (e) {
      showToast("error", "Error fetching nutrients");
      return initialNutrients;
    }
  }

  async function uploadImage(file: any) {
    // create a storageRef with a random value
    const storageRef = ref(storage, Math.random().toString(16).slice(2));
    // upload the passed image to storage
    uploadBytes(storageRef, file).then(async (snapshot) => {
      // when it has been uploaded, put the link in the db
      await getDownloadURL(snapshot.ref).then((link) => {
        localStorage.setItem("FILE", JSON.stringify(link));
      });
    });
  }

  const onSubmit = async (values: typeof initialValues) => {
    setIsSaving(true);
    if (
      !ingredients.some(
        (items) => items.name.trim() !== "" && items.quantity > 0
      )
    ) {
      showToast("error", "Please add at least one ingredient");
      setIsSaving(false);
      setStep(2);
      return;
    }
    if (values.recipeName.trim() === "") {
      showToast("error", "Please enter a recipe name");
      setIsSaving(false);
      setStep(1);
      return;
    }
    const ingredientStrings = ingredients.map((ingredient) => {
      return `${ingredient.quantity} ${ingredient.unitofMeasurement} of ${ingredient.name}`;
    });

    const nutrients: Nutrition = await getTotalNutrients(ingredientStrings);
    console.log("Nutrients", nutrients);
    const recipe = {
      ...values,
      ingredients: ingredients.filter(
        (ingredient) => ingredient.name.trim() !== ""
      ),
      instructions: instructions.filter(
        (instruction) => instruction.trim() !== ""
      ),
      cookingAppliances: cookingAppliances.filter(
        (appliance) => appliance.key.trim() !== ""
      ),
      createdAt: dayjs().format(),
      imageURL: localStorage.getItem("FILE"),
    };
    await new Promise(() => {
      setDoc(doc(db, "users/" + email + "/Recipes", values.recipeName), {
        // name in database: variable
        data: recipe,
      })
        .then(() => showToast("success", "Sent to database"))
        .catch(() => showToast("error", "Could not send to database"));
    });
  };

  return (
    <>
      <Navbar pageHeader="Recipe Creator" />
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
          initialValues={initialValues}
          // validateOnChange={true}
          // validateOnBlur={true}
          // validationSchema={validationSchema}
        >
          {({ values, isSubmitting, errors, isValid }) => {
            return (
              <Form>
                <Progress
                  hasStripe
                  colorScheme="teal"
                  value={progress}
                  mb="5%"
                  mx="5%"
                  isAnimated
                ></Progress>
                {step === 1 && (
                  <>
                    <Heading
                      paddingTop={5}
                      w="100%"
                      textAlign={"center"}
                      fontWeight="normal"
                      mb="2%"
                    >
                      Recipe Details
                    </Heading>
                    <Grid
                      templateColumns="repeat(6, 1fr)"
                      verticalAlign="center"
                      mb={2}
                      gap={6}
                      w="100%"
                    >
                      <GridItem colSpan={6}>
                        <Box display="flex" alignItems="center">
                          <TextInputControl
                            label="Recipe Name"
                            value={values.recipeName || ""}
                            name="recipeName"
                          />
                        </Box>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <FormControl id="cookTime">
                          <FormLabel>Cook Time</FormLabel>
                          <Box display="flex" alignItems="center">
                            <TimeInputField name="cookTime" label="Cook Time" />
                          </Box>
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={2}>
                        <FormControl id="prepTime">
                          <FormLabel>Prep Time</FormLabel>
                          <Box display="flex" alignItems="center">
                            <TimeInputField name="prepTime" label="Prep Time" />
                          </Box>
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={2}>
                        <FormControl id="ovenTime">
                          <FormLabel>Oven Time</FormLabel>
                          <Box display="flex" alignItems="center">
                            <TimeInputField name="ovenTime" label="Oven Time" />
                          </Box>
                        </FormControl>
                      </GridItem>

                      <GridItem colSpan={3}>
                        <FormControl id="mealType">
                          <FormLabel>Meal Type</FormLabel>
                          <Field name="mealType">
                            {({ field }: { field: any }) => (
                              <Select
                                {...field}
                                placeholder="Select option"
                                focusBorderColor="brand.400"
                                shadow="sm"
                                size="md"
                                w="full"
                                rounded="md"
                              >
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Desert">Desert</option>
                                <option value="Snack">Snack</option>
                              </Select>
                            )}
                          </Field>
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={3}>
                        <FormControl id="difficulty">
                          <FormLabel>Difficulty</FormLabel>
                          <Field name="difficulty">
                            {({ field }: { field: any }) => (
                              <Select
                                {...field}
                                placeholder="Select option"
                                focusBorderColor="brand.400"
                                shadow="sm"
                                size="md"
                                w="full"
                                rounded="md"
                              >
                                <option>Beginner Chef</option>
                                <option>Intermediate Chef</option>
                                <option>Seasoned Chef</option>
                                <option>Master Chef</option>
                              </Select>
                            )}
                          </Field>
                        </FormControl>
                      </GridItem>
                    </Grid>
                    <VStack gap={4} width="full" align="stretch" pt={2}>
                      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                        <GridItem>
                          <Box pb={1}>
                            <NumberInputControl
                              prefix="$"
                              name="costPerServing"
                              value={values.costPerServing}
                              label="Cost Per Serving"
                              precision={2}
                            />
                          </Box>
                        </GridItem>
                        <GridItem>
                          <Box pb={1}>
                            <NumberInputControl
                              name="servings"
                              value={values.servings}
                              label="Servings"
                            />
                          </Box>
                        </GridItem>
                      </Grid>
                      <Grid>
                        <GridItem>
                          <Box pb={1}>
                            <TextInputControl
                              label="Allergen Notes"
                              value={values.recipeName || ""}
                              name={"Allergens"}
                            />
                          </Box>
                        </GridItem>
                      </Grid>
                      <Box pb={1}>
                        <AppliancesSection
                          value={cookingAppliances}
                          setValues={setCookingAppliances}
                        />
                      </Box>
                    </VStack>
                  </>
                )}
                {step === 2 && (
                  <VStack gap={4} width="full" align="stretch">
                    <Heading
                      paddingTop={5}
                      w="100%"
                      textAlign={"center"}
                      fontWeight="normal"
                      mb="2%"
                    >
                      Ingredient List
                    </Heading>
                    <Box pb={1}>
                      <IngredientsSection
                        value={ingredients}
                        setValues={setIngredients}
                      />
                    </Box>
                  </VStack>
                )}
                {step === 3 && (
                  <VStack gap={4} width="full" align="stretch">
                    <Heading
                      paddingTop={5}
                      w="100%"
                      textAlign={"center"}
                      fontWeight="normal"
                      mb="2%"
                    >
                      Instructions
                    </Heading>
                    <Box pb={1}>
                      <InstructionsSection
                        value={instructions}
                        setValues={setInstructions}
                      />
                    </Box>
                  </VStack>
                )}

                {step === 4 && (
                  <>
                    <Heading w="100%" textAlign={"center"} fontWeight="normal">
                      Extra Notes
                    </Heading>
                    <SimpleGrid columns={1} spacing={6}>
                      <FormControl id="extraNotes" mt={1}>
                        <FormLabel>Extra Notes</FormLabel>
                        <Field name="extraNotes">
                          {({ field }: { field: any }) => (
                            <Textarea
                              {...field}
                              placeholder="ie. Always remember to preheat the oven"
                              rows={5}
                              shadow="sm"
                              focusBorderColor="brand.400"
                              fontSize={{
                                sm: "sm",
                              }}
                            />
                          )}
                        </Field>
                        <Box>
                          {selectedFile && (
                            <div>
                              <Image
                                alt="No Image"
                                width="250px"
                                src={selectedFile}
                              />
                              <br />

                              <button
                                onClick={() => setSelectedFile(undefined)}
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </Box>
                        <FormLabel pt={5}>Upload an Image</FormLabel>
                        <Box pb={5}>
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
                        </Box>
                      </FormControl>
                    </SimpleGrid>
                  </>
                )}
                <GridItem colSpan={6}>
                  <Box pt={3} pb={3}>
                    <Flex justifyContent="flex-end">
                      {step === 1 && (
                        <Link to="/recipes">
                          <Button colorScheme="red">Cancel</Button>
                        </Link>
                      )}
                      {step !== 1 && (
                        <Button
                          onClick={() => {
                            setStep(step - 1);
                            setProgress(progress - 25);
                          }}
                        >
                          {" "}
                          Back
                        </Button>
                      )}
                      <Spacer />

                      {step !== 4 && (
                        <Button
                          onClick={() => {
                            setStep(step + 1);
                            setProgress(progress + 25);
                          }}
                          colorScheme="teal"
                        >
                          Next
                        </Button>
                      )}
                      {step === 4 && (
                        <Button
                          onClick={() => {
                            onSubmit(values);
                          }}
                          colorScheme="teal"
                          // isLoading={isSubmitting}
                          // isDisabled={isSubmitting}
                          // spinner={<Spinner size="sm" />}
                        >
                          Create Recipe
                          <Box pl={2}>
                            <GiBubblingBowl />
                          </Box>
                        </Button>
                      )}
                    </Flex>
                  </Box>
                </GridItem>
                <FocusError />
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default CreateRecipe;
