import React, { useState } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  numberOfStars?: number;
  setRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  numberOfStars,
  setRating,
}) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <Box display="flex" alignItems="center">
      {[...Array(numberOfStars || 5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <IconButton
            key={index}
            icon={<FaStar />}
            color={ratingValue <= (hover || rating) ? "#ffd700" : "#e4e5e9"}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
            variant="ghost"
            aria-label={`Rate ${ratingValue} stars`}
            fontSize="2xl"
          />
        );
      })}
    </Box>
  );
};

export default StarRating;
