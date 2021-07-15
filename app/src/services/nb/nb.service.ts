import { IDMap } from "../../shared.types";

export const parseIndexContents = ({ contents }: { contents: string }) => {
  const lines = contents.split("\n");
  // TODO Write a test to ensure that line numbers start 1 and not 0
  const idEntries = lines.map((itemName, index) => [index + 1, itemName]);
  const idMap: IDMap = Object.fromEntries(idEntries);
  return idMap;
};
