# 0002 - No service/repository layer, a generic CRUD controller instead

**Status:** accepted

**Context.** Five resources with identical create/read/update/delete behaviour and no business rules.

**Decision.** Routes -> middleware (auth, validate) -> a shared `createCrudController`
-> Prisma. Resource differences (ordering, `beforeSave`) are configuration.

**Why not layers.** A service layer here would be pass-through code. It adds files
without isolating anything.

**When to revisit.** The first time a rule spans models or needs to be reused
(e.g. computing project stats, sending notification emails), extract a service for that feature only.
