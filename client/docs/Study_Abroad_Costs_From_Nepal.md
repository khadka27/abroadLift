# Study Abroad Cost Estimates (Applying from Nepal)

> **Note:** All values are approximate and shown in **USD**. Actual
> costs vary by city, university, airline, exchange rate, and lifestyle.

---

## Overall Cost of Living Formula

```
Total Estimated Cost =
  Before Departure Cost (one-time)
  + Tuition Fee × Study Duration (from University API)
  + Living Expenses × Study Duration (based on 6-month base)
```

### How It Works

| Component              | Calculation                                                   |
| ---------------------- | ------------------------------------------------------------- |
| Before Departure       | Sum of all one-time pre-departure expenses (paid once)        |
| Cash In Hand           | FOREX cash prepared before departure ($1,000–$2,000)          |
| Tuition Fee            | Annual tuition from university API × number of study years    |
| Living Expenses        | 6-month living base × 2 × number of study years              |
| **Estimated Total**    | **Before Departure + Tuition Total + Living Total**           |

### Example (USA — 4 Years)

| Item                         | Cost        |
| ---------------------------- | ----------- |
| Before Departure             | $5,000      |
| Cash In Hand                 | $1,500      |
| Tuition (4 years)            | $80,000     |
| Living Expenses (4 years)    | $96,000     |
| **Estimated Total**          | **$182,500**|

### Example (Canada — 2 Years)

| Item                         | Cost        |
| ---------------------------- | ----------- |
| Before Departure             | $3,500      |
| Cash In Hand                 | $1,500      |
| Tuition (2 years)            | $30,000     |
| Living Expenses (2 years)    | $36,000     |
| **Estimated Total**          | **$71,000** |

### API Response Example

```json
{
  "country": "USA",
  "duration": "4 Years",
  "beforeDeparture": {
    "min": 3500,
    "max": 15000
  },
  "cashInHand": {
    "min": 1000,
    "max": 2000
  },
  "livingCost": {
    "min": 66000,
    "max": 144000
  },
  "tuitionFee": 80000,
  "estimatedTotal": {
    "min": 150500,
    "max": 241000
  }
}
```

> The frontend only needs: **Country**, **Study Duration** (1, 2, 3, or 4 years),
> and **Tuition Fee** (from the university API) to calculate the overall estimated cost.

------------------------------------------------------------------------

# 🇺🇸 United States

## Before Departure Costs

  Expense                         Typical Cost (USD)
  ----------------------------- --------------------
  Passport                                \$45--\$90
  Student Visa                                 \$185
  SEVIS Fee                                    \$350
  University Application Fees            \$50--\$150
  IELTS / TOEFL / Duolingo               \$65--\$250
  Document Translation                   \$20--\$100
  Medical Examination                    \$80--\$250
  Vaccinations                           \$30--\$200
  Initial Health Insurance            \$300--\$1,500
  Flight Ticket                       \$800--\$1,800
  Airport Transportation                  \$10--\$50
  Extra Baggage                          \$50--\$250
  Accommodation Deposit               \$500--\$2,000
  Security Deposit                    \$500--\$2,000
  First Month Rent                    \$700--\$2,500
  Bank Setup                              \$10--\$50
  SIM/eSIM                                \$10--\$40
  Travel Insurance                       \$50--\$200
  Miscellaneous                         \$100--\$500

## First 6 Months Living Costs

  Expense                  6 Months (USD)
  ------------------- -------------------
  Accommodation         \$4,800--\$12,000
  Utilities                \$480--\$1,200
  Internet                   \$240--\$480
  Mobile Phone               \$180--\$420
  Food & Groceries       \$1,800--\$4,200
  Transportation           \$300--\$1,200
  Health Insurance         \$600--\$1,800
  Books                      \$300--\$900
  Personal Expenses        \$600--\$1,800
  Entertainment            \$300--\$1,200
  Laundry                    \$120--\$300
  Miscellaneous            \$300--\$1,200

------------------------------------------------------------------------

# 🇨🇦 Canada

## Before Departure Costs

  Expense                   Typical Cost (USD)
  ----------------------- --------------------
  Passport                          \$45--\$90
  Study Permit                    \$110--\$180
  Biometrics                        \$65--\$90
  IELTS/PTE                        \$65--\$250
  Medical Examination             \$100--\$250
  Flight Ticket                 \$900--\$1,900
  Health Insurance                \$300--\$900
  Accommodation Deposit         \$700--\$2,000
  Security Deposit              \$700--\$2,000
  First Month Rent              \$700--\$1,800
  Travel Insurance                 \$50--\$200
  SIM/eSIM                          \$10--\$40
  Miscellaneous                   \$100--\$400

## First 6 Months Living Costs

  Expense                  6 Months (USD)
  ------------------- -------------------
  Accommodation         \$4,200--\$10,800
  Utilities                \$420--\$1,080
  Internet                   \$270--\$480
  Mobile Phone               \$210--\$420
  Food & Groceries       \$1,500--\$3,600
  Transportation             \$360--\$900
  Health Insurance           \$300--\$900
  Books                      \$300--\$720
  Personal Expenses        \$480--\$1,500
  Entertainment            \$300--\$1,080
  Laundry                    \$120--\$240
  Miscellaneous            \$300--\$1,080

------------------------------------------------------------------------

# 🇦🇺 Australia

## Before Departure Costs

  Expense                   Typical Cost (USD)
  ----------------------- --------------------
  Passport                          \$45--\$90
  Student Visa                \$1,100--\$1,300
  IELTS/PTE                        \$65--\$250
  Medical Examination             \$120--\$300
  OSHC Health Cover               \$400--\$900
  Flight Ticket                 \$700--\$1,600
  Accommodation Deposit         \$800--\$2,000
  Security Deposit              \$800--\$2,000
  First Month Rent              \$900--\$2,000
  Travel Insurance                 \$50--\$200
  SIM/eSIM                          \$10--\$40
  Miscellaneous                   \$100--\$500

## First 6 Months Living Costs

  Expense                  6 Months (USD)
  ------------------- -------------------
  Accommodation         \$5,400--\$13,200
  Utilities                \$480--\$1,200
  Internet                   \$300--\$480
  Mobile Phone               \$150--\$360
  Food & Groceries       \$1,800--\$4,200
  Transportation           \$360--\$1,080
  Health Insurance           \$300--\$720
  Books                      \$300--\$900
  Personal Expenses        \$600--\$1,800
  Entertainment            \$480--\$1,500
  Laundry                    \$120--\$300
  Miscellaneous            \$480--\$1,500

------------------------------------------------------------------------

# 🇬🇧 United Kingdom

## Before Departure Costs

  Expense                          Typical Cost (USD)
  ------------------------------ --------------------
  Passport                                 \$45--\$90
  Student Visa                           \$650--\$750
  Immigration Health Surcharge         \$900--\$1,500
  IELTS                                   \$65--\$250
  Medical Examination                     \$80--\$250
  Flight Ticket                        \$700--\$1,500
  Accommodation Deposit                \$800--\$2,000
  Security Deposit                     \$800--\$2,000
  First Month Rent                     \$900--\$2,000
  Travel Insurance                        \$50--\$200
  SIM/eSIM                                 \$10--\$40
  Miscellaneous                          \$100--\$400

## First 6 Months Living Costs

  Expense                  6 Months (USD)
  ------------------- -------------------
  Accommodation         \$5,400--\$12,000
  Utilities                \$600--\$1,500
  Internet                   \$210--\$420
  Mobile Phone               \$120--\$300
  Food & Groceries       \$1,800--\$4,200
  Transportation           \$480--\$1,320
  Books                      \$240--\$720
  Personal Expenses        \$600--\$1,800
  Entertainment            \$420--\$1,500
  Laundry                    \$120--\$300
  Miscellaneous            \$360--\$1,200

------------------------------------------------------------------------

# 🇮🇪 Ireland

## Before Departure Costs

  Expense                   Typical Cost (USD)
  ----------------------- --------------------
  Passport                          \$45--\$90
  Student Visa                     \$65--\$120
  IELTS                            \$65--\$250
  Medical Examination              \$80--\$250
  Health Insurance                \$250--\$700
  Flight Ticket                 \$700--\$1,600
  Accommodation Deposit         \$800--\$2,000
  Security Deposit              \$800--\$2,000
  First Month Rent              \$900--\$2,000
  Travel Insurance                 \$50--\$200
  SIM/eSIM                          \$10--\$40
  Miscellaneous                   \$100--\$400

## First 6 Months Living Costs

  Expense                  6 Months (USD)
  ------------------- -------------------
  Accommodation         \$5,400--\$12,000
  Utilities                \$600--\$1,320
  Internet                   \$240--\$420
  Mobile Phone               \$120--\$300
  Food & Groceries       \$1,800--\$3,900
  Transportation           \$420--\$1,080
  Health Insurance           \$240--\$720
  Books                      \$240--\$600
  Personal Expenses        \$600--\$1,500
  Entertainment            \$420--\$1,200
  Laundry                    \$120--\$300
  Miscellaneous            \$360--\$1,080

------------------------------------------------------------------------

# 🇩🇪 Germany

## Before Departure Costs

  Expense                             Typical Cost (USD)
  --------------------------------- --------------------
  Passport                                    \$45--\$90
  Student Visa                               \$80--\$120
  APS Certificate (if applicable)           \$100--\$250
  IELTS/TestDaF                              \$65--\$250
  Medical Examination                        \$80--\$250
  Health Insurance                          \$150--\$500
  Flight Ticket                           \$700--\$1,500
  Accommodation Deposit                   \$700--\$2,000
  Security Deposit                        \$700--\$2,000
  First Month Rent                        \$700--\$1,500
  Travel Insurance                           \$50--\$200
  SIM/eSIM                                    \$10--\$40
  Miscellaneous                             \$100--\$400

## First 6 Months Living Costs

  Expense                 6 Months (USD)
  ------------------- ------------------
  Accommodation         \$3,600--\$8,400
  Utilities               \$600--\$1,320
  Internet                  \$210--\$360
  Mobile Phone              \$120--\$240
  Food & Groceries      \$1,500--\$3,000
  Transportation            \$240--\$600
  Health Insurance        \$720--\$1,080
  Books                     \$180--\$600
  Personal Expenses       \$480--\$1,200
  Entertainment             \$300--\$900
  Laundry                   \$120--\$240
  Miscellaneous             \$300--\$900

------------------------------------------------------------------------

# 🇲🇹 Malta

## Before Departure Costs

  Expense                   Typical Cost (USD)
  ----------------------- --------------------
  Passport                          \$45--\$90
  Student Visa                     \$80--\$150
  IELTS                            \$65--\$250
  Medical Examination              \$80--\$250
  Health Insurance                \$150--\$500
  Flight Ticket                 \$600--\$1,300
  Accommodation Deposit         \$500--\$1,500
  Security Deposit              \$500--\$1,500
  First Month Rent              \$600--\$1,200
  Travel Insurance                 \$50--\$200
  SIM/eSIM                          \$10--\$30
  Miscellaneous                   \$100--\$300

## First 6 Months Living Costs

  Expense                 6 Months (USD)
  ------------------- ------------------
  Accommodation         \$3,600--\$7,200
  Utilities               \$420--\$1,080
  Internet                  \$180--\$300
  Mobile Phone               \$90--\$210
  Food & Groceries      \$1,500--\$3,000
  Transportation            \$180--\$480
  Health Insurance          \$180--\$480
  Books                     \$180--\$480
  Personal Expenses       \$480--\$1,200
  Entertainment             \$300--\$900
  Laundry                   \$120--\$240
  Miscellaneous             \$240--\$720
