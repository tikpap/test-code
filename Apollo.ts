import {
    CompanySharedFolder,
    QueryCompanySharedListArgs,
    MutationSendAccessRequestArgs,
} from '@generated';
import { paginate, stableSort, getComparator } from '@utils';
import { IResolvers } from 'graphql-tools';
import { responseFilesAdapter } from './adapters';

export const resolvers: IResolvers = {
    Query: {
        getShares: async (_source, { user }, { dataSources }) => {
            return dataSources.storageApi.getShares(user);
        },
        companySharedList: async (
            _source,
            { input: { pagination, sort } }: QueryCompanySharedListArgs,
            { dataSources }
        ) => {
            const data = await dataSources.storageApi.companySharedList();

            const adaptedData = responseFilesAdapter<CompanySharedFolder>(data);

            const sortedData = sort
                ? stableSort<CompanySharedFolder>(
                    adaptedData,
                    getComparator(sort.order, sort.orderBy)
                )
                : adaptedData;

            return {
                content: paginate<CompanySharedFolder>(sortedData, pagination),
                totalItems: data.length,
            };
        },
        companySharedFolderInfo: async (
            _source,
            { folder_hash },
            { dataSources }
        ) => {
            return dataSources.storageApi.companySharedFolderInfo(folder_hash);
        },
    },
    Mutation: {
        sendAccessRequest: async (
            _source,
            { input: { folderHash, ...restInput } }: MutationSendAccessRequestArgs,
            { dataSources }
        ) => {
            return dataSources.storageApi.sendAccessRequest({
                folder_hash: folderHash,
                ...restInput,
            });
        },
    },
};

export default resolvers;
