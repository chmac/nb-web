import join from "globjoin";
import { fs, dir } from "../../shared.constants";
import { Index } from "../../shared.types";

export const parseIndexContents = ({ contents }: { contents: string }) => {
  const lines = contents.split("\n");
  // TODO Write a test to ensure that line numbers start 1 and not 0
  const idEntries = lines.map((itemName, index): [number, string] => [
    index + 1,
    itemName,
  ]);
  // TODO Write a test to ensure that empty lines are stripped
  const idEntriesCleaned = idEntries.filter(([id, name]) => name !== "");
  return idEntriesCleaned;
};

export const getIndex = async ({
  path = "/",
}: { path?: string } = {}): Promise<Index> => {
  const indexContents = await fs.promises.readFile(join(dir, path, ".index"), {
    encoding: "utf8",
  });

  const index = parseIndexContents({ contents: indexContents });

  return index;
};
