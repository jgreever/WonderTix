import * as TypeGraphQL from 'type-graphql';
import * as GraphQLScalars from 'graphql-scalars';
import {Prisma} from '@prisma/client';
import {DecimalJSScalar} from '../../scalars';

@TypeGraphQL.InputType('Task_notesCreateManyInput', {
  isAbstract: true,
})
export class Task_notesCreateManyInput {
  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
    id?: number | undefined;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
    task_id?: number | undefined;

  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
    notes?: string | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
    date_created?: Date | undefined;
}
