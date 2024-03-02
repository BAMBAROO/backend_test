import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MemberDocument = HydratedDocument<Member>;

@Schema()
export class Member {
  @Prop()
  name: string;

  @Prop({ default: false })
  penalty_status: boolean;

  @Prop()
  penalty_end_date: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
