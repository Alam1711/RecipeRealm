import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputProps,
  InputRightAddon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import React, { ChangeEvent, useCallback } from "react";

export interface TextInputControlProps {
  label?: string;
  name: string;
  value: string | null;
  maxLength?: number;
  placeholder?: string;
  helperText?: string;
  prefix?: string;
  sufix?: string;
  autoFocus?: boolean;
  autoComplete?: InputProps["autoComplete"];
  labelFontWeight?: string;
  isDisabled?: boolean;
  inputLeftElement?: React.ReactChild;
  inputProps?: InputProps;
  onlyChangeOnBlur?: boolean;
  defaultValue?: string;
}

export const TextInputControl = ({
  name,
  value,
  placeholder,
  label,
  maxLength,
  helperText,
  prefix,
  sufix,
  autoFocus,
  autoComplete = "off",
  isDisabled,
  inputLeftElement,
  inputProps,
  onlyChangeOnBlur,
  defaultValue,
}: TextInputControlProps) => {
  const { submitCount } = useFormikContext();
  const [field, meta, helper] = useField({
    name,
    value: value === null ? undefined : value,
    placeholder,
  });

  const inputBgColor = useColorModeValue("white", "transparent");
  const addonBgColor = useColorModeValue("unset", "gray.700");

  const handleOnBlur = useCallback(
    (value: string) => {
      helper.setTouched(true);
      helper.setValue(value || null);
    },
    [helper]
  );

  return (
    <FormControl isInvalid={!!meta.error && (meta.touched || submitCount > 0)}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <InputGroup>
        {prefix && <InputLeftAddon children={prefix} />}
        {inputLeftElement && (
          <InputLeftElement
            width="max-content"
            pl={2}
            zIndex={-1}
            cursor="none"
            opacity={0.6}
          >
            {inputLeftElement}
          </InputLeftElement>
        )}
        <Input
          {...field}
          value={onlyChangeOnBlur ? undefined : field.value}
          name={name}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          isDisabled={isDisabled}
          bgColor={inputBgColor}
          maxLength={maxLength}
          {...inputProps}
          onChange={onlyChangeOnBlur ? undefined : field.onChange}
          defaultValue={
            onlyChangeOnBlur && defaultValue ? defaultValue : undefined
          }
          onBlur={
            onlyChangeOnBlur
              ? (e: ChangeEvent<HTMLInputElement>) =>
                  handleOnBlur(e.target.value)
              : undefined
          }
        />
        {sufix && (
          <InputRightAddon
            children={sufix}
            bg={addonBgColor}
            borderLeft="unset"
            color="gray.400"
            ml="unset"
          />
        )}
      </InputGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};
