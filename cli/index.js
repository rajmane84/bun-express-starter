#!/usr/bin/env node

import { select, input } from "@inquirer/prompts";
import unzipper from "unzipper";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { execSync } from "child_process";

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

// Copy folder recursively
function copyFolder(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
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

  // Download repo zip
  await downloadZip();

  // Paths
  const templatePath = path.join(
    process.cwd(),
    `temp/${REPO_ROOT_FOLDER}/templates/${template}`
  );

  if (!fs.existsSync(templatePath)) {
    console.error("❌ Template not found:", templatePath);
    process.exit(1);
  }

  const outputPath = path.join(process.cwd(), projectName);

  // Copy template to project
  console.log("📁 Copying project files...");
  copyFolder(templatePath, outputPath);

  // Cleanup temp folder
  fs.rmSync("./temp", { recursive: true, force: true });

  // Install dependencies
  console.log("📦 Installing dependencies...");
  let installedSuccessfully = false;

  try {
    execSync("bun install", { stdio: "inherit", cwd: outputPath });
    installedSuccessfully = true;
  } catch (error) {
    console.warn("\n⚠️ Warning: Could not install dependencies automatically.");
    console.warn(
      "You might not have 'bun' installed globally yet --> use 'npm i -g bun' to install bun globally."
    );
  }

  console.log(`\n🎉 Project created successfully!`);
  console.log(`👉 cd ${projectName}`);

  // Dynamically show the next step based on whether install worked
  if (!installedSuccessfully) {
    console.log(`👉 bun install  <-- Run this first!`);
  }

  console.log(`👉 bun run dev`);
}

createProject();