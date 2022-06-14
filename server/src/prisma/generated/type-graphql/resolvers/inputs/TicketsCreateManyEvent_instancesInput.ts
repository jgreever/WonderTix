import * as TypeGraphQL from 'type-graphql';
import * as GraphQLScalars from 'graphql-scalars';
import {Prisma} from '@prisma/client';
import {DecimalJSScalar} from '../../scalars';

@TypeGraphQL.InputType('TicketsCreateManyEvent_instancesInput', {
  isAbstract: true,
})
export class TicketsCreateManyEvent_instancesInput {
  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
    ticketno?: number | undefined;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
    type?: number | undefined;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
    custid?: number | undefined;

  @TypeGraphQL.Field((_type) => Boolean, {
    nullable: true,
  })
    paid?: boolean | undefined;

  @TypeGraphQL.Field((_type) => Boolean, {
    nullable: true,
  })
    active?: boolean | undefined;

  @TypeGraphQL.Field((_type) => Boolean, {
    nullable: true,
  })
    checkedin?: boolean | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
    checkedin_ts?: Date | undefined;

  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
    payment_intent?: string | undefined;

  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
    comments?: string | undefined;
}
