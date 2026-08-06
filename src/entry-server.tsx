import { renderToString } from "react-dom/server";
import Home from "../app/page";

export function render(): string {
  return renderToString(<Home />);
}

