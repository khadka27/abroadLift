# 📊 Cost Estimate API Demo (Boston, USA)

This document provides a demo of the request parameters and JSON response payload returned by the `/api/cost-estimate` endpoint. It uses **Boston, USA** as a reference city, with an annual tuition fee of **$25,000 USD** and a current USD/NPR exchange rate of **134.20**.

---

## 🔌 API Request Details

* **Endpoint**: `GET /api/cost-estimate`
* **Query Parameters**:
  * `city`: `Boston`
  * `country`: `US`
  * `tuition_usd`: `25000`

---

## 📦 Demo JSON Response Payload

```json
{
  "city": "Boston",
  "country": "US",
  "exchange_rate": 134.2,
  "tuition_npr": 3355000,
  "living_npr": 2514801,
  "housing_npr": 1517003,
  "food_npr": 595213,
  "transport_npr": 241560,
  "healthcare_npr": 161040,
  "education_npr": 3355000,
  "total_npr": 5869801,
  "monthly_npr": 209567
}
```

---

## 🔍 Detailed Breakdown of Fields

| Field Name | Type | Value (NPR) | Value (USD Equivalent) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`city`** | `string` | `"Boston"` | N/A | The target city requested. |
| **`country`** | `string` | `"US"` | N/A | The country code requested. |
| **`exchange_rate`** | `number` | `134.2` | N/A | The USD to Nepalese Rupee (NPR) exchange rate. |
| **`tuition_npr`** | `number` | `3,355,000` | `$25,000.00` | The annual tuition cost converted to NPR. |
| **`living_npr`** | `number` | `2,514,801` | `$18,739.20` | Total estimated annual cost of living in NPR. |
| **`housing_npr`** | `number` | `1,517,003` | `$11,304.00` | Annual rent/housing cost ($942.00/mo) in NPR. |
| **`food_npr`** | `number` | `595,213` | `$4,435.20` | Annual groceries/food cost ($369.60/mo) in NPR. |
| **`transport_npr`** | `number` | `241,560` | `$1,800.00` | Annual public transportation cost ($150.00/mo) in NPR. |
| **`healthcare_npr`** | `number` | `161,040` | `$1,200.00` | Annual healthcare/insurance cost ($100.00/mo) in NPR. |
| **`education_npr`** | `number` | `3,355,000` | `$25,000.00` | Total academic costs (equal to annual tuition) in NPR. |
| **`total_npr`** | `number` | `5,869,801` | `$43,739.20` | **Grand total** (Tuition + Living) required annually in NPR. |
| **`monthly_npr`** | `number` | `209,567` | `$1,561.60` | Estimated monthly living budget in NPR. |

---

## 🧮 How the Calculations Work Under the Hood

1. **Exchange Rate Fetching**:
   - The server queries `https://open.er-api.com/v6/latest/USD`. If it succeeds, it extracts the live NPR rate (`134.2` in this demo). If it fails, it uses `133.5`.
2. **Cost of Living Scaling**:
   - The server checks for `API_NINJAS_KEY`. If configured, it fetches the cost of living indices for Boston from the API.
   - Boston's rent index (`78.5%` of NYC base) and groceries index (`92.4%` of NYC base) are retrieved.
   - The base US monthly costs are scaled dynamically:
     - **Housing**: `$1,200 (base) * 0.785 = $942.00`
     - **Food**: `$400 (base) * 0.924 = $369.60`
     - **Transportation**: `$150.00` (fixed base)
     - **Healthcare**: `$100.00` (fixed base)
3. **Monthly to Annual Conversion**:
     - `Monthly Living = $942.00 + $369.60 + $150.00 + $100.00 = $1,561.60`
     - `Annual Living = $1,561.60 * 12 = $18,739.20`
4. **NPR Conversion & Rounding**:
     - All USD numbers are multiplied by the exchange rate (`134.20`) and rounded to the nearest integer before returning the JSON payload.
