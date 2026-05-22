import { type Document, model, Schema } from "mongoose";

// 1. Definimos a Interface do TypeScript para o código saber os tipos
export interface IUser extends Document {
  name: string;
  email: string;
  isAdmin: boolean;
  avatar_url?: string;
}

// 2. Criamos o Schema do Mongoose para o MongoDB saber o que guardar
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Garante que não há emails duplicados
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    avatar_url: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Cria automaticamente os campos 'createdAt' e 'updatedAt'
  },
);

export const User = model<IUser>("User", userSchema);
