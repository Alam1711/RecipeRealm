import {
  Box,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FC, useCallback, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Ingredient, UnitOfMeasurement } from "./InterfaceTypes/types";
import { Divider } from "antd";

interface IngredientsSectionProps {
  value: Ingredient[];
  setValues: (value: Ingredient[]) => void;
  setHasIngredient?: (hasItems: boolean) => void;
  isNameDisabled?: boolean;
}

export const IngredientsSection: FC<IngredientsSectionProps> = ({
  value,
  setValues,
  setHasIngredient,
  isNameDisabled,
}) => {
  const errorTextColor = useColorModeValue("red.500", "red.300");
  const bgC = useColorModeValue("gray.50", "gray.300");
  const onChangeText = useCallback(
    (text: string, index: number, key: keyof Ingredient) => {
      let newValue: Ingredient = { ...value[index] };

      switch (key) {
        case "name":
          newValue.name = text;
          break;
        case "quantity":
          newValue.quantity = Number(text);
          break;
        case "unitofMeasurement":
          newValue.unitofMeasurement = text as UnitOfMeasurement;
          break;
      }

      const updatedValue = [...value];
      updatedValue[index] = newValue;

      // Check if the last ingredient is valid
      const lastIngredient = updatedValue[updatedValue.length - 1];
      const isLastIngredientValid =
        lastIngredient.name.trim() !== "" && lastIngredient.quantity > 0;

      // Only add a new ingredient if the last one is valid
      if (isLastIngredientValid) {
        updatedValue.push({
          name: "",
          quantity: 0,
          unitofMeasurement: UnitOfMeasurement.Units,
        });
      }

      setValues(updatedValue);
    },
    [value, setValues, setHasIngredient]
  );

  const handleDeleteLabel = (index: number) => {
    if (index === value.length - 1) {
      return;
    }
    value.splice(index, 1);
    setValues([...value]);
  };

  useEffect(() => {
    const lastIngredient = value[value.length - 1];
    console.log(lastIngredient);
    if (
      lastIngredient &&
      lastIngredient.name.trim() !== "" &&
      lastIngredient.quantity > 0 &&
      (value.length === 1 ||
        (value[value.length - 2].name.trim() !== "" &&
          value[value.length - 2].quantity > 0))
    ) {
      const newValue = [
        ...value,
        {
          name: "",
          quantity: 0,
          unitofMeasurement: UnitOfMeasurement.Units,
        },
      ];
      setValues(newValue);
    }
  }, [value, setValues]);

  return (
    <Box>
      <HStack>
        <Box>
          {!isNameDisabled ? (
            <>
              <Text>Ingredients</Text>
              <Text fontSize="xs" color="gray.500">
                {`Use fields to add extra information about the Recipe.`}
              </Text>
            </>
          ) : null}
        </Box>
      </HStack>
      <Divider />
      {value.map((label, index) => (
        <Grid key={index}>
          <HStack pt={2}>
            <Box w="95%" backgroundColor={bgC} rounded="md" padding={2}>
              <Input
                id={`name${index}`}
                className="name"
                placeholder="Ingredient Name"
                value={label.name}
                onChange={(element) => {
                  onChangeText(element.target.value, index, "name");
                }}
                isInvalid={label.name === "" && index !== value.length - 1}
              />
              {label.name === "" && index !== value.length - 1 && (
                <Text fontSize="sm" textColor={errorTextColor}>
                  Ingredient Name is a required field
                </Text>
              )}
              <HStack pt={4} justifyContent="center">
                <VStack alignItems="flex-start" pr={8}>
                  <FormLabel fontSize="xs" color="gray.500" mb={0.5}>
                    Quantity
                  </FormLabel>
                  <Input
                    id={`quantity${index}`}
                    type="number"
                    className="quantity"
                    placeholder="Quantity"
                    value={label.quantity}
                    min={0}
                    onChange={(element) => {
                      onChangeText(element.target.value, index, "quantity");
                    }}
                    isInvalid={
                      label.quantity === 0 && index !== value.length - 1
                    }
                  />
                  {label.quantity === 0 && index !== value.length - 1 && (
                    <Text fontSize="sm" textColor={errorTextColor}>
                      Quantity is a required field
                    </Text>
                  )}
                </VStack>
                <VStack alignItems="flex-start">
                  <FormLabel fontSize="xs" color="gray.500" mb={0.5}>
                    Unit of Measurement
                  </FormLabel>
                  <Select
                    id={`unitofMeasurement${index}`}
                    className="unitofMeasurement"
                    placeholder="Select Unit"
                    value={label.unitofMeasurement}
                    onChange={(element) => {
                      onChangeText(
                        element.target.value,
                        index,
                        "unitofMeasurement"
                      );
                    }}
                  >
                    {Object.values(UnitOfMeasurement).map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </Select>
                </VStack>
              </HStack>
            </Box>
            <Box w="5%">
              <IconButton
                variant="ghost"
                aria-label="Delete label"
                icon={<FaTrashAlt fontSize={20} />}
                color={"grey.400"}
                onClick={() => handleDeleteLabel(index)}
              />
            </Box>
          </HStack>
        </Grid>
      ))}
    </Box>
  );
};
