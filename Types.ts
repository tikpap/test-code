import { FC, ReactNode } from 'react';

import { SimpleHeaderCellProps } from './SimpleTableHeaderCell';

export interface ISimpleRowsProps {
    content: ReactNode;
    id: string;
    align?: string;
}

export interface PopoverAnchorElement {
    x: number;
    y: number;
    element: Element;
}

export interface TableRowPopoverProps {
    anchorEl: PopoverAnchorElement | null;
    selectedRows: string[];
    onClose: (value: string[]) => void;
}

export interface SimpleTableProps<T> {
    headers: SimpleHeaderCellProps[];
    rows: T[];
    hasCheckbox?: boolean;
    keySelector?: (value: T) => string;
    valueSelector?: (value: T) => string;
    onChangeSelected?: (values: T[]) => void;
    toolbarComponent?: FC;
    popoverComponent?: FC<TableRowPopoverProps>;
    total: number;
}
