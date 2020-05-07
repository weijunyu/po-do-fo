import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import PropTypes from "prop-types";
import styled from "styled-components";

const Bordered = styled.div`
  border: 1px solid grey;
`;

function DocumentFrame(props) {
  const [blobUrl, setBlobUrl] = useState(null);
  useEffect(() => {
    const blob = new Blob([props.pageBytes], {
      type: "application/pdf",
    });

    setBlobUrl(URL.createObjectURL(blob));
  }, [props.pageBytes]);
  return (
    <Bordered style={props.style}>
      <Document file={blobUrl} className={`${props.className}-doc`}>
        <Page
          pageNumber={1}
          className={props.className}
          onRenderSuccess={props.onRenderSuccess}
        />
      </Document>
    </Bordered>
  );
}

DocumentFrame.defaultProps = {
  onRenderSuccess: () => {},
};

DocumentFrame.propTypes = {
  pageBytes: function (props, propName) {
    return props[propName] instanceof Uint8Array
      ? null
      : new Error("pageBytes should be a TypedArray.");
  },
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.string,
};

export default DocumentFrame;
