import { PropsWithChildren } from "react";
import "./Display.css";

export interface BorderedSectionProps {
  title: string;
  required?: boolean;
  className?: string;
}
export function BorderedSection(
  props: PropsWithChildren<BorderedSectionProps>
) {
  return (
    <div className="mainContainer">
      <div className="header">
        <div className="headerBorderBefore"></div>
        {props.title && (
          <div className="headerTitle">
            {props.title && (
              <span className="title">
                {props.title}
                <span className="asterisk">{props.required ? "*" : ""}</span>
              </span>
            )}
          </div>
        )}
        <div className="headerBorderAfter"></div>
      </div>
      <div className={`childrenContainer ${props.className}`}>
        {props.children}
      </div>
    </div>
  );
}
