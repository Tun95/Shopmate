import React from "react";
import "./widgetSm.css";
import pp2 from "../../images/pp2.png";
import { Visibility } from "@material-ui/icons";

function WidgetSm() {
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        <li className="widgetSmListItem">
          <img src={pp2} alt="" className="widgetSmImg" />
          <div className="widgetSmUser">
            <span className="widgetSmUsername">Tunji Akande</span>
            <span className="widgetSmUserTitle">Software Engineer</span>
          </div>
          <button className="widgetSmButton">
            <Visibility className="widgetSmIcon" />
            Display
          </button>
        </li>
        <li className="widgetSmListItem">
          <img src={pp2} alt="" className="widgetSmImg" />
          <div className="widgetSmUser">
            <span className="widgetSmUsername">Tunji Akande</span>
            <span className="widgetSmUserTitle">Software Engineer</span>
          </div>
          <button className="widgetSmButton">
            <Visibility className="widgetSmIcon" />
            Display
          </button>
        </li>
        <li className="widgetSmListItem">
          <img src={pp2} alt="" className="widgetSmImg" />
          <div className="widgetSmUser">
            <span className="widgetSmUsername">Tunji Akande</span>
            <span className="widgetSmUserTitle">Software Engineer</span>
          </div>
          <button className="widgetSmButton">
            <Visibility className="widgetSmIcon" />
            Display
          </button>
        </li>
        <li className="widgetSmListItem">
          <img src={pp2} alt="" className="widgetSmImg" />
          <div className="widgetSmUser">
            <span className="widgetSmUsername">Tunji Akande</span>
            <span className="widgetSmUserTitle">Software Engineer</span>
          </div>
          <button className="widgetSmButton">
            <Visibility className="widgetSmIcon" />
            Display
          </button>
        </li>
        <li className="widgetSmListItem">
          <img src={pp2} alt="" className="widgetSmImg" />
          <div className="widgetSmUser">
            <span className="widgetSmUsername">Tunji Akande</span>
            <span className="widgetSmUserTitle">Software Engineer</span>
          </div>
          <button className="widgetSmButton">
            <Visibility className="widgetSmIcon" />
            Display
          </button>
        </li>
      </ul>
    </div>
  );
}

export default WidgetSm;
