import React, { MouseEvent, useCallback, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { Pagination as PaginationComponent } from '@material-ui/lab';

import { Pagination, Sort, SortOrder } from '@api';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_START_PAGE_NUMBER } from '@constants';
import { useQsQueryParams } from '@hooks';
import { fileKeySelector } from '@utils';
import { PopoverAnchorElement, SimpleTableProps } from './SimpleTable.types';
import SimpleTableHead from './SimpleTableHead';
import SimpleTableRow from './SimpleTableRow';
import SimpleTableToolbar from './SimpleTableToolbar';

import { Styled } from './SimpleTable.styled';

export default function SimpleTable<T>(props: SimpleTableProps<T>) {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [_, setSort] = useState<Sort>({ order: SortOrder.Asc, orderBy: 'path' });
    const [anchorEl, setAnchorEl] = React.useState<PopoverAnchorElement | null>(null);

    const [{ page = DEFAULT_START_PAGE_NUMBER, itemsPerPage = DEFAULT_ITEMS_PER_PAGE }, setParams] =
        useQsQueryParams<Pagination>();

    const {
        headers,
        rows,
        keySelector = fileKeySelector,
        hasCheckbox,
        onChangeSelected,
        toolbarComponent,
        popoverComponent,
        total,
    } = props;
    const handleOnChangeSort = (sort: Sort) => {
        setSort(sort);
    };

    const handleSelectAllClick = (checked: boolean) => {
        const selectedRows = checked ? rows : [];

        setSelected(selectedRows.map(keySelector));
        onChangeSelected?.(selectedRows);
    };

    const togglePopover = ({ pageX, pageY, currentTarget }: MouseEvent, row: T) => {
        const key = keySelector(row);
        if (!selected.some((item) => item === key)) {
            setSelected([...selected, key]);
        }

        setAnchorEl(anchorEl ? null : { x: pageX, y: pageY, element: currentTarget });
    };
    const handleClosePopover = (values: string[]) => {
        setSelected(selected.filter((item) => !values.includes(item)));

        setAnchorEl(null);
    };

    const handleChangeRow = (event: React.ChangeEvent<HTMLInputElement>, row: T) => {
        const key = keySelector(row);
        if (event.target.checked) {
            setSelected([...selected, key]);
        } else {
            setSelected(selected.filter((item) => item !== key));
        }
    };
    const handleOnChangeItemsPerPage = useCallback(
        (value: number) => {
            setParams({ page, itemsPerPage: value });
        },
        [page],
    );

    const handleOnChangePage = useCallback(
        (event: React.ChangeEvent<unknown>, value: number) => {
            setParams({ itemsPerPage, page: value - 1 });
        },
        [itemsPerPage],
    );

    return (
        <Styled.TableContainer>
            <SimpleTableToolbar
                itemsPerPage={itemsPerPage}
                onChange={handleOnChangeItemsPerPage}
                numSelected={selected.length}
                toolbarComponent={toolbarComponent}
            />
            <Table aria-labelledby="tableTitle" aria-label="enhanced table">
                <colgroup>
                    {hasCheckbox && <col />}
                    {headers.map((item) => {
                        return <col key={item.id} width={item.width} />;
                    })}
                </colgroup>
                <SimpleTableHead
                    indeterminate={selected.length ? selected.length !== rows.length : false}
                    onSelectAll={handleSelectAllClick}
                    onChangeSort={handleOnChangeSort}
                    headCells={headers}
                    hasCheckbox={hasCheckbox}
                />
                <TableBody>
                    {rows.map((row) => {
                        const key = keySelector(row);
                        const isSelected = selected.some((item) => item === key);

                        return (
                            <SimpleTableRow
                                key={key}
                                hasCheckbox={hasCheckbox}
                                keySelector={keySelector}
                                cells={headers}
                                onContextMenu={popoverComponent && togglePopover}
                                onChange={handleChangeRow}
                                row={row}
                                selected={isSelected}
                            />
                        );
                    })}
                    {popoverComponent &&
                    popoverComponent({ selectedRows: selected, anchorEl, onClose: handleClosePopover })}
                </TableBody>
            </Table>
            <PaginationComponent
                count={Math.ceil(total / itemsPerPage)}
                onChange={handleOnChangePage}
                page={page + 1}
                showFirstButton
                showLastButton
            />
        </Styled.TableContainer>
    );
}
