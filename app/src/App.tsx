import join from "globjoin";
import React, { useCallback, useState } from "react";
import * as git from "./services/git/git.service";
import { IDMap } from "./shared.types";

(window as any).join = join;

const getIdMapFromPaths = async (paths: string[]) => {
  if (paths.length === 0) {
    return {};
  }
  const path = join(...paths);
  const idMap = await git.ls({ path });
  return idMap;
};

function App() {
  const [paths, setPaths] = useState<string[]>([]);
  const [idMap, setIdMap] = useState<IDMap>({});
  const [fileContents, setFileContents] = useState("");

  const goToPath = useCallback(
    async (pathPiece: string) => {
      setFileContents("");
      const newPaths =
        pathPiece === ".." && paths.length > 1
          ? paths.slice(0, -1)
          : pathPiece === "/"
          ? [pathPiece]
          : paths.concat(pathPiece);
      setPaths(newPaths);
      const idMap = await getIdMapFromPaths(newPaths);
      setIdMap(idMap);
    },
    [setPaths, paths, setFileContents]
  );

  const loadFile = useCallback(
    async (name: string) => {
      const path = join(...paths, name);
      const fileContents = await git.readFile({ path });
      setFileContents(fileContents);
    },
    [paths]
  );

  const path = join(...paths);

  return (
    <div>
      <p>Current path: {path}</p>
      <p>
        <button
          onClick={async () => {
            try {
              await git.clone();
              alert("Cloned successfully #6Z3R6m");
            } catch (error) {
              alert(`Clone failed #f6AL6q\n${error.message}`);
            }
          }}
        >
          Clone
        </button>
        {" - "}
        <button
          onClick={async () => {
            try {
              await git.pull();
              alert("Pulled successfully #SKoEv8");
            } catch (error) {
              alert(`Pull failed #R740Qp\n${error.message}`);
            }
          }}
        >
          Pull
        </button>
        {" - "}
        <button
          onClick={async () => {
            goToPath("/");
          }}
        >
          Load notebook
        </button>
      </p>
      {fileContents === "" ? null : (
        <blockquote>
          <h2>Currently selected note:</h2>
          <pre>{fileContents}</pre>
        </blockquote>
      )}
      <div>
        <h2>Navigation</h2>
        {paths.length === 0 ? null : (
          <p>
            <button onClick={() => goToPath("..")}>../</button>
          </p>
        )}
        {Object.entries(idMap).map(([id, name]) => (
          <p key={id}>
            <button
              onClick={async () => {
                if (name.substr(-3) !== ".md") {
                  goToPath(name);
                } else {
                  loadFile(name);
                }
              }}
            >
              [{id}] {name}
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
