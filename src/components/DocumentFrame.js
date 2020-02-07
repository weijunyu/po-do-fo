import React from "react";
import PropTypes from "prop-types";
import { Document, Page } from "react-pdf";
import "./DocumentFrame.css";

class DocumentFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.blob = new Blob([this.props.pageBytes], {
      type: "application/pdf"
    });
    this.state.blobUrl = URL.createObjectURL(this.state.blob);
  }

  render() {
    return (
      <div className="document-frame" style={this.props.style}>
        <Document
          file={this.state.blobUrl}
          className={`${this.props.className}-doc`}
        >
          <Page
            pageNumber={1}
            className={this.props.className}
            onRenderSuccess={this.props.onRenderSuccess}
          />
        </Document>
      </div>
    );
  }
}

DocumentFrame.defaultProps = {
  onRenderSuccess: () => {}
};

DocumentFrame.propTypes = {
  pageBytes: function(props, propName) {
    return props[propName] instanceof Uint8Array
      ? null
      : new Error("pageBytes should be a TypedArray.");
  },
  className: PropTypes.string
};

export default DocumentFrame;
