import styled, { css } from 'styled-components';

import { Typography, Box } from '@strapi/design-system';

const SelectHelp = styled.button`
	${({ theme }) =>
		css`
			display: flex;
			gap: 8px;
			align-items: center;
			font-size: 12px;
			color: ${theme.colors.neutral600};

			&:hover {
				text-decoration: underline;
			}

			svg path {
				fill: ${theme.colors.neutral500};
			}
		`}
`;

const InfoBox = styled(Box)`
	${({ theme }) =>
		css`
			display: flex;
			flex-direction: column;
			gap: 16px;
			border: 1px solid ${theme.colors.neutral200};
		`}
`;

const InfoItem = styled(Typography)`
	${({ theme }) =>
		css`
			font-size: 14px;
			line-height: 1.2;
			color: ${theme.colors.neutral600};

			strong {
				font-weight: 700;
			}

			ul {
				list-style: disc;
				padding-left: 14px;
			}

			h4 {
				margin-bottom: 10px;
			}
		`}
`;

const ModalInfo = styled(Typography)`
${(props) => {
		if (props.type === 'CREATED') {
			return css`
				color: ${props.theme.colors.success600};
      `;
		} else if (props.type === 'LOOP_DETECTED') {
			return css`
				color: ${props.theme.colors.warning600};
      `;
		} else if (props.type === 'DUPLICATE') {
			return css`
				color: ${props.theme.colors.danger600};
      `;
		} else if (props.type === 'UPDATED') {
			return css`
				color: ${props.theme.colors.warning600};
      `;
		} else {
			return css`
				color: ${props.theme.colors.neutral800};
			`;
		}
	}}
`;

const RedirectPluginStyles = {
	InfoBox,
	InfoItem,
	SelectHelp,
	ModalInfo
};

export default RedirectPluginStyles;