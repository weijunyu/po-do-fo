import React from "react";
import PropTypes from "prop-types";
import "./DocumentFrame.css";

class DocumentFrame extends React.Component {
  render() {
    // TODO: Responsive iframe
    // https://benmarshall.me/responsive-iframes/
    return (
      <iframe
        src={this.props.src}
        title={this.props.title}
        className="document-frame"
      ></iframe>
    );
  }
}

DocumentFrame.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string
};

export default DocumentFrame;
