param(
  [string]$DocsPath = (Join-Path (Split-Path $PSScriptRoot -Parent) '..\ixia-docs'),
  [switch]$Watch,
  [switch]$Check
)

$ErrorActionPreference = 'Stop'
if ($Watch -and $Check) {
  throw 'Use either -Watch or -Check, not both.'
}

$starter = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (-not (Test-Path (Join-Path $starter 'packages\create-ixia\src\scaffold.ts'))) {
  throw "Not an ixia-starter checkout: $starter"
}

# The docs checkout is optional: without it, only the CLI templates are synced.
$docs = $null
if (Test-Path -LiteralPath (Join-Path $DocsPath 'src\features')) {
  $docs = (Resolve-Path $DocsPath).Path
} else {
  Write-Warning "ixia-docs not found at $DocsPath; syncing CLI templates only."
}

# The starter's src/features/<name> is the source of truth for these features.
# TemplateReadme: the feature README doubles as the CLI template README.
# Other features keep a hand-written template README with setup instructions.
# Docs: whether the ixia-docs checkout uses the feature and so receives a managed copy.
$features = @(
  @{ Name = 'content-page'; TemplateReadme = $true; Docs = $true },
  @{ Name = 'markdown-lite'; TemplateReadme = $false; Docs = $false },
  @{ Name = 'markdown-full'; TemplateReadme = $false; Docs = $true },
  @{ Name = 'highlight'; TemplateReadme = $false; Docs = $true }
)

foreach ($feature in $features) {
  $templateRoot = Join-Path $starter "packages\create-ixia\templates\features\$($feature.Name)"
  $feature.Source = Join-Path $starter "src\features\$($feature.Name)"
  $feature.Template = $templateRoot
  # Dedicated feature directories are fully managed, so obsolete files are removed.
  $feature.Destinations = @(Join-Path $templateRoot "src\features\$($feature.Name)")
  if ($docs -and $feature.Docs) {
    $feature.Destinations += Join-Path $docs "src\features\$($feature.Name)"
  }
}

function Get-SourceState($feature) {
  if (-not (Test-Path -LiteralPath $feature.Source)) {
    throw "Missing starter feature: $($feature.Source)"
  }
  $state = @{}
  foreach ($file in Get-ChildItem -LiteralPath $feature.Source -Recurse -File) {
    $relative = [System.IO.Path]::GetRelativePath($feature.Source, $file.FullName)
    $state[$relative] = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
  }
  if (-not $state.ContainsKey('index.ts')) {
    throw "The $($feature.Name) source is incomplete; refusing to sync."
  }
  return $state
}

function Sync-Feature($feature, $state) {
  $differences = [System.Collections.Generic.List[string]]::new()
  foreach ($destination in $feature.Destinations) {
    foreach ($relative in $state.Keys) {
      $target = Join-Path $destination $relative
      if ((Test-Path -LiteralPath $target) -and
          (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -eq $state[$relative]) {
        continue
      }
      $differences.Add($target)
      if (-not $Check) {
        New-Item -ItemType Directory -Path (Split-Path $target -Parent) -Force | Out-Null
        Copy-Item -LiteralPath (Join-Path $feature.Source $relative) -Destination $target -Force
      }
    }
    if (-not (Test-Path -LiteralPath $destination)) {
      continue
    }
    foreach ($file in Get-ChildItem -LiteralPath $destination -Recurse -File) {
      $relative = [System.IO.Path]::GetRelativePath($destination, $file.FullName)
      if (-not $state.ContainsKey($relative)) {
        $differences.Add($file.FullName)
        if (-not $Check) {
          Remove-Item -LiteralPath $file.FullName
        }
      }
    }
  }

  if ($feature.TemplateReadme) {
    $templateReadme = Join-Path $feature.Template 'README.md'
    if (-not (Test-Path -LiteralPath $templateReadme) -or
        (Get-FileHash -LiteralPath $templateReadme -Algorithm SHA256).Hash -ne $state['README.md']) {
      $differences.Add($templateReadme)
      if (-not $Check) {
        Copy-Item -LiteralPath (Join-Path $feature.Source 'README.md') -Destination $templateReadme -Force
      }
    }
  }
  return $differences
}

function Get-Fingerprint {
  $lines = foreach ($feature in $features) {
    $state = Get-SourceState $feature
    $feature.Name
    foreach ($key in ($state.Keys | Sort-Object)) {
      "$key=$($state[$key])"
    }
  }
  return $lines -join "`n"
}

function Invoke-Sync {
  $differences = [System.Collections.Generic.List[string]]::new()
  foreach ($feature in $features) {
    $state = Get-SourceState $feature
    $differences.AddRange([string[]]@(Sync-Feature $feature $state))
    Write-Host "$($feature.Name): $($state.Count) files in each destination."
  }
  if ($Check -and $differences.Count -gt 0) {
    throw "Feature sync is out of date. Edit src/features in ixia-starter, then run this script:`n$($differences -join "`n")"
  }
}

$previous = ''
do {
  $fingerprint = Get-Fingerprint
  if ($fingerprint -ne $previous) {
    Invoke-Sync
    $previous = $fingerprint
  }
  if ($Watch) {
    Start-Sleep -Milliseconds 500
  }
} while ($Watch)
