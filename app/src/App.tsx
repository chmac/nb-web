import join from "globjoin";
import React, { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import * as git from "./services/git/git.service";
import * as nb from "./services/nb/nb.service";
import { Index } from "./shared.types";

(window as any).join = join;

const getIdMapFromPaths = async (paths: string[]) => {
  if (paths.length === 0) {
    return [];
  }
  const path = join(...paths);
  const index = await nb.getIndex({ path });
  return index;
};

function App() {
  const [paths, setPaths] = useState<string[]>([]);
  const [index, setIndex] = useState<Index>([]);
  const [fileContents, setFileContents] = useState("");
  const [search, setSearch] = useState("");

  const goToPath = useCallback(
    async (pathPiece: string) => {
      setFileContents("");
      setSearch("");
      const newPaths =
        pathPiece === ".." && paths.length > 1
          ? paths.slice(0, -1)
          : pathPiece === "/"
          ? [pathPiece]
          : paths.concat(pathPiece);
      setPaths(newPaths);
      const index = await getIdMapFromPaths(newPaths);
      setIndex(index);
    },
    [setPaths, paths, setFileContents, setSearch]
  );

  const loadFile = useCallback(
    async (name: string) => {
      const path = join(...paths, name);
      const fileContents = await git.readFile({ path });
      setFileContents(fileContents);
    },
    [paths]
  );

  const filteredIndex = useMemo(() => {
    if (search.length === 0) {
      return index;
    }

    return index.filter(([id, name]) => {
      if (id.toString().indexOf(search) !== -1) {
        return true;
      }
      if (name.indexOf(search) !== -1) {
        return true;
      }
      return false;
    });
  }, [index, search]);

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
        <blockquote style={{ padding: "1rem 2rem", border: "1px black solid" }}>
          <h2>Currently selected note:</h2>
          <ReactMarkdown children={fileContents} />
        </blockquote>
      )}
      <div>
        <h2>Navigation</h2>
        <p>
          Search:{" "}
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
            }}
          />{" "}
          ({index.length} items, {filteredIndex.length} matches)
        </p>
        {paths.length === 0 ? null : (
          <p>
            <button onClick={() => goToPath("..")}>../</button>
          </p>
        )}
        {filteredIndex.map(([id, name]) => (
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
