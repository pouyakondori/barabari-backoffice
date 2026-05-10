# Copilot Skills — Barabari Backoffice

## Skill: Create an Admin Page

When asked to create a new admin page:

1. Create a page component in `src/pages/<domain>/` (PascalCase file name)
2. Use Ant Design components (Table, Form, Modal, Card, etc.) for the UI
3. Add the route in `App.tsx` using `React.lazy()` import and wrap with `<ProtectedRoute>`
4. Add navigation item in the `AdminLayout` sidebar menu
5. Add translations in `src/locale/fa.json` and `src/locale/en.json`
6. Use `usePagination` hook for list pages

Example lazy route:
```tsx
const NewPage = React.lazy(() => import("./pages/domain/NewPage"));

// In Routes:
<Route path="/admin/new-page" element={
  <ProtectedRoute>
    <AdminLayout>
      <Suspense fallback={<Spin />}>
        <NewPage />
      </Suspense>
    </AdminLayout>
  </ProtectedRoute>
} />
```

## Skill: Create a List Page with Table

When asked to create a list/table page:

1. Create the page component in `src/pages/<domain>/`
2. Use Ant Design `<Table>` with columns definition
3. Use `useQuery` from Apollo Client to fetch data
4. Use `usePagination` hook for pagination state
5. Add search/filter controls using Ant Design `<Input.Search>` or `<Select>`
6. Include action buttons (Edit, Delete) in the last column

## Skill: Create a Form Page

When asked to create a create/edit form:

1. Use Ant Design `<Form>` component with `form.useForm()`
2. Use zod schema for validation
3. Use `useMutation` from Apollo Client for submit
4. Use `useNotification` hook for success/error messages
5. Handle both create and edit modes via URL params

## Skill: Add a GraphQL Query or Mutation

When asked to add a new GraphQL operation:

1. Add query in `src/graphql/queries/<name>.ts` or mutation in `src/graphql/mutations/<name>.ts`
2. Use `gql` tagged template from `@apollo/client`
3. Define TypeScript types in `src/types/index.ts`
4. Use the operation in components with `useQuery()` or `useMutation()`

## Skill: Add a Custom Hook

When asked to create a custom hook:

1. Create in `src/hooks/` with `use` prefix
2. Return a well-typed object
3. Handle loading, error, and data states appropriately
