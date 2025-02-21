import React, { useRef } from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  VStack,
  Image,
  Heading,
  Text,
  Container,
  Divider,
} from "@chakra-ui/react";
import { useReactToPrint } from "react-to-print";
import Navbar from "../../components/HeaderFooters/Navbar";
import { AiFillPrinter } from "react-icons/ai";

const RecipeDetail: React.FC = () => {
  // Defines component Ref
  const componentRef = useRef<HTMLDivElement | null>(null);

  // Handle's Printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
    documentTitle: "recipe-detail",
  });

  // Adjust Recipe Size
  function recipeSize(ing: number) {
    return 17 - ing * 0.2 + "px";
  }

  // Get recipe data from localStorage
  const recipe = JSON.parse(
    window.localStorage.getItem("VIEWRECIPE") as string
  );

  return (
    <>
      <Navbar />
      <Center>
        {/* Button to print recipe */}
        <Button
          marginTop={3}
          boxShadow="xs"
          rounded="md"
          variant="solid"
          colorScheme="teal"
          marginBottom={3}
          padding={5}
          width={1000}
          maxW="container.lg"
          onClick={handlePrint}
        >
          <AiFillPrinter />
          <Text marginLeft={2}>Print Recipe</Text>
        </Button>
      </Center>
      <Center>
        <Box w="60%" p={4} rounded={40}>
          <Center>
            <Box
              ref={componentRef}
              bg="white"
              w="100%"
              p={4}
              color="black"
              rounded={40}
              boxShadow="md"
              className="printable"
            >
              <VStack spacing={6}>
                <Box w="100%" textAlign="center">
                  <Image
                    borderRadius="30px"
                    src={"newlogoteal.png"}
                    alt="Logo"
                    w={120}
                    mb={4}
                  />
                  <Heading>{recipe.recipe_name}</Heading>
                </Box>
                <HStack alignItems="start" width="100%" spacing={10}>
                  <Box
                    w="60%"
                    p={4}
                    boxShadow="xs"
                    rounded="md"
                    bg="gray.50"
                    minHeight="400px"
                    className="printable"
                  >
                    <Text fontSize={25} mb={5}>
                      Ingredients:
                    </Text>
                    {recipe.ingredients.map(
                      (ingredient: string, index: number) => (
                        <Text
                          key={index}
                          fontSize={recipeSize(recipe.ingredients.length)}
                          mb={2}
                        >
                          <li>{ingredient}</li>
                        </Text>
                      )
                    )}
                  </Box>
                  <Container>
                    <Center>
                      <Image
                        borderRadius="30px"
                        src={recipe.pic}
                        alt="Recipe Image"
                        w={480}
                        className="printable"
                      />
                    </Center>
                  </Container>
                </HStack>
                <Divider />
                <HStack width="100%" spacing={10}>
                  <VStack width="40%" spacing={4}>
                    <Box
                      boxShadow="xs"
                      rounded="md"
                      bg="gray.50"
                      p={4}
                      width="100%"
                      className="printable"
                    >
                      <Text fontSize={17}>Difficulty: {recipe.difficulty}</Text>
                      <Text fontSize={17}>Time: {recipe.cooking_time}</Text>
                      <Text fontSize={17}>Servings: {recipe.servings}</Text>
                      <Text fontSize={17}>Cost Per Serving: {recipe.cost}</Text>
                      <Text fontSize={17}>
                        Cooking Applications: {recipe.cooking_applications}
                      </Text>
                      <Text fontSize={17}>Allergens: {recipe.allergens}</Text>
                    </Box>
                    <Box
                      boxShadow="xs"
                      rounded="md"
                      bg="gray.50"
                      p={4}
                      width="100%"
                      height="188px"
                      className="printable"
                    >
                      <Text fontSize={20}>Notes</Text>
                    </Box>
                  </VStack>
                  <Box
                    w="60%"
                    p={4}
                    boxShadow="xs"
                    rounded="md"
                    bg="gray.50"
                    minHeight="400px"
                    className="printable"
                  >
                    <Text fontSize={25} mb={5}>
                      Instructions:
                    </Text>
                    <Text fontSize={17}>{recipe.instructions}</Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Box>
      </Center>
    </>
  );
};

export default RecipeDetail;
