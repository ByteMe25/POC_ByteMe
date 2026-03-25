import { ReactElement } from "react";

export interface IWidgetState {
  render(): ReactElement | null;
}