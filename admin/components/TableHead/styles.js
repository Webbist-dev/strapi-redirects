import styled from 'styled-components';
import { Th } from '@strapi/design-system';

const _Th = styled(Th)`
	> * > * {
		cursor: pointer;
	}
`;

const TableHeadStyles = {
	Th: _Th
};

export default TableHeadStyles;