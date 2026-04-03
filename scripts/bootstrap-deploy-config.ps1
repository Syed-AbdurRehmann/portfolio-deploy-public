param(
  [string]$CredentialsPath = "C:\Users\SYED\CREDENTIALS.md",
  [string]$OutputPath = (Join-Path $PSScriptRoot "..\secrets.local.json"),
  [switch]$Force
)

$ErrorActionPreference = "Stop"

function Get-RegexValue {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Text,

    [Parameter(Mandatory = $true)]
    [string]$Pattern
  )

  $match = [regex]::Match($Text, $Pattern)
  if ($match.Success) {
    return $match.Groups[1].Value
  }

  return ""
}

function Get-Section {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Text,

    [Parameter(Mandatory = $true)]
    [string]$HeadingRegex
  )

  $match = [regex]::Match($Text, "$HeadingRegex(?s)(.*?)(?:\r?\n---|\r?\n##|\z)")
  if ($match.Success) {
    return $match.Groups[1].Value
  }

  return ""
}

if (-not (Test-Path $CredentialsPath)) {
  throw "Credentials file not found at $CredentialsPath"
}

if ((Test-Path $OutputPath) -and -not $Force) {
  throw "Output file already exists at $OutputPath. Use -Force to overwrite."
}

$raw = Get-Content -Raw -Path $CredentialsPath

$cloudflareSection = Get-Section -Text $raw -HeadingRegex "###\s+☁️\s+Cloudflare"
$coolifySection = Get-Section -Text $raw -HeadingRegex "###\s+🚀\s+Coolify"

$githubPat = Get-RegexValue -Text $raw -Pattern 'GitHub Personal Access Token\*\*\s*\|\s*`([^`]+)`'
$coolifyUrl = Get-RegexValue -Text $coolifySection -Pattern 'URL\*\*:\s*`([^`]+)`'
$cloudflareToken = Get-RegexValue -Text $cloudflareSection -Pattern 'API Token\*\*:\s*`([^`]+)`'
$cloudflareAccountId = Get-RegexValue -Text $cloudflareSection -Pattern 'Account ID\*\*:\s*`([^`]+)`'

$config = [ordered]@{
  github = [ordered]@{
    pat   = $githubPat
    owner = "SyedRehman-ai"
  }
  coolify = [ordered]@{
    url        = $coolifyUrl
    apiToken   = ""
    projectUuid = ""
    serverUuid  = ""
  }
  cloudflare = [ordered]@{
    apiToken  = $cloudflareToken
    zoneId    = ""
    tunnelId  = ""
    accountId = $cloudflareAccountId
  }
  defaults = [ordered]@{
    baseDomain    = "aniweb.online"
    repoVisibility = "private"
    buildPack     = "nixpacks"
    port          = "3000"
    branch        = "main"
  }
}

$config | ConvertTo-Json -Depth 10 | Set-Content -Path $OutputPath -NoNewline

$maskedPat = if ($githubPat.Length -gt 8) { "$($githubPat.Substring(0, 4))***$($githubPat.Substring($githubPat.Length - 4))" } else { "(missing)" }
$maskedCfToken = if ($cloudflareToken.Length -gt 8) { "$($cloudflareToken.Substring(0, 4))***$($cloudflareToken.Substring($cloudflareToken.Length - 4))" } else { "(missing)" }

Write-Host "[bootstrap] wrote deploy config: $OutputPath"
Write-Host "[bootstrap] github pat: $maskedPat"
Write-Host "[bootstrap] cloudflare token: $maskedCfToken"
Write-Host "[bootstrap] coolify api token: (not found in credentials file, set manually)"
