
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class BldgView extends React.Component {
  constructor(props) {
    super(props);

    // Next up create a new Unity Content object to 
    // initialise and define your WebGL build. The 
    // paths are relative from your index file.

    this.unityContent = new UnityContent(
      process.env.PUBLIC_URL + "/BldgClient/bldg-client-0.1.1.json",
      process.env.PUBLIC_URL + "/BldgClient/UnityLoader.js"
    );
  }

  render() {

    // Finally render the Unity component and pass 
    // the Unity content through the props.

    return <Unity unityContent={this.unityContent} />;
  }
}