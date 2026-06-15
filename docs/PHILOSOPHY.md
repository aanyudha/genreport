# GenReport Philosophy

## Schema First

GenReport starts with the definition contract. A report should be described in a standard, reviewable, versioned format before runtime execution details are considered.

Schema-first design improves portability, validation, documentation quality, and long-term maintainability.

## Runtime First

GenReport is runtime-first, not code-generator-first. The core engine should read a GRD and execute it directly. Optional code generation may appear later, but it must not become the primary execution model.

This keeps behavior centralized and reduces drift between definitions and generated files.

## Framework Agnostic

The standard must not depend on a single framework, language, or deployment environment. Integrations should adapt runtimes to frameworks, not redefine the report contract.

## AI Native

GenReport is designed for a future where AI can reliably generate report definitions from prompts. That means the standard must be structured, deterministic, simple to validate, and explicit about intent.

## Open Standard

The GenReport Definition should evolve as an open standard that can be implemented across ecosystems. Public documentation, versioned schemas, and compatibility rules are part of the product itself, not side artifacts.

