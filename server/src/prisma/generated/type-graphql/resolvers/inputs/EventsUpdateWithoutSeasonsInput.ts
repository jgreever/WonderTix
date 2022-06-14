import * as TypeGraphQL from 'type-graphql';
import * as GraphQLScalars from 'graphql-scalars';
import {Prisma} from '@prisma/client';
import {DecimalJSScalar} from '../../scalars';
import {Event_instancesUpdateManyWithoutEventsInput} from '../inputs/Event_instancesUpdateManyWithoutEventsInput';
import {NullableBoolFieldUpdateOperationsInput} from '../inputs/NullableBoolFieldUpdateOperationsInput';
import {NullableStringFieldUpdateOperationsInput} from '../inputs/NullableStringFieldUpdateOperationsInput';
import {StringFieldUpdateOperationsInput} from '../inputs/StringFieldUpdateOperationsInput';

@TypeGraphQL.InputType('EventsUpdateWithoutSeasonsInput', {
  isAbstract: true,
})
export class EventsUpdateWithoutSeasonsInput {
  @TypeGraphQL.Field((_type) => StringFieldUpdateOperationsInput, {
    nullable: true,
  })
    eventname?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => NullableStringFieldUpdateOperationsInput, {
    nullable: true,
  })
    eventdescription?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => NullableBoolFieldUpdateOperationsInput, {
    nullable: true,
  })
    active?: NullableBoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => NullableStringFieldUpdateOperationsInput, {
    nullable: true,
  })
    image_url?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => Event_instancesUpdateManyWithoutEventsInput, {
    nullable: true,
  })
    event_instances?: Event_instancesUpdateManyWithoutEventsInput | undefined;
}
