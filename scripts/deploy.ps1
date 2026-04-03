param(
  [string]$AppName = "portfolio",
  [string]$Subdomain = "portfolio",
  [string]$BaseDomain = "aniweb.online",
  [string]$Branch = "main",
  [string]$BuildPack = "dockerfile",
  [string]$Port = "3000",
  [string]$RepoUrl,
  [string]$ProjectUuid,
  [string]$ServerUuid,
  [string]$CoolifyUrl,
  [string]$CoolifyApiToken,
  [string]$ConfigPath,
  [switch]$AutoApprove,
  [switch]$SkipPush,
  [switch]$SkipDns,
  [switch]$SkipCoolify
)

$ErrorActionPreference = "Stop"

function Get-NestedConfigValue {
  param(
    [pscustomobject]$Config,
    [string[]]$Path
  )

  if ($null -eq $Config) {
    return $null
  }

  $current = $Config
  foreach ($segment in $Path) {
    if ($null -eq $current) {
      return $null
    }

    $property = $current.PSObject.Properties[$segment]
    if ($null -eq $property) {
      return $null
    }

    $current = $property.Value
  }

  return $current
}

function Get-FirstNonEmpty {
  param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Candidates
  )

  foreach ($candidate in $Candidates) {
    if (-not [string]::IsNullOrWhiteSpace($candidate)) {
      return $candidate
    }
  }

  return $null
}

function Confirm-Checkpoint {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Message,

    [switch]$Bypass
  )

  if ($Bypass) {
    Write-Host "[checkpoint] auto-approved: $Message"
    return $true
  }

  $reply = Read-Host "[checkpoint] $Message (yes/no)"
  return $reply -eq "yes"
}

function Sanitize-RepoUrl {
  param([string]$Url)

  if ([string]::IsNullOrWhiteSpace($Url)) {
    return $Url
  }

  return ($Url -replace "https://[^@]+@github.com/", "https://github.com/")
}

function Invoke-CoolifyApi {
  param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("GET", "POST", "PUT", "DELETE")]
    [string]$Method,

    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$BaseUrl,

    [Parameter(Mandatory = $true)]
    [string]$Token,

    [object]$Body
  )

  $trimmedBase = $BaseUrl.TrimEnd("/")
  $uri = "$trimmedBase$Path"
  $headers = @{
    "Authorization" = "Bearer $Token"
    "Accept"        = "application/json"
  }

  if ($null -ne $Body) {
    $headers["Content-Type"] = "application/json"
    return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body ($Body | ConvertTo-Json -Depth 20)
  }

  return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers
}

function Wait-ForDeployment {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ApplicationUuid,

    [Parameter(Mandatory = $true)]
    [string]$BaseUrl,

    [Parameter(Mandatory = $true)]
    [string]$Token,

    [int]$TimeoutSeconds = 1200,

    [int]$IntervalSeconds = 15
  )

  $start = Get-Date
  while ($true) {
    Start-Sleep -Seconds $IntervalSeconds

    $deployments = Invoke-CoolifyApi -Method "GET" -Path "/api/v1/deployments?application_uuid=$ApplicationUuid" -BaseUrl $BaseUrl -Token $Token
    if ($null -eq $deployments) {
      continue
    }

    $latest = $deployments | Select-Object -First 1
    if ($null -eq $latest) {
      continue
    }

    $status = [string]$latest.status
    Write-Host "[coolify] deployment status: $status"

    if ($status -in @("finished", "success", "succeeded", "completed")) {
      return $latest
    }

    if ($status -in @("failed", "error", "cancelled")) {
      throw "Deployment failed with status '$status'."
    }

    $elapsed = (New-TimeSpan -Start $start -End (Get-Date)).TotalSeconds
    if ($elapsed -ge $TimeoutSeconds) {
      throw "Timed out waiting for deployment completion."
    }
  }
}

$configFile = $null
if (-not [string]::IsNullOrWhiteSpace($ConfigPath)) {
  $configFile = $ConfigPath
}
elseif (-not [string]::IsNullOrWhiteSpace($env:ANIWEB_DEPLOY_CONFIG)) {
  $configFile = $env:ANIWEB_DEPLOY_CONFIG
}
else {
  $defaultConfig = Join-Path $PSScriptRoot "..\secrets.local.json"
  if (Test-Path $defaultConfig) {
    $configFile = $defaultConfig
  }
}

$config = $null
if (-not [string]::IsNullOrWhiteSpace($configFile)) {
  if (-not (Test-Path $configFile)) {
    throw "Config file not found at $configFile"
  }

  $config = Get-Content -Raw -Path $configFile | ConvertFrom-Json
}

$resolvedRepoUrl = Get-FirstNonEmpty $RepoUrl
if ([string]::IsNullOrWhiteSpace($resolvedRepoUrl)) {
  $resolvedRepoUrl = (& git remote get-url origin).Trim()
}

if ([string]::IsNullOrWhiteSpace($resolvedRepoUrl)) {
  throw "Unable to determine git repository URL."
}

$resolvedCoolifyUrl = Get-FirstNonEmpty $CoolifyUrl (Get-NestedConfigValue -Config $config -Path @("coolify", "url")) $env:COOLIFY_URL
$resolvedCoolifyToken = Get-FirstNonEmpty $CoolifyApiToken (Get-NestedConfigValue -Config $config -Path @("coolify", "apiToken")) $env:COOLIFY_API_TOKEN
$resolvedProjectUuid = Get-FirstNonEmpty $ProjectUuid (Get-NestedConfigValue -Config $config -Path @("coolify", "projectUuid")) $env:COOLIFY_PROJECT_UUID
$resolvedServerUuid = Get-FirstNonEmpty $ServerUuid (Get-NestedConfigValue -Config $config -Path @("coolify", "serverUuid")) $env:COOLIFY_SERVER_UUID

$resolvedCfToken = Get-FirstNonEmpty (Get-NestedConfigValue -Config $config -Path @("cloudflare", "apiToken")) $env:CLOUDFLARE_API_TOKEN
$resolvedCfZoneId = Get-FirstNonEmpty (Get-NestedConfigValue -Config $config -Path @("cloudflare", "zoneId")) $env:CLOUDFLARE_ZONE_ID
$resolvedCfTunnelId = Get-FirstNonEmpty (Get-NestedConfigValue -Config $config -Path @("cloudflare", "tunnelId")) $env:CLOUDFLARE_TUNNEL_ID
$resolvedCfAccountId = Get-FirstNonEmpty (Get-NestedConfigValue -Config $config -Path @("cloudflare", "accountId")) $env:CLOUDFLARE_ACCOUNT_ID

if ($Subdomain -like "*.$BaseDomain") {
  $fqdn = $Subdomain
}
else {
  $fqdn = "$Subdomain.$BaseDomain"
}

Write-Host "[deploy] app: $AppName"
Write-Host "[deploy] domain: $fqdn"
Write-Host "[deploy] repo: $(Sanitize-RepoUrl -Url $resolvedRepoUrl)"
Write-Host "[deploy] branch: $Branch"

if (-not $SkipPush) {
  if (-not (Confirm-Checkpoint -Message "Push branch '$Branch' to origin" -Bypass:$AutoApprove)) {
    throw "Deployment aborted before git push."
  }

  & git push origin $Branch
}

if (-not $SkipDns) {
  if (-not (Confirm-Checkpoint -Message "Upsert Cloudflare DNS for $fqdn" -Bypass:$AutoApprove)) {
    throw "Deployment aborted before DNS write."
  }

  $dnsScript = Join-Path $PSScriptRoot "add-subdomain.ps1"
  $dnsOutput = & $dnsScript -Subdomain $Subdomain -BaseDomain $BaseDomain -ApiToken $resolvedCfToken -ZoneId $resolvedCfZoneId -TunnelId $resolvedCfTunnelId -AccountId $resolvedCfAccountId -Proxied
  Write-Host "[dns] $dnsOutput"
}

if ($SkipCoolify) {
  Write-Host "[deploy] Coolify step skipped by flag."
  exit 0
}

if ([string]::IsNullOrWhiteSpace($resolvedCoolifyUrl) -or [string]::IsNullOrWhiteSpace($resolvedCoolifyToken)) {
  throw "Missing Coolify API credentials. Provide COOLIFY_URL and COOLIFY_API_TOKEN (or config)."
}

$projects = Invoke-CoolifyApi -Method "GET" -Path "/api/v1/projects" -BaseUrl $resolvedCoolifyUrl -Token $resolvedCoolifyToken
$servers = Invoke-CoolifyApi -Method "GET" -Path "/api/v1/servers" -BaseUrl $resolvedCoolifyUrl -Token $resolvedCoolifyToken

if ([string]::IsNullOrWhiteSpace($resolvedProjectUuid)) {
  $resolvedProjectUuid = ($projects | Select-Object -First 1).uuid
}
if ([string]::IsNullOrWhiteSpace($resolvedServerUuid)) {
  $resolvedServerUuid = ($servers | Select-Object -First 1).uuid
}

if ([string]::IsNullOrWhiteSpace($resolvedProjectUuid) -or [string]::IsNullOrWhiteSpace($resolvedServerUuid)) {
  throw "Unable to resolve Coolify project/server UUID."
}

Write-Host "[coolify] project: $resolvedProjectUuid"
Write-Host "[coolify] server: $resolvedServerUuid"

$application = $null
try {
  $applications = Invoke-CoolifyApi -Method "GET" -Path "/api/v1/applications" -BaseUrl $resolvedCoolifyUrl -Token $resolvedCoolifyToken
  $application = $applications | Where-Object { $_.name -eq $AppName } | Select-Object -First 1
}
catch {
  Write-Host "[coolify] application listing not available; proceeding with create attempt."
}

if ($null -eq $application) {
  if (-not (Confirm-Checkpoint -Message "Create Coolify application '$AppName' and trigger production deployment" -Bypass:$AutoApprove)) {
    throw "Deployment aborted before Coolify create/deploy."
  }

  $createPayload = @{
    project_uuid    = $resolvedProjectUuid
    server_uuid     = $resolvedServerUuid
    environment_name = "production"
    name            = $AppName
    git_repository  = (Sanitize-RepoUrl -Url $resolvedRepoUrl)
    git_branch      = $Branch
    build_pack      = $BuildPack
    ports_exposes   = $Port
    base_directory  = "/"
  }

  if ($BuildPack -eq "dockerfile") {
    $createPayload["dockerfile_location"] = "/Dockerfile"
  }

  $application = Invoke-CoolifyApi -Method "POST" -Path "/api/v1/applications/public" -BaseUrl $resolvedCoolifyUrl -Token $resolvedCoolifyToken -Body $createPayload
}

if ($null -eq $application) {
  throw "Failed to create or resolve Coolify application."
}

$appUuid = [string](Get-FirstNonEmpty $application.uuid $application.application_uuid)
if ([string]::IsNullOrWhiteSpace($appUuid)) {
  throw "Could not determine application UUID from Coolify response."
}

if (-not (Confirm-Checkpoint -Message "Trigger deployment for application UUID $appUuid" -Bypass:$AutoApprove)) {
  throw "Deployment aborted before start trigger."
}

Invoke-CoolifyApi -Method "GET" -Path "/api/v1/applications/$appUuid/start" -BaseUrl $resolvedCoolifyUrl -Token $resolvedCoolifyToken | Out-Null
Write-Host "[coolify] deployment started for $appUuid"

$deployment = Wait-ForDeployment -ApplicationUuid $appUuid -BaseUrl $resolvedCoolifyUrl -Token $resolvedCoolifyToken
Write-Host "[coolify] deployment finished: $($deployment.uuid)"

$rootUrl = "https://$fqdn"
$healthUrl = "$rootUrl/api/health"

try {
  $rootStatus = (Invoke-WebRequest -UseBasicParsing -Uri $rootUrl -Method GET -TimeoutSec 20).StatusCode
  Write-Host "[verify] root status: $rootStatus"
}
catch {
  Write-Host "[verify] root check failed: $($_.Exception.Message)"
}

try {
  $healthResponse = Invoke-RestMethod -Uri $healthUrl -Method GET -TimeoutSec 20
  Write-Host "[verify] health response: $($healthResponse | ConvertTo-Json -Compress)"
}
catch {
  Write-Host "[verify] health check failed: $($_.Exception.Message)"
}

Write-Host "[done] deployment workflow completed."
