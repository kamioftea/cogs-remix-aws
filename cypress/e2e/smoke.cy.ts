import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  it("should allow you to register and login", () => {
    const loginForm = {
      name: faker.person.fullName(),
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /name/i }).type(loginForm.name);
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByRole("button", { name: /register/i })
      .click()
      .wait(500);

    cy.request(
      "POST",
      `/__tests/validate-user-and-redirect/${encodeURIComponent(
        loginForm.email,
      )}`,
    ).then((res) => {
      const redirectUrl = res.body.redirect.replace(
        /http:\/\/localhost:(3000|8811)\//,
        "/",
      );
      cy.task("log", `Received redirect to ${redirectUrl}`);
      return cy.visit(redirectUrl);
    });

    cy.findByLabelText(/new password/i).type(loginForm.password);
    cy.findByRole("button", { name: /Set password/i })
      .click()
      .wait(500);

    cy.url().then((url) => {
      if (!url.match(/\/account$/)) {
        cy.visitAndCheck("/account");
      }
    });

    cy.findByText(/logged in as/i).should("contain.text", loginForm.name);
  });
});
