#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as XLSX from "xlsx";
import { z } from "zod";
import { resolve } from "path";

const server = new McpServer({
  name: "cellra",
  version: "0.1.0",
});

export async function listSheets(filePath: string) {
  const absPath = resolve(filePath);
  const workbook = XLSX.readFile(absPath);
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(workbook.SheetNames, null, 2),
      },
    ],
  };
}

server.registerTool(
  "list_sheets",
  {
    description: "List all sheet names in an Excel file",
    inputSchema: {
      filePath: z.string().describe("Absolute path to the Excel file"),
    },
  },
  async ({ filePath }) => listSheets(filePath)
);

export async function readSheet(filePath: string, sheetName?: string) {
  const absPath = resolve(filePath);
  const workbook = XLSX.readFile(absPath);

  const targetSheet = sheetName ?? workbook.SheetNames[0];
  if (!targetSheet || !workbook.Sheets[targetSheet]) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Sheet "${targetSheet}" not found. Available sheets: ${workbook.SheetNames.join(", ")}`,
        },
      ],
      isError: true,
    };
  }

  const data = XLSX.utils.sheet_to_json(workbook.Sheets[targetSheet]);
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

server.registerTool(
  "read_sheet",
  {
    description:
      "Read data from an Excel sheet and return as JSON array (first row as headers)",
    inputSchema: {
      filePath: z.string().describe("Absolute path to the Excel file"),
      sheetName: z
        .string()
        .optional()
        .describe("Sheet name to read. Defaults to the first sheet"),
    },
  },
  async ({ filePath, sheetName }) => readSheet(filePath, sheetName)
);

export async function readRange(
  filePath: string,
  range: string,
  sheetName?: string
) {
  const absPath = resolve(filePath);
  const workbook = XLSX.readFile(absPath);

  const targetSheet = sheetName ?? workbook.SheetNames[0];
  if (!targetSheet || !workbook.Sheets[targetSheet]) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Sheet "${targetSheet}" not found. Available sheets: ${workbook.SheetNames.join(", ")}`,
        },
      ],
      isError: true,
    };
  }

  const data = XLSX.utils.sheet_to_json(workbook.Sheets[targetSheet], {
    range,
  });
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

server.registerTool(
  "read_range",
  {
    description:
      "Read data from a specific cell range in an Excel sheet and return as JSON array (first row of range as headers)",
    inputSchema: {
      filePath: z.string().describe("Absolute path to the Excel file"),
      range: z
        .string()
        .describe('Cell range to read (e.g., "A1:C10", "B2:D5")'),
      sheetName: z
        .string()
        .optional()
        .describe("Sheet name to read. Defaults to the first sheet"),
    },
  },
  async ({ filePath, range, sheetName }) => readRange(filePath, range, sheetName)
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("cellra MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
