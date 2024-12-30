import React from "react";
// import  RiveComponent  from "@rive-app/react-canvas";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";


export default function MyAnimation() {

    const { RiveComponent } = useRive({
        src: "/animations/data_analysis_cart_animation.riv",
        stateMachines: "Motion",
        layout: new Layout({
          fit: Fit.FitWidth, // Change to: rive.Fit.Contain, or Cover
          alignment: Alignment.Center,
        }),
        autoplay: true,
      });
    
      return <RiveComponent />;
    };


