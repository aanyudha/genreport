# GRD Guide

## What Is GRD

GRD stands for GenReport Definition. A GRD file is the portable schema document that describes a report in a framework-agnostic way.

A GRD file answers the following questions:

- What is the report called?
- Where does the data come from?
- Which filters can the caller provide?
- Which columns should appear?
- How should results be grouped, sorted, summarized, and exported?

GRD files are intended to be:

- easy to validate
- easy to review in version control
- portable across runtimes
- friendly to AI-assisted generation

## Naming Convention

Recommended naming pattern:

- `kebab-case.grd.yaml`
- `kebab-case.grd.json`

Examples:

- `sales-summary.grd.yaml`
- `member-expiry.grd.yaml`
- `inventory-summary.grd.yaml`

Guidelines:

- Use short, stable, descriptive names
- Match `report.id` closely when practical
- Prefer YAML for hand-authored examples unless JSON is required

## Best Practices

- Keep `report.id` stable over time
- Use public-safe names and descriptions
- Keep filters focused on caller input, not internal query details
- Use clear presentation labels for columns and summaries
- Prefer portable field names that can survive runtime changes
- Keep exports declarative and separate from business logic
- Treat the GRD as the primary contract, not generated framework code

## Example Reports

The repository currently includes these example GRD files:

- [sales-summary.grd.yaml](/home/hsbg/Documents/genreport/examples/sales-summary.grd.yaml)
- [member-expiry.grd.yaml](/home/hsbg/Documents/genreport/examples/member-expiry.grd.yaml)
- [inventory-summary.grd.yaml](/home/hsbg/Documents/genreport/examples/inventory-summary.grd.yaml)
- [hotel-occupancy.grd.yaml](/home/hsbg/Documents/genreport/examples/hotel-occupancy.grd.yaml)
- [customer-balance.grd.yaml](/home/hsbg/Documents/genreport/examples/customer-balance.grd.yaml)

Invalid examples are also provided under [examples/invalid](/home/hsbg/Documents/genreport/examples/invalid) to demonstrate schema failures.

