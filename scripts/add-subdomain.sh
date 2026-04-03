#!/usr/bin/env bash
set -euo pipefail

SUBDOMAIN="${1:-}"
BASE_DOMAIN="${2:-aniweb.online}"
TARGET="${3:-}"
ZONE_ID="${CLOUDFLARE_ZONE_ID:-}"
TUNNEL_ID="${CLOUDFLARE_TUNNEL_ID:-}"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-}"
API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"

if [[ -z "$SUBDOMAIN" ]]; then
  echo "usage: add-subdomain.sh <subdomain> [base-domain] [target]" >&2
  exit 1
fi

if [[ -z "$API_TOKEN" ]]; then
  echo "missing CLOUDFLARE_API_TOKEN" >&2
  exit 1
fi

if [[ "$SUBDOMAIN" == *".$BASE_DOMAIN" ]]; then
  FQDN="$SUBDOMAIN"
else
  FQDN="$SUBDOMAIN.$BASE_DOMAIN"
fi

api() {
  local method="$1"
  local path="$2"
  local body="${3:-}"

  if [[ -n "$body" ]]; then
    curl -sS -X "$method" "https://api.cloudflare.com/client/v4${path}" \
      -H "Authorization: Bearer ${API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data "$body"
  else
    curl -sS -X "$method" "https://api.cloudflare.com/client/v4${path}" \
      -H "Authorization: Bearer ${API_TOKEN}" \
      -H "Content-Type: application/json"
  fi
}

if [[ -z "$ZONE_ID" ]]; then
  ZONE_ID="$(api GET "/zones?name=${BASE_DOMAIN}&status=active" | jq -r '.result[0].id // empty')"
fi

if [[ -z "$ZONE_ID" ]]; then
  echo "could not resolve Cloudflare zone id for ${BASE_DOMAIN}" >&2
  exit 1
fi

if [[ -z "$TARGET" ]]; then
  if [[ -z "$TUNNEL_ID" ]]; then
    if [[ -z "$ACCOUNT_ID" ]]; then
      echo "missing tunnel target. set TUNNEL_ID or ACCOUNT_ID" >&2
      exit 1
    fi

    TUNNEL_ID="$(api GET "/accounts/${ACCOUNT_ID}/cfd_tunnel" | jq -r '.result[0].id // empty')"
  fi

  TARGET="${TUNNEL_ID}.cfargotunnel.com"
fi

EXISTING="$(api GET "/zones/${ZONE_ID}/dns_records?type=CNAME&name=${FQDN}" | jq -r '.result[0].id // empty')"

if [[ -n "$EXISTING" ]]; then
  BODY="$(jq -n --arg name "$FQDN" --arg content "$TARGET" '{type:"CNAME",name:$name,content:$content,proxied:true,ttl:1}')"
  api PUT "/zones/${ZONE_ID}/dns_records/${EXISTING}" "$BODY" >/dev/null
  echo "updated ${FQDN} -> ${TARGET}"
else
  BODY="$(jq -n --arg name "$FQDN" --arg content "$TARGET" '{type:"CNAME",name:$name,content:$content,proxied:true,ttl:1}')"
  api POST "/zones/${ZONE_ID}/dns_records" "$BODY" >/dev/null
  echo "created ${FQDN} -> ${TARGET}"
fi
