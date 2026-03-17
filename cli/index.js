#!/usr/bin/env node

import { select, input } from "@inquirer/prompts";
import unzipper from "unzipper";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { execSync } from "child_process";

const USE_LOCAL = false;

const GITHUB_ZIP =
  "https://github.com/rajmane84/bun-express-starter/archive/refs/heads/main.zip";

const REPO_ROOT_FOLDER = "bun-express-starter-main";

// Download GitHub repo ZIP
async function downloadZip() {
  console.log("📦 Downloading template files...");

  const res = await fetch(GITHUB_ZIP);

  if (!res.ok) {
    throw new Error(`Failed to download: ${res.statusText}`);
  }

  // Convert Web Stream to Node Stream for unzipper
  const nodeStream = Readable.fromWeb(res.body);

  return new Promise((resolve, reject) => {
    nodeStream
      .pipe(unzipper.Extract({ path: "./temp" }))
      .on("close", resolve)
      .on("error", reject);
  });
}

// Copy folder (copy contents, not parent folder)
function copyFolder(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    fs.cpSync(srcPath, destPath, {
      recursive: true,
      force: true,
    });
  }
}

async function createProject() {
  const template = await select({
    message: "Choose a template:",
    choices: [
      { name: "Express + MongoDB", value: "express-mongo" },
      { name: "Express + PostgreSQL", value: "express-postgres" },
      { name: "Bun REST API", value: "bun-rest" },
    ],
  });

  const projectName = await input({
    message: "Enter project name:",
    default: "myapp",
  });

  const outputPath = path.join(process.cwd(), projectName);
  console.log("cwd: ", process.cwd());
  console.log("outputPath: ", outputPath);

  // Prevent overwrite
  if (fs.existsSync(outputPath)) {
    console.error("❌ Folder already exists:", outputPath);
    process.exit(1);
  }

  let templatePath;

  if (USE_LOCAL) {
    const LOCAL_REPO_PATH = path.join(process.cwd(), "../bun-express-starter");

    templatePath = path.join(LOCAL_REPO_PATH, "templates", template);
  } else {
    await downloadZip();

    templatePath = path.join(
      process.cwd(),
      `temp/${REPO_ROOT_FOLDER}/templates/${template}`,
    );
  }

  console.log("Template path: ", templatePath);

  if (fs.existsSync(templatePath)) {
    console.log("📄 Files inside:", fs.readdirSync(templatePath));
    console.log("📄 Files inside src:", fs.readdirSync(`${templatePath}/src`));
    console.log(
      "📄 Files inside routes:",
      fs.readdirSync(`${templatePath}/src/routes`),
    );
  }

  if (!fs.existsSync(templatePath)) {
    console.error("❌ Template not found:", templatePath);
    process.exit(1);
  }

  // Copy files
  console.log("📁 Copying project files...");
  copyFolder(templatePath, outputPath);

  // Cleanup
  fs.rmSync("./temp", { recursive: true, force: true });

  // Install dependencies
  console.log("📦 Installing dependencies...");
  let installedSuccessfully = false;

  try {
    execSync("bun install", {
      stdio: "inherit",
      cwd: outputPath,
    });
    installedSuccessfully = true;
  } catch (error) {
    console.warn("\n⚠️ Could not install dependencies automatically.");
    console.warn("👉 Install Bun globally: npm i -g bun");
  }

  console.log(`\n🎉 Project created successfully!`);
  console.log(`👉 cd ${projectName}`);

  if (!installedSuccessfully) {
    console.log(`👉 bun install`);
  }

  console.log(`👉 bun run dev`);
}

createProject();
