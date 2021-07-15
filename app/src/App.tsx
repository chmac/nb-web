import React, { useState } from "react";

import * as git from "./services/git/git.service";

function App() {
  const [path, setPath] = useState("/");
  const [ls, setLs] = useState("");

  return (
    <div>
      <p>Path: {path}</p>
      <p>
        <button
          onClick={async () => {
            await git.clone();
            alert("Cloned successfully #6Z3R6m");
          }}
        >
          Clone
        </button>
      </p>
      <p>
        <button
          onClick={async () => {
            const idMap = await git.ls({ path });
            setLs(JSON.stringify(idMap));
          }}
        >
          ls
        </button>
        <br />
        {ls}
      </p>
    </div>
  );
}

export default App;
