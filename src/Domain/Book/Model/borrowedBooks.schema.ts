import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type BorrowedBookDocument = HydratedDocument<BorrowedBook>;

@Schema()
export class BorrowedBook {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Book' })
  book: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Member' })
  member: string;

  @Prop()
  borrow_date: Date;

  @Prop()
  return_date: Date;
}

export const BorrowedBooksSchema = SchemaFactory.createForClass(BorrowedBook);
