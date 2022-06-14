import * as TypeGraphQL from 'type-graphql';
import * as GraphQLScalars from 'graphql-scalars';
import {DiscountsWhereUniqueInput} from '../../../inputs/DiscountsWhereUniqueInput';

@TypeGraphQL.ArgsType()
export class DeleteDiscountsArgs {
  @TypeGraphQL.Field((_type) => DiscountsWhereUniqueInput, {
    nullable: false,
  })
    where!: DiscountsWhereUniqueInput;
}
