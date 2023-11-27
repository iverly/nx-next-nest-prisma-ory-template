import { Module } from '@nestjs/common';
import { AuthModule } from '@nx-next-nest-prisma-ory-template/auth';
import { DatabaseModule } from '@nx-next-nest-prisma-ory-template/database';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [],
})
export class NotesModule {}
