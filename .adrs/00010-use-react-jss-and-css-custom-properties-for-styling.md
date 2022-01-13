# Use react-jss And CSS Custom Properties For Styling

- Status: Accepted

# Context

Web clients must be styled via CSS. A strategy for wrangling CSS must be outlined.

For a CSS strategy, we are looking for a few features: tooling, scoping, speed of development, speed at runtime.

### Tailwind

[Tailwind CSS](https://tailwindcss.com/) is built as a utility-class-first system. The idea is to take a set of existing classes and directly apply them to your elements. In practice, it [adds a lot of complexity with very little value.](https://dev.to/brianboyko/tailwindcss-adds-complexity-does-nothing-3hpn) The classes can be replaced with inline styles, the purge process is finicky, there's extra tooling involved, and it leads to very messy HTML/JSX which is difficult to maintain.

### CSS Modules + Custom Properties

The idea here is to use a combination of CSS modules and CSS custom properties. By using CSS modules, we can get locally scoped styles for specific components and we can use CSS custom properties for dynamic theming options with no JS overhead.

However, the tooling does not exist to support this workflow. It is impossible to get consistent intellisense and accurate linting around what custom properties are available. If the tooling was there, this would be a great approach.

### CSS-in-JS via react-jss

[react-jss](https://cssinjs.org/react-jss/?v=v10.7.1) allows you to do all of your styling in JS which gives you things like type checking, dynamic properties, and cohesion between components and their styles.

This does come with some overhead as the styles have to be generated from the JS side of things rather than being static CSS files.

# Decision

I will style the UI using [react-jss](https://cssinjs.org/react-jss/?v=v10.7.1) combined with CSS custom properties for dynamic theming values.

# Consequences

Using react-jss means the CSS will be scoped to the relevant components.

We will be able to dynamically change values at runtime based on props.

Global theming is done with CSS custom properties which enables easy theme modifications by the user and a fast implementation.

We are choosing to sacrifice some potential runtime performance by preventing mutations of state and generating CSS at runtime.
