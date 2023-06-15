import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

import { ChevronUp, ChevronDown } from '@strapi/icons';
import { Icon, Flex, Grid, GridItem, Box, Select, Option, Button, TextInput } from '@strapi/design-system';
import { redirectTypeOptions } from './types';
import getTrad from '../../helpers/getTrad';
import S from '../../helpers/styles';

const RedirectForm = (props) => {
  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [submitMore, setSubmitMore] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {
      from: props.initialValues && props.initialValues.from || '',
      to: props.initialValues && props.initialValues.to || '',
      type: props.initialValues && props.initialValues.type || redirectTypeOptions[0],
    },
    validationSchema: FormSchema(formatMessage),
    onSubmit: (e) => {
      props.handleSubmit(e, submitMore);
      setSubmitMore(false);
    }
  });

  useEffect(() => {
    if ((props.resetCount || 0) > 0) {
      formik.resetForm();
    }
  }, [props.resetCount]);

  const handleSelectChange = (e, fieldId) => {
    formik.handleChange(fieldId, e);
    formik.setFieldValue(fieldId, e);
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box padding={6} background="neutral0" hasRadius shadow="tableShadow">
        <Grid gap={4}>
          <GridItem col={6}>
            <TextInput
              id="from"
              name="from"
              value={formik.values.from}
              label={formatMessage({ id: getTrad('detail.form.from.label') })}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.from}
            />
          </GridItem>
          <GridItem col={6}>
            <TextInput
              id="to"
              name="to"
              value={formik.values.to}
              label={formatMessage({ id: getTrad('detail.form.to.label') })}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.to}
            />
          </GridItem>

          <GridItem col={6}>
            <Select
              id="type"
              name="type"
              value={formik.values.type}
              label={formatMessage({ id: getTrad('detail.form.type.label') })}
              onChange={(e) => handleSelectChange(e, 'type')}
              onBlur={formik.handleBlur}
              error={formik.errors.type}
            >
              {redirectTypeOptions.map((option) => (
                <Option key={option} value={option}>
                  {formatMessage({ id: getTrad(`detail.form.type.value.${option}`) })}
                </Option>
              ))}
            </Select>
          </GridItem>

          <GridItem col={12}>
            <S.SelectHelp type="button" onClick={() => setIsOpen(!isOpen)}>
              {formatMessage({ id: getTrad('detail.form.type.help') })}

              <Icon width={3} height={3} as={isOpen ? ChevronUp : ChevronDown} />
            </S.SelectHelp>

            {isOpen && (
              <S.InfoBox hasRadius padding={4} marginTop={4} background={{ background: 'neutral100' }}>
                {redirectTypeOptions.map((option) => (
                  <S.InfoItem key={option}>
                    {formatMessage(
                      {
                        id: getTrad(`detail.form.type.value.${option}.description`)
                      },
                      {
                        strong: (chunks) => <strong>{chunks}</strong>
                      }
                    )}
                  </S.InfoItem>
                ))}
              </S.InfoBox>
            )}
          </GridItem>
        </Grid>
      </Box>

      <Box marginTop={4}>
        <Flex gap={2} justifyContent="flex-end">
          {props.isNew && (
            <Button
              variant="secondary"
              onClick={() => {
                setSubmitMore(true);
                formik.submitForm();
              }}
            >
              {formatMessage({ id: getTrad('detail.form.submit.new.title') })}
            </Button>
          )}
          <Button type="submit">{formatMessage({ id: getTrad('detail.form.submit.title') })}</Button>
        </Flex>
      </Box>
    </form>
  );
};

export { RedirectForm };

const FormSchema = (formatMessage) => {
  const relativeUrlRegEx = /^(?!www\.|(?:https?|ftp):\/\/|[A-Za-z]:\\|\/\/).+$/;
  const absoluteUrlRegex = /^(www\.|(?:https?|ftp):\/\/|[A-Za-z]:\\|\/\/).+$/;
  const fm = (id, values) => formatMessage({ id: getTrad(id) }, values);

  return Yup.object().shape({
    from: Yup.string()
      .matches(relativeUrlRegEx, fm('general.form.errors.relativeUrl'))
      .required(fm('general.form.errors.required')),
    to: Yup.string()
      .oneOf([Yup.string().matches(relativeUrlRegEx), Yup.string().matches(absoluteUrlRegex)],  fm('general.form.errors.url'))
      .required(fm('general.form.errors.required'))
      .when(['from'], (from, schema) => schema.notOneOf([from], fm('general.form.errors.duplicate', { field: 'from' }))),
    type: Yup.string()
      .required(fm('general.form.errors.required'))
      .oneOf(redirectTypeOptions, fm('general.form.errors.oneOf'))
  });
};
