import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from '@material-ui/core';

import { useMultiDeleteMutation } from '@api';
import { useReactiveVar } from '@apollo/client';
import { toaster } from '@helpers';
import { useModal } from '@hooks';
import { documentCurrentPathVar, documentSelectedVar, documentVar } from '@store';
import { documentModalQuerys, paths } from '@utils';

import { Styled } from '../Modal.styled';

const BlockMemberModal = () => {
    const { path, name } = useReactiveVar(documentVar) || {};
    const documentSelected = useReactiveVar(documentSelectedVar);
    const currentPath = useReactiveVar(documentCurrentPathVar);
    const { t } = useTranslation('documents');
    const { push } = useHistory();
    const { RenderModal, isOpen, setIsOpen } = useModal(
        `${paths.documents}?folder=${currentPath}`,
        false,
    );
    const Modal = useMemo(() => RenderModal, [isOpen]);

    const [multiDelete] = useMultiDeleteMutation({ refetchQueries: ['Documents'] });

    const { search } = useLocation();

    const query = useMemo(() => new URLSearchParams(search), [search]);

    useEffect(() => {
        if (query.get('modal') === documentModalQuerys.documentsDelete) {
            setIsOpen(true);
        } else if (isOpen) {
            setIsOpen(false);
            documentVar(null);
        }
    }, [isOpen, query, setIsOpen]);

    const handleDelete = async () => {
        try {
            const paths = documentSelected.map((item) => item.path);
            await multiDelete({
                variables: {
                    paths: path ? [path] : paths,
                },
            });
            documentSelectedVar([]);
            push({ search: `?folder=${currentPath}` });
        } catch (e) {
            toaster(t('errorMessages.deleteModal'), 'error');
        }
    };

    const handleBack = () => {
        push({ search: `?folder=${currentPath}` });
    };

    return (
        <Modal title={`${t('deleteFolder.title')} ${name || 'it'}`}>
            <Styled.ModalContainer>
                <Styled.ModalDescription>{`${t('deleteFolder.description')}`}</Styled.ModalDescription>
                <Styled.ButtonContainer>
                    <Button color="secondary" variant="outlined" onClick={handleBack}>
                        {t('deleteFolder.buttons.cancel')}
                    </Button>
                    <Button onClick={handleDelete}>{t('deleteFolder.buttons.submit')}</Button>
                </Styled.ButtonContainer>
            </Styled.ModalContainer>
        </Modal>
    );
};

export default BlockMemberModal;
