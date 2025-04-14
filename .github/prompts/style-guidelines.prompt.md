# Style Guidelines

When contributing to this project, please adhere to the following style conventions:

## Naming Conventions

### Functions

- Use **`PascalCase`** for all functions (both private and public)

```ts
function DoSomething() { ... }
```

### Variables

- Use **`camelCase`** for local variables

```ts
function Test(some_variable: number) {
	const someLocalVariable2 = "test";
}
```

- Use **`PascalCase`** for public variables or variables that are getting exported (in classes, namespaces and global space)
- Use **`_camelCaseWithUnderscore`** for private variables in classes

### Classes

- Use **`PascalCase`** for public and private functions in classes

### Interfaces & Enums

- Interfaces are ALWAYS prefixed with **I**

```ts
interface IUser { ... }
```

- Enums are ALWAYS prefixed with **E**

```ts
enum EDirection { ... }
```

- Since variables in interfaces are public, always use **`PascalCase`** for them

```ts
interface IUser {
	FirstName: string;
	LastName: string;
}
```

### Constants

- Constants are ALWAYS using **`CONSTANT_CASE`**

```ts
const MAX_USERS = 100;
```

## Code Structure

- Prefer creating nested functions using variables

```ts
function MainFunction() {
	const SubFunction = () => {
		// ...Do something
	};
}
```
