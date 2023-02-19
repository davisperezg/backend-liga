import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClubController } from './controllers/club.controller';
import { Club, ClubSchema } from './schemas/club.schema';
import { ClubService } from './services/club.service';

@Module({
  controllers: [ClubController],
  providers: [ClubService],
  imports: [
    MongooseModule.forFeature([{ name: Club.name, schema: ClubSchema }]),
  ],
})
export class ClubModule {}
