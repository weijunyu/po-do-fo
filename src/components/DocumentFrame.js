import React from "react";
import PropTypes from "prop-types";
import { Document, Page } from "react-pdf";
import "./DocumentFrame.css";

class DocumentFrame extends React.Component {
  constructor(props) {
    super(props);
    this.pageRef = React.createRef();
    this.state = {};
    this.state.blob = new Blob([this.props.pageBytes], {
      type: "application/pdf"
    });
    this.state.blobUrl = URL.createObjectURL(this.state.blob);
    this.state.canvasPosition = {};
    this.state.painting = false;
    this.state.mouseCoordinates = [];
  }

  onDocumentLoad = pdf => {
    if (this.props.editable) {
      this.enableEditing();
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  enableEditing = () => {
    let pageWrapper = this.pageRef.current.ref;
    let canvasElement = pageWrapper.querySelector(`canvas`);
    this.canvasElement = canvasElement;

    this.setState({
      canvasCtx: canvasElement.getContext("2d")
    });

    const rect = canvasElement.getBoundingClientRect();
    this.setState({
      canvasPosition: rect
    });

    window.addEventListener("scroll", this.onScroll);

    canvasElement.addEventListener("mousedown", e => {
      this.setState({
        painting: true
      });
      this.paint(e, true);
    });

    canvasElement.addEventListener("mouseup", e => {
      this.setState({
        painting: false
      });
      this.state.canvasCtx.beginPath();
    });

    canvasElement.addEventListener("mousemove", e => this.paint(e));
  };

  onScroll = () => {
    const rect = this.canvasElement.getBoundingClientRect();
    this.setState({
      canvasPosition: rect
    });
  };

  paint = (e, force = false) => {
    this.setState({ mouseCoordinates: [e.clientX, e.clientY] });
    let painting = this.state.painting;
    let canvasCtx = this.state.canvasCtx;
    let canvasPosition = this.state.canvasPosition;
    if (!painting && !force) return;
    canvasCtx.lineWidth = 10;
    canvasCtx.lineCap = "round";
    canvasCtx.lineTo(
      e.clientX - canvasPosition.x,
      e.clientY - canvasPosition.y
    ); // Go to mouse
    canvasCtx.stroke();
    canvasCtx.beginPath();
    canvasCtx.moveTo(
      e.clientX - canvasPosition.x,
      e.clientY - canvasPosition.y
    );
  };

  render() {
    return (
      <div className="document-frame">
        <Document
          file={this.state.blobUrl}
          className={`${this.props.className}-doc`}
        >
          <Page
            pageNumber={1}
            onRenderSuccess={this.onDocumentLoad}
            className={this.props.className}
            ref={this.pageRef}
          />
        </Document>
      </div>
    );
  }
}
DocumentFrame.defaultProps = {
  editable: false
};
DocumentFrame.propTypes = {
  pageBytes: function(props, propName) {
    return props[propName] instanceof Uint8Array
      ? null
      : new Error("pageBytes should be a TypedArray.");
  },
  className: PropTypes.string,
  editable: PropTypes.bool
};

export default DocumentFrame;
