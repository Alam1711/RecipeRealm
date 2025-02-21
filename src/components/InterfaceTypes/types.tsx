import { Dayjs } from "dayjs";

export interface CookingAppliance {
  key: string;
  quantity: number;
}

export enum UnitOfMeasurement {
  Units = "",
  Pounds = "lbs",
  Ounces = "oz",
  Grams = "grams",
  Milligrams = "milligrams",
  Cups = "cups",
  Tablespoons = "tablespoon",
  Teaspoons = "teaspoon",
}

export interface Ingredient {
  name: string;
  quantity: number;
  unitofMeasurement: UnitOfMeasurement;
}

export interface Nutrition {
  calories: number;
  total_fat: number;
  saturated_fat: number;
  cholesterol: number;
  sodium: number;
  total_carbohydrate: number;
  dietary_fiber: number;
  sugars: number;
  protein: number;
}

export interface Recipe {
  recipe_name: string;
  servings: number;
  allergens: string;
  cooking_applications: CookingAppliance[];
  cooking_time: Dayjs;
  prep_time: Dayjs;
  oven_time: Dayjs;
  cost_per_serving: string;
  difficulty: string;
  posted: boolean;
  ingredients: Ingredient[];
  instructions: string[];
  nutrients: Nutrition;
  pic: string;
}

export type event = {
  recipe: Recipe;
  date: string;
  title: string;
};

export interface passUpdateValues {
  username: string;
  oldPassword: string;
  newPassword: string;
}

export type Comment = {
  date_time: any;
  comment: string;
  pic: any;
  username: string;
};

export interface LabelValue {
  label: string;
  value: string;
}
