$exclude = @(
    "node_modules",
    "dist",
    "build",
    ".git",
    ".vscode",
    ".DS_Store",
    "*.log",
    "*.env"
)

$destination = "react-project.zip"

# Remove existing zip if exists
if (Test-Path $destination) { 
    Remove-Item $destination 
}

# Get all items except excluded ones
$items = Get-ChildItem -Recurse | Where-Object {
    $path = $_.FullName
    foreach ($ex in $exclude) {
        if ($path -like "*$ex*") { return $false }
    }
    return $true
}

# Zip them
$items | Compress-Archive -DestinationPath $destination

Write-Host "Project zipped → $destination"
