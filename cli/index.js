#!/usr/bin/env node

import inquirer from "inquirer";
import https from "https";
import unzipper from "unzipper";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const GITHUB_ZIP = "https://github.com/rajmane84/bun-express-starter/archive/refs/heads/main.zip";
const REPO_ROOT_FOLDER = "bun-express-starter-main";

// Download GitHub repo ZIP
async function downloadZip() {
  return new Promise((resolve, reject) => {
    console.log("📦 Downloading template files...");
    https.get(GITHUB_ZIP, (res) => {
      res
        .pipe(unzipper.Extract({ path: "./temp" }))
        .on("close", resolve)
        .on("error", reject);
    });
  });
}

// Copy folder recursively
function copyFolder(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

async function createProject() {
  // INTERACTIVE MENU
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Choose a template:",
      choices: [
        { name: "Express + MongoDB", value: "express-mongo" },
        { name: "Express + PostgreSQL", value: "express-postgres" },
        { name: "Bun REST API", value: "bun-rest" },
      ],
    },
    {
      type: "input",
      name: "projectName",
      message: "Enter project name:",
      default: "myapp",
    },
  ]);

  const { template, projectName } = answers;

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
  execSync("bun install", { stdio: "inherit", cwd: outputPath });

  console.log(`\n🎉 Project created successfully!`);
  console.log(`👉 cd ${projectName}`);
  console.log(`👉 bun run dev`);
}

createProject();