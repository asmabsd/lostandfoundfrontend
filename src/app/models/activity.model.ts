// src/app/models/activity.model.ts
import { Blog } from "./blog.model";
import { CategoryA } from "./category-a.enum";
import { User } from "./user.model";

export interface Activity {
  idActivity?: number; // Optional for new activities
  name: string;
  categoryA: CategoryA;
  location: string;
  disponibility: boolean;
  price: number;
  imagePath?: string; // Optional, can be set by backend
  user: {
    id: number;
  };
  blog?: Blog; // Optional blog association
}