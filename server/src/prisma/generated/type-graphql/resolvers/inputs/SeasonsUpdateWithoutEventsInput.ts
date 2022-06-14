import * as TypeGraphQL from 'type-graphql';
import * as GraphQLScalars from 'graphql-scalars';
import {Prisma} from '@prisma/client';
import {DecimalJSScalar} from '../../scalars';
import {NullableDateTimeFieldUpdateOperationsInput} from '../inputs/NullableDateTimeFieldUpdateOperationsInput';
import {NullableStringFieldUpdateOperationsInput} from '../inputs/NullableStringFieldUpdateOperationsInput';
import {TickettypeUpdateManyWithoutSeasonsInput} from '../inputs/TickettypeUpdateManyWithoutSeasonsInput';

@TypeGraphQL.InputType('SeasonsUpdateWithoutEventsInput', {
  isAbstract: true,
})
export class SeasonsUpdateWithoutEventsInput {
  @TypeGraphQL.Field((_type) => NullableStringFieldUpdateOperationsInput, {
    nullable: true,
  })
    name?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => NullableDateTimeFieldUpdateOperationsInput, {
    nullable: true,
  })
    startdate?: NullableDateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => NullableDateTimeFieldUpdateOperationsInput, {
    nullable: true,
  })
    enddate?: NullableDateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => TickettypeUpdateManyWithoutSeasonsInput, {
    nullable: true,
  })
    tickettype?: TickettypeUpdateManyWithoutSeasonsInput | undefined;
}
