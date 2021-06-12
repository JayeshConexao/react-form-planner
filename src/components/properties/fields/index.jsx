import * as React from "react";
import { FPCheckbox, FPFormControlLabel, FPHeaderField, FPLabelField, FPTextField, FPNoContentAvailable, FPFormLabel, FPRichTextEditor, FPFieldSet } from "../../styled";
import FPDataGrid from "./FPDataGrid";
import FPRadioControl from "./FPRadio";
import FPDropzoneDialog from "./FPDropzoneDialog";
import FPPdfViewer from "./FPPdfViewer";
import { faImage, faVideo, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const getStyleObject = (style) => {
  const res = {};
  if (style) {
    style.forEach((s) => {
      res[s["name"]] = s["value"];
    })
  }
  return res;
}
export const getFinalField = (infield, onValueChange, invalue, label, fieldname) => {
  let resComponent = {};
  const field = Object.assign({}, infield);
  const strFieldName = fieldname ? fieldname : field.datafield;
  if (!field.custom) {
    field.custom = {
      style: [],
      props: []
    }
  }

  const value = invalue || field.value;

  const localprops = {
    style: getStyleObject(field.custom.style),
    ...field.custom.props
  }
  switch (field.type) {
    case "richeditor":
      const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          ['clean']
        ],
      }
      const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
      ]
      resComponent = <FPRichTextEditor value={value}
        theme={'snow'}
        placeholder={field.placeholder}
        modules={modules}
        formats={formats}
        bounds={'.app'}
        onChange={(e) => {
          if (onValueChange) {
            onValueChange(strFieldName, e, field)
          }
        }} />;
      break;
    case "text": resComponent = <FPTextField id={`text-field-${strFieldName}`}

      label={`${label || field.label}`}
      value={value}
      onChange={(e) => {
        if (onValueChange) {
          onValueChange(strFieldName, e.target.value, field)
        }
      }}
      type={field.subtype || "text"}
      fullWidth
      size="small"
      variant="outlined"
      {...localprops} />
      break;
    case "divider": resComponent = <hr className="MuiDivider-root" {...localprops} />
      break;
    case "header": resComponent = <FPHeaderField {...localprops} >{label || field.label}</FPHeaderField>
      break;
    case "label": resComponent = <FPLabelField dangerouslySetInnerHTML={{ __html: label || field.label }} {...localprops}></FPLabelField >
      break;
    case "radio": resComponent = <FPRadioControl onChange={(fld, val, fielddata) => {
      if (onValueChange) {
        onValueChange(fld, val, fielddata)
      }
    }}
      field={field}
      rows={value && value.length ? value : []}
      {...localprops}>

    </FPRadioControl >
      break;
    case "checkbox": resComponent = (
      <div><FPFormControlLabel control={
        <FPCheckbox
          checked={value}
          onChange={(e) => {
            if (onValueChange) {
              onValueChange(strFieldName, e.target.checked, field)
            }
          }}
          name="checkedB"
          color="primary"
          {...localprops}
        />
      }
        label={`${label || field.label}`}></FPFormControlLabel>
      </div>
    )
    case "textarea": resComponent = <FPTextField label={`${label || field.label}`}
      multiline
      value={value}
      onChange={(e) => {
        if (onValueChange) {
          onValueChange(strFieldName, e.target.value, field)
        }
      }}
      fullWidth
      size="small"
      variant="outlined"
      {...localprops}
    />
      break;
    case "grid": resComponent = (
      <FPDataGrid
        onChange={(fld, val, fielddata) => {
          if (onValueChange) {
            onValueChange(fld, val, fielddata)
          }
        }}
        field={field}
        columns={field.columns | [
          { field: 'name', headerName: 'Property Name', width: 180, editable: true },
          { field: 'value', headerName: 'Value', width: 180, editable: true },
        ]}
        rows={value && value.length ? value : []}
        {...localprops}
      />)
      break;
    case "fileupload": resComponent = (
      <FPDropzoneDialog
        onChange={(fld, val, fielddata) => {
          if (onValueChange) {
            onValueChange(fld, val, fielddata)
          }
        }}
        field={field}
        {...localprops}
      />)
      break;
    case "image": resComponent = (
      <React.Fragment>
        {value && value.length ? (<React.Fragment>
          {value.map((f, fi) => {
            return <div key={fi}>
              <img src={`${f}`} alt={f} {...localprops}></img>
            </div>
          })}
        </React.Fragment>) : (
          <FPNoContentAvailable>
            <div><FontAwesomeIcon icon={faImage} /></div>
            <div>NO IMAGE SELECTED</div>
          </FPNoContentAvailable>
        )}
      </React.Fragment>
    )
      break;
    case "video": resComponent = (
      <React.Fragment>
        {value ? (<ReactPlayer url={`${value}`} />) : (
          <FPNoContentAvailable>
            <div><FontAwesomeIcon icon={faVideo} /></div>
            <div >NO VIDEO SELECTED</div>
          </FPNoContentAvailable>
        )}
      </React.Fragment>
    )
      break;
    case "pdf": resComponent = (
      <React.Fragment>
        {value ? (<FPPdfViewer value={value} />) : (
          <FPNoContentAvailable>
            <div><FontAwesomeIcon icon={faFilePdf} /></div>
            <div >NO PDF FILE SELECTED</div>
          </FPNoContentAvailable>
        )}
      </React.Fragment>

    )
      break;

    default: resComponent = <React.Fragment></React.Fragment>

  }
  return resComponent;
}