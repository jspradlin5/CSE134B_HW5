
# CSE 134B - Homework 5

**Student:** Jude Spradlin

## Repository

https://github.com/jspradlin5/CSE134B_HW5

## Part 1: Web Component

I created a Random Facts Web Component using a custom
element named fact-panel. The component uses DOM methods to create its interface and event listeners to update the displayed content.

An external button changes the compact attribute,
allowing users to switch between compact and expanded modes without changing the current fact.

## Part 2: Web API

The component uses the Useless Facts API:

https://uselessfacts.jsph.pl/api/v2/facts/random

It uses fetch() to retrieve JSON data, checks the HTTP response status, validates the returned text, and updates the displayed fact without reloading the page.

## Part 3: Themes and Preferences

The component uses CSS custom properties to match the portfolio's light and dark themes. The compact or expanded preference is saved using localStorage with the key hw5-fact-panel-mode.

Storage errors are handled using try/catch so the
component remains functional even when storage is
unavailable.

## Part 4: Static Site Generation

Exercise folder: ssg-exercise/

The exercise uses Eleventy to generate two existing
portfolio pages:

- Home: http://localhost:8080/
- About: http://localhost:8080/about.html

Both pages use the shared footer located at:

ssg-exercise/src/_includes/footer.njk

Installation, build, and preview instructions are
included in ssg-exercise/README.md.

## Design Note

The goal of the Random Facts component is to allow
visitors to discover interesting facts without leaving or refreshing the page.

When a visitor clicks Get Another Fact, an event
listener calls an asynchronous function that sends
a GET request to the Useless Facts API. While waiting for the response, the component displays a loading message and temporarily disables the request button.

If the request succeeds, the returned text is validated and displayed using textContent. The component then shows a success message.

If the request fails, the previous fact remains visible and an error message asks the visitor to try again. The button is enabled again after either outcome.

The component also supports keyboard navigation,
compact and expanded modes, and a fallback message
when JavaScript is disabled.
