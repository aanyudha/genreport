# Contributing to GenReport

Thank you for contributing to GenReport. This repository is building the public foundation for an AI-native, schema-first reporting ecosystem, and contributions should protect that direction.

## Public Contribution Guidelines

- Keep contributions suitable for a public open-source repository.
- Do not include secrets, access tokens, credentials, private URLs, or proprietary business information.
- Use only generic example data and neutral naming.
- Open issues or discussions before proposing large directional changes.

## Development Principles

- Keep the report definition as the source of truth.
- Prefer portable contracts over framework-specific behavior.
- Separate runtime behavior, framework integration, and export formatting.
- Favor clarity, validation, and long-term compatibility.

## Runtime-First Rule

GenReport must remain runtime-first. Core behavior should be executed from the report definition at runtime rather than relying on generated framework code as the main architecture.

If you propose tooling that generates code, it must remain optional and must not replace the runtime as the primary execution model.

## Schema-First Rule

Schema design comes before package convenience. Changes to the definition format should prioritize:

- portability
- validation
- backwards compatibility where practical
- clear semantics for AI and human authors

## No Secrets, No Private Data

Never commit:

- API keys
- tokens
- passwords
- internal endpoints
- customer records
- personal data
- hotel or business-specific private datasets

## How to Propose Schema Changes

1. Open a schema proposal issue using the provided template.
2. Explain the reporting use case and the limitation in the current draft.
3. Describe the proposed field, structure, or rule.
4. Document validation impact, runtime impact, and compatibility considerations.
5. Update `docs/SPECIFICATION.md` and `schema/genreport.schema.json` together when a proposal is accepted.

