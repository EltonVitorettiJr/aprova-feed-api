import { type Document, model, Schema, type Types } from "mongoose";

export interface IPost extends Document {
  clientId: Types.ObjectId;
  image_urls: string[];
  caption: string;
  scheduled_date: Date;
  status: "PENDING" | "APPROVED" | "ADJUSTMENT_NEEDED";
  feedback?: string;
}

const postSchema = new Schema<IPost>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Faz o relacionamento com a tabela de Users
      required: true,
    },
    image_urls: {
      type: [String],
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    scheduled_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "ADJUSTMENT_NEEDED"],
      default: "PENDING", // Todo post novo nasce como pendente
    },
    feedback: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Post = model<IPost>("Post", postSchema);
