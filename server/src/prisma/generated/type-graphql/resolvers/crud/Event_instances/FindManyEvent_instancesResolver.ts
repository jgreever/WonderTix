import * as TypeGraphQL from 'type-graphql';
import graphqlFields from 'graphql-fields';
import {GraphQLResolveInfo} from 'graphql';
import {FindManyEvent_instancesArgs} from './args/FindManyEvent_instancesArgs';
import {Event_instances} from '../../../models/Event_instances';
import {transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount} from '../../../helpers';

@TypeGraphQL.Resolver((_of) => Event_instances)
export class FindManyEvent_instancesResolver {
  @TypeGraphQL.Query((_returns) => [Event_instances], {
    nullable: false,
  })
  async findManyEvent_instances(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindManyEvent_instancesArgs): Promise<Event_instances[]> {
    const {_count} = transformFields(
        graphqlFields(info as any),
    );
    return getPrismaFromContext(ctx).event_instances.findMany({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
