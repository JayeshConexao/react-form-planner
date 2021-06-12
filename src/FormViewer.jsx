import * as React from 'react';
import { useState, useEffect } from 'react';
import { getFinalField } from './components/properties/fields';
import { FPFormRow, FPFormWrapper } from './components/styled';
import { dark } from './themes/dark';
import { ThemeProvider } from "styled-components";

export const FormViewer = ({ templates, data, onFormValueChanged, onControlValueChanged, controlMarker, theme = 'dark' }) => {

  const [finalData, setFinalData] = useState({});
  const [localTemplates, setLocalTemplates] = useState([]);

  useEffect(() => {
    if (data) {
      setFinalData(data);
    }
    if (templates) {
      setLocalTemplates(templates);
    }
  }, [data, templates])

  const controlValueChanged = (key, value, fld) => {
    finalData[key] = value;
    setFinalData(finalData)
    if (onControlValueChanged) {
      onControlValueChanged(key, value, fld);
    }
    if (onFormValueChanged) {
      onFormValueChanged(finalData);
    }
  }

  const getComponent = (field, data) => {
    const res = getFinalField(field, controlValueChanged, data || "");
    return res;
  }


  return (
    <ThemeProvider theme={theme == 'dark' ? dark : ''}>
      <FPFormWrapper>
        {localTemplates && localTemplates.length ? (
          <React.Fragment>
            {
              localTemplates.map((ft, fti) => {
                return <FPFormRow key={fti} selected={controlMarker === fti}>
                  {getComponent(ft, finalData[ft ? ft.datafield : 'dummy'])}
                </FPFormRow>
              })
            }
          </React.Fragment>
        ) : (
          <div></div>
        )
        }
      </FPFormWrapper >
    </ThemeProvider>
  )
}
