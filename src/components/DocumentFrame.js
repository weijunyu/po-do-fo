import React from "react";
import PropTypes from "prop-types";
import "./DocumentFrame.css";

class DocumentFrame extends React.Component {
  render() {
    // Responsive iframe: https://benmarshall.me/responsive-iframes/
    return (
      <div className="iframe-container">
        <iframe
          src={this.props.src}
          title={this.props.title}
        ></iframe>
      </div>
    );
  }
}

DocumentFrame.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string
};

export default DocumentFrame;
