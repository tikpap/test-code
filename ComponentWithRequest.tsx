import React, { useEffect } from 'react';

import { Pagination, SortOrder, useFavoritesLazyQuery } from '@api';
import { SimpleTable, WithLoading } from '@components';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_START_PAGE_NUMBER } from '@constants';
import { useQsQueryParams } from '@hooks';
import { useDocumentTableConfig } from './useDocumentTableTitles';

const FavoritesFiles = () => {
    const [favoritesQuery, { data, loading }] = useFavoritesLazyQuery();
    const [{ page = DEFAULT_START_PAGE_NUMBER, itemsPerPage = DEFAULT_ITEMS_PER_PAGE }] =
        useQsQueryParams<Pagination>();
    const headers = useDocumentTableConfig();

    const list = data?.favorites?.content || [];

    useEffect(() => {
        favoritesQuery({
            variables: {
                input: {
                    sort: { orderBy: 'path', order: SortOrder.Asc },
                    pagination: {
                        page,
                        itemsPerPage,
                    },
                },
            },
        });
    }, [page, itemsPerPage]);

    return (
        <>
            {loading ? (
                <WithLoading loading />
            ) : (
                <SimpleTable
                    rows={list}
                    headers={headers}
                    hasCheckbox
                    total={data?.favorites?.totalItems || 0}
                />
            )}
        </>
    );
};

export default FavoritesFiles;
