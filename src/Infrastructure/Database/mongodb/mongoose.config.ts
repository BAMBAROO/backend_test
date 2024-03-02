// mongoose.config.ts
import { MongooseModuleOptions } from '@nestjs/mongoose';

const mongooseConfig: MongooseModuleOptions = {
  uri: 'mongodb+srv://bambar00:<password>@cluster0.h0q4bjt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
};

export default mongooseConfig;
