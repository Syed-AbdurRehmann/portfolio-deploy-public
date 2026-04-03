param(
  [Parameter(Mandatory = $true)]
  [string]$Subdomain,

  [string]$BaseDomain = "aniweb.online",
  [string]$Target,
  [string]$ZoneId,
  [string]$TunnelId,
  [string]$AccountId,
  [string]$ApiToken,
  [switch]$Proxied,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Get-ConfigValue {
  param(
    [string]$Value,
    [string]$Fallback
  )

  if (![string]::IsNullOrWhiteSpace($Value)) {
    return $Value
  }

  return $Fallback
}

function Invoke-CloudflareApi {
  param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("GET", "POST", "PUT", "DELETE")]
    [string]$Method,

    [Parameter(Mandatory = $true)]
    [string]$Path,

    [object]$Body,

    [Parameter(Mandatory = $true)]
    [string]$Token
  )

  $headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type"  = "application/json"
  }

  $uri = "https://api.cloudflare.com/client/v4$Path"

  if ($null -ne $Body) {
    $response = Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body ($Body | ConvertTo-Json -Depth 20)
  }
  else {
    $response = Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers
  }

  if (-not $response.success) {
    $errors = ($response.errors | ConvertTo-Json -Compress)
    throw "Cloudflare API call failed: $Method $Path :: $errors"
  }

  return $response.result
}

$token = Get-ConfigValue -Value $ApiToken -Fallback $env:CLOUDFLARE_API_TOKEN
if ([string]::IsNullOrWhiteSpace($token)) {
  throw "Missing Cloudflare API token. Set -ApiToken or CLOUDFLARE_API_TOKEN."
}

$resolvedAccountId = Get-ConfigValue -Value $AccountId -Fallback $env:CLOUDFLARE_ACCOUNT_ID
$resolvedZoneId = $ZoneId
$resolvedTunnelId = $TunnelId

if ($Subdomain -like "*.$BaseDomain") {
  $fqdn = $Subdomain
}
else {
  $fqdn = "$Subdomain.$BaseDomain"
}

if ([string]::IsNullOrWhiteSpace($resolvedZoneId)) {
  $escapedDomain = [uri]::EscapeDataString($BaseDomain)
  $zones = Invoke-CloudflareApi -Method "GET" -Path "/zones?name=$escapedDomain&status=active" -Token $token
  if ($zones.Count -eq 0) {
    throw "No active Cloudflare zone found for $BaseDomain."
  }
  $resolvedZoneId = $zones[0].id
}

if ([string]::IsNullOrWhiteSpace($Target)) {
  if ([string]::IsNullOrWhiteSpace($resolvedTunnelId)) {
    if ([string]::IsNullOrWhiteSpace($resolvedAccountId)) {
      throw "Missing tunnel target. Provide -Target, -TunnelId, or CLOUDFLARE_ACCOUNT_ID for tunnel discovery."
    }

    $tunnels = Invoke-CloudflareApi -Method "GET" -Path "/accounts/$resolvedAccountId/cfd_tunnel" -Token $token
    if ($tunnels.Count -eq 0) {
      throw "No Cloudflare tunnels found in account $resolvedAccountId. Provide -TunnelId explicitly."
    }

    $activeTunnel = $tunnels | Where-Object { $_.status -eq "healthy" -or $_.status -eq "active" } | Select-Object -First 1
    if ($null -eq $activeTunnel) {
      $activeTunnel = $tunnels | Select-Object -First 1
    }

    $resolvedTunnelId = $activeTunnel.id
  }

  $resolvedTarget = "$resolvedTunnelId.cfargotunnel.com"
}
else {
  $resolvedTarget = $Target
}

$proxiedValue = $Proxied.IsPresent
if (-not $PSBoundParameters.ContainsKey("Proxied")) {
  $proxiedValue = $true
}

$escapedFqdn = [uri]::EscapeDataString($fqdn)
$records = Invoke-CloudflareApi -Method "GET" -Path "/zones/$resolvedZoneId/dns_records?type=CNAME&name=$escapedFqdn" -Token $token
$current = $records | Select-Object -First 1

$summary = [ordered]@{
  fqdn      = $fqdn
  zoneId    = $resolvedZoneId
  target    = $resolvedTarget
  proxied   = $proxiedValue
  action    = "none"
  recordId  = $null
  dryRun    = [bool]$DryRun
}

if ($null -ne $current) {
  $summary.recordId = $current.id

  if ($current.content -eq $resolvedTarget -and [bool]$current.proxied -eq $proxiedValue) {
    $summary.action = "noop"
    $summary | ConvertTo-Json -Depth 5
    exit 0
  }

  $summary.action = "update"

  if (-not $DryRun) {
    $updated = Invoke-CloudflareApi -Method "PUT" -Path "/zones/$resolvedZoneId/dns_records/$($current.id)" -Token $token -Body @{
      type    = "CNAME"
      name    = $fqdn
      content = $resolvedTarget
      proxied = $proxiedValue
      ttl     = 1
    }

    $summary.recordId = $updated.id
  }

  $summary | ConvertTo-Json -Depth 5
  exit 0
}

$summary.action = "create"

if (-not $DryRun) {
  $created = Invoke-CloudflareApi -Method "POST" -Path "/zones/$resolvedZoneId/dns_records" -Token $token -Body @{
    type    = "CNAME"
    name    = $fqdn
    content = $resolvedTarget
    proxied = $proxiedValue
    ttl     = 1
  }

  $summary.recordId = $created.id
}

$summary | ConvertTo-Json -Depth 5
