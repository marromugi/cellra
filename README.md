# cellra

An MCP server for reading Excel files. Use it with Claude Desktop or any MCP client to access Excel data.

## Tools

| Tool | Description |
| --- | --- |
| `list_sheets` | List all sheet names in an Excel file |
| `read_sheet` | Read sheet data as a JSON array (first row as headers) |

## Installation

```bash
npm install -g cellra
```

## Usage

### Claude Code

```bash
claude mcp add cellra -- npx -y cellra
```

### Claude Desktop

Add the following to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "cellra": {
      "command": "npx",
      "args": ["-y", "cellra"]
    }
  }
}
```

## License

MIT
