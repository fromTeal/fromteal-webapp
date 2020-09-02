
import React, { createRef } from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class BldgView extends React.Component {
  constructor(props) {
    super(props);

    // Next up create a new Unity Content object to 
    // initialise and define your WebGL build. The 
    // paths are relative from your index file.

    this.unityContent = new UnityContent(
      process.env.PUBLIC_URL + "/BldgClient/bldg-client-0.1.8.json",
      process.env.PUBLIC_URL + "/BldgClient/UnityLoader.js"
    );

    this.unityContent.on("loaded", () => {
      this.switchAddress()
    });
  }

  switchAddress() {
    var address = window.location.href.replace(window.location.protocol + "//", "");
    // TODO set web_url instead of address
    console.log("JavaScript: switchAddress -> " + address)
    this.unityContent.send(
      "BldgController", 
      "EnterBuilding", 
      address
    );
  }

  render() {

    // Finally render the Unity component and pass 
    // the Unity content through the props.

    return <Unity unityContent={this.unityContent} />;
  }
}