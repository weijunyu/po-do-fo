import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import jsPDF from "jspdf";
import { Document, Page } from "react-pdf";
import "./DocumentFrame.css";
import { render } from "@testing-library/react";

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

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

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
        <span>
          {this.state.mouseCoordinates[0]},{this.state.mouseCoordinates[1]}
        </span>
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

  // const [canvasRef] = useState(React.createRef());
  // const [painting, setPainting] = useState(false);
  // const [documentCanvas, setDocumentCanvas] = useState(null);
  // const [canvasCtx, setCanvasCtx] = useState(null);
  // const [mouseCoordinates, setMouseCoordinates] = useState([]);
  // const [canvasPosition, setCanvasPosition] = useState({});

  // function onDocumentLoad(pdf) {
  //   const documentCanvas = document.querySelector(`.${className} canvas`);
  //   const ctx = documentCanvas.getContext("2d");
  //   if (!canvasCtx) {
  //     setCanvasCtx(ctx);
  //   } else {
  //     const rect = documentCanvas.current.getBoundingClientRect();
  //     setCanvasPosition(rect);
  //     function onScroll() {
  //       const rect = documentCanvas.current.getBoundingClientRect();
  //       setCanvasPosition(rect);
  //     }
  //     window.addEventListener("scroll", onScroll);
  //     return function cleanup() {
  //       window.removeEventListener("scroll", onScroll);
  //     };
  //   }
  // }

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   setCanvasCtx(ctx);

  //   // Resizing
  //   canvas.height = 600;
  //   canvas.width = 800;

  //   ctx.fillStyle = "red";
  //   ctx.strokeStyle = "blue";

  //   ctx.fillRect(25, 50, 10, 20);
  //   ctx.strokeRect(100, 100, 30, 25);

  //   ctx.beginPath();
  //   ctx.moveTo(150, 100);
  //   ctx.lineTo(175, 105);
  //   ctx.lineTo(175, 130);
  //   ctx.closePath();
  //   ctx.stroke();
  //   ctx.beginPath();
  // }, [canvasRef]);

  // useEffect(() => {
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   setCanvasPosition(rect);
  //   function onScroll() {
  //     const rect = canvasRef.current.getBoundingClientRect();
  //     setCanvasPosition(rect);
  //   }
  //   window.addEventListener("scroll", onScroll);
  //   return function cleanup() {
  //     window.removeEventListener("scroll", onScroll);
  //   };
  // }, [canvasRef]);

  // function startPainting(e) {
  //   setPainting(true);
  //   paint(e, true);
  // }
  // function stopPainting() {
  //   setPainting(false);
  //   canvasCtx.beginPath();
  // }
  // /**
  //  *
  //  * @param {*} e
  //  * @param {*} force Force drawing to happen. E.g. when simply a mouse click
  //  */
  // function paint(e, force = false) {
  //   setMouseCoordinates([e.clientX, e.clientY]);
  //   if (!painting && !force) return;
  //   canvasCtx.lineWidth = 10;
  //   canvasCtx.lineCap = "round";
  //   canvasCtx.lineTo(
  //     e.clientX - canvasPosition.x,
  //     e.clientY - canvasPosition.y
  //   ); // Go to mouse
  //   canvasCtx.stroke();
  //   canvasCtx.beginPath();
  //   canvasCtx.moveTo(
  //     e.clientX - canvasPosition.x,
  //     e.clientY - canvasPosition.y
  //   );
  // }

  // function exportCanvas() {
  //   const imgData = canvasRef.current.toDataURL("image/jpeg", 1.0);
  //   const pdf = new jsPDF();
  //   pdf.addImage(imgData, "JPEG", 0, 0);
  //   pdf.save("export.pdf");
  // }
}

DocumentFrame.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string
};

export default DocumentFrame;
