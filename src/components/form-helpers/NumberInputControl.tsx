import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormLabelProps,
  HStack,
  InputGroup,
  InputGroupProps,
  InputLeftAddon,
  InputProps,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import React, { useCallback, useMemo } from "react";

// Chakra-ui Colors
export const Blue500Color = "#3182CE";
export const Blue300Color = "#63B3ED";
export const Red500Color = "#E53E3E";
export const Red300Color = "#FC8181";

const NEGATIVE_DECIMAL_REGEX_PATTERN = "(-)?[0-9]*(.[0-9]+)?";

export interface NumberInputControlProps {
  label?: string;
  name: string;
  value: string | number | null;
  placeholder?: string;
  precision?: number;
  showStepper?: boolean;
  prefix?: string;
  sufix?: string;
  min?: number;
  max?: number;
  autoComplete?: InputProps["autoComplete"];
  isDisabled?: boolean;
  labelProps?: FormLabelProps;
  numberInputProps?: NumberInputProps;
  inputGroupProps?: InputGroupProps;
  widthSufix?: string;
  fontSizeS?: string;
  showMaxButton?: boolean;
  readOnly?: boolean;
}

export const NumberInputControl = ({
  name,
  value,
  placeholder,
  label,
  precision,
  showStepper = false,
  prefix,
  sufix,
  min,
  max,
  autoComplete = "off",
  isDisabled,
  labelProps,
  numberInputProps,
  inputGroupProps,
  widthSufix,
  fontSizeS,
  showMaxButton = false,
  readOnly = false,
}: NumberInputControlProps) => {
  const { submitCount } = useFormikContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [field, meta] = useField({
    name,
    defaultValue: value == null ? undefined : value,
    placeholder,
  });
  const { setFieldValue } = useFormikContext();

  const handleOnChange = useCallback(
    (newValue: any) =>
      setFieldValue(name, newValue.length > 0 ? newValue : null),
    [name, setFieldValue]
  );

  const shadowErrorColor = useColorModeValue(Red500Color, Red300Color);
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.300");

  const getTextBoxShadow = useMemo(() => {
    if (isOpen) return `0px 0px 0px 1px ${Blue500Color}`;
    if (meta.error && meta.touched)
      return `0px 0px 0px 1px ${shadowErrorColor}`;
    return "none";
  }, [isOpen, meta, shadowErrorColor]);

  return (
    <FormControl isInvalid={!!meta.error && (meta.touched || submitCount > 0)}>
      {label && (
        <FormLabel htmlFor={name} {...labelProps}>
          {label}
        </FormLabel>
      )}
      <HStack>
        <InputGroup
          shadow={getTextBoxShadow}
          border="1px solid"
          borderColor={
            isOpen
              ? "blue.500"
              : meta.error && meta.touched
              ? shadowErrorColor
              : borderColor
          }
          borderRadius="md"
          {...inputGroupProps}
        >
          {prefix && (
            <InputLeftAddon children={prefix} border="none" w="44px" />
          )}
          <NumberInput
            {...field}
            value={field.value ?? ""}
            id={name}
            onChange={handleOnChange}
            precision={precision}
            w="100%"
            min={min}
            max={max}
            shadow="none"
            boxShadow="none"
            border="none"
            _focus={{ shadow: "none" }}
            isDisabled={isDisabled}
            readOnly={readOnly}
            {...numberInputProps}
          >
            <NumberInputField
              name={name}
              placeholder={placeholder}
              borderLeftRadius={prefix ? "none" : "xs"}
              onFocus={onOpen}
              onBlur={onClose}
              pattern={
                min != null && min < 0
                  ? NEGATIVE_DECIMAL_REGEX_PATTERN
                  : undefined
              }
              shadow="none"
              boxShadow="none"
              border="none"
              _focus={{ shadow: "none" }}
              _invalid={{ boxShadow: "none", borderColor: "none" }}
              autoComplete={autoComplete}
            />
            {showStepper && !readOnly && (
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            )}
          </NumberInput>
          {sufix && (
            <InputRightAddon
              children={sufix}
              border="none"
              width={widthSufix ? widthSufix : "44px"}
              fontSize={fontSizeS}
            />
          )}
        </InputGroup>
        {showMaxButton && (
          <Button
            size="md"
            onClick={() => {
              setFieldValue(name, max);
            }}
            fontSize="sm"
          >
            Max
          </Button>
        )}
      </HStack>

      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};
