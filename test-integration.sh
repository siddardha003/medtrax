#!/bin/bash

echo "🚀 MedTrax Integration Test Script"
echo "=================================="

echo ""
echo "📋 Checking Backend Server Health..."
curl -s http://localhost:5000/health | jq . || echo "Backend server not running"

echo ""
echo "📋 Testing Auth Endpoints..."
echo "POST /api/auth/register (Test registration)"
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}' | jq .

echo ""
echo "POST /api/auth/login (Test login)"
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq .

echo ""
echo "📋 Testing Public Endpoints..."
echo "GET /api/public/hospitals"
curl -s http://localhost:5000/api/public/hospitals | jq .

echo ""
echo "GET /api/public/shops"
curl -s http://localhost:5000/api/public/shops | jq .

echo ""
echo "✅ Integration test completed!"
echo "Check above for any errors or issues."
