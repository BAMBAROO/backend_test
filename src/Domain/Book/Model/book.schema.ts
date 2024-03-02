import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop()
  code: string;

  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  stock: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
