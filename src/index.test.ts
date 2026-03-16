import { describe, it, expect } from "vitest";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { listSheets, readSheet, readRange } from "./index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const testFilePath = join(__dirname, "__fixtures__", "test.xlsx");

describe("listSheets", () => {
  it("returns all sheet names for a valid Excel file", async () => {
    const result = await listSheets(testFilePath);
    const names = JSON.parse(result.content[0].text);
    expect(names).toEqual(["Users", "Products"]);
  });

  it("throws for a non-existent file", async () => {
    await expect(listSheets("/non/existent/file.xlsx")).rejects.toThrow();
  });
});

describe("readSheet", () => {
  it("reads the first sheet by default", async () => {
    const result = await readSheet(testFilePath);
    const data = JSON.parse(result.content[0].text);
    expect(data).toEqual([
      { Name: "Alice", Age: 30 },
      { Name: "Bob", Age: 25 },
    ]);
    expect(result).not.toHaveProperty("isError");
  });

  it("reads a named sheet", async () => {
    const result = await readSheet(testFilePath, "Products");
    const data = JSON.parse(result.content[0].text);
    expect(data).toEqual([
      { Product: "Apple", Price: 1.5 },
      { Product: "Banana", Price: 0.75 },
    ]);
  });

  it("returns an error when sheet name does not exist", async () => {
    const result = await readSheet(testFilePath, "NonExistent");
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("NonExistent");
    expect(result.content[0].text).toContain("Users");
    expect(result.content[0].text).toContain("Products");
  });

  it("throws for a non-existent file", async () => {
    await expect(readSheet("/non/existent/file.xlsx")).rejects.toThrow();
  });
});

describe("readRange", () => {
  it("reads a range from the default sheet", async () => {
    const result = await readRange(testFilePath, "A1:B2");
    const data = JSON.parse(result.content[0].text);
    expect(data).toEqual([{ Name: "Alice", Age: 30 }]);
    expect(result).not.toHaveProperty("isError");
  });

  it("reads a range from a named sheet", async () => {
    const result = await readRange(testFilePath, "A1:B2", "Products");
    const data = JSON.parse(result.content[0].text);
    expect(data).toEqual([{ Product: "Apple", Price: 1.5 }]);
  });

  it("returns an error when sheet name does not exist", async () => {
    const result = await readRange(testFilePath, "A1:B2", "NonExistent");
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("NonExistent");
  });

  it("throws for a non-existent file", async () => {
    await expect(
      readRange("/non/existent/file.xlsx", "A1:B2")
    ).rejects.toThrow();
  });
});
