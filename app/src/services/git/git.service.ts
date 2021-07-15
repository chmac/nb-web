import LightningFS from "@isomorphic-git/lightning-fs";
import join from "globjoin";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import { FS } from "../../shared.types";
import { parseIndexContents } from "../nb/nb.service";

const fs: FS = new LightningFS("fs");

const URL_KEY = "__nbw_url" as const;

const dir = "/repo";
const url = window.localStorage.getItem(URL_KEY);

if (url === null || url === "") {
  const newUrl = window.prompt("Please enter a git URL. #VN0f5G");
  if (newUrl === null || newUrl === "") {
    window.alert("Sorry, this didn't work. Please try again.");
    window.location.reload();
    throw new Error("Aborted #uKmsO1");
  }
  window.localStorage.setItem(URL_KEY, newUrl);
  window.location.reload();
  throw new Error("Aborted #462OVE");
}

export const clone = async () => {
  await git.clone({
    fs,
    http,
    dir,
    url,
    depth: 10,
    singleBranch: true,
  });
};

export const pull = async () => {
  await git.pull({
    fs,
    http,
    dir,
    url,
    fastForwardOnly: true,
    author: {
      name: "nb-web",
    },
  });
};

export const ls = async ({ path = "/" }: { path?: string } = {}) => {
  const indexContents = await fs.promises.readFile(join(dir, path, ".index"), {
    encoding: "utf8",
  });

  const idMap = parseIndexContents({ contents: indexContents });

  return idMap;
};

export const readFile = async ({ path }: { path: string }) => {
  const filePath = join(dir, path);
  const fileContents = await fs.promises.readFile(filePath, {
    encoding: "utf8",
  });
  return fileContents;
};
