import React from 'react';
import { IconButton, Typography, Thead, Tr } from '@strapi/design-system';
import { CarretUp, CarretDown } from '@strapi/icons';

import S from './styles';

const TableHead = (props) => {
  return (
    <Thead>
      <Tr>
        {props.headers.map((header) => (
          <S.Th
            key={header.name}
            action={
              props.sortBy === header.name && (
                <IconButton
                  onClick={() => props.handleSort(header.name)}
                  icon={props.sortOrder === 'asc' ? <CarretDown /> : <CarretUp />}
                  noBorder
                  aria-label="sort-icon"
                />
              )
            }
          >
            <Typography onClick={() => props.handleSort(header.name)} variant="sigma">
              {header.label}
            </Typography>
          </S.Th>
        ))}
      </Tr>
    </Thead>
  );
};

export { TableHead };