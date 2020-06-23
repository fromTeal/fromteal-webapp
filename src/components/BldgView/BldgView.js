
import React, { createRef } from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class BldgView extends React.Component {
  constructor(props) {
    super(props);

    // Next up create a new Unity Content object to 
    // initialise and define your WebGL build. The 
    // paths are relative from your index file.

    this.unityContent = new UnityContent(
      process.env.PUBLIC_URL + "/BldgClient/bldg-client-0.1.2.json",
      process.env.PUBLIC_URL + "/BldgClient/UnityLoader.js"
    );

    this.unityContent.on("loaded", () => {
      this.switchAddress()
    });
  }

  switchAddress() {
    var address = "g"
    var currentUrl = window.location.pathname;
    switch (currentUrl) {
      case "/my_teams/ZieglarNatta":
        address = "g-b(12,56)-l0"
        break
      case "/my_teams/Graphr":
        address = "g-b(81,34)-l0"
        break
      case "/my_teams/Shayr":
        address = "g-b(17,24)-l0"
        break
    }


    // TODO set web_url instead of address
    console.log("JavaScript: switchAddress -> " + address)
    this.unityContent.send(
      "BldgController", 
      "SetAddress", 
      address
    );
  }

  render() {

    // Finally render the Unity component and pass 
    // the Unity content through the props.

    return <Unity unityContent={this.unityContent} />;
  }
}