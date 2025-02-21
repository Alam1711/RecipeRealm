import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

export function useShowToast() {
  const toast = useToast();

  const showToast = useCallback(
    (
      status: "error" | "success" | "info",
      title: string,
      id?: string,
      description?: string,
      duration?: number
    ) => {
      toast({
        duration: duration || 2000,
        id,
        isClosable: true,
        position: "top",
        status,
        title,
        description,
      });
    },
    [toast]
  );
  return showToast;
}
