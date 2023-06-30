const clearFields = (cy) => {
  cy.get('input[name="title"]').clear();
  cy.get('input[name="dueDate"]').clear();
};

function formatDateWithOffset(daysOffset = 0) {
  const date = new Date(); // Get the current date
  date.setDate(date.getDate() + daysOffset); // Add or subtract days based on the offset

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
describe("", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("STUDENT_SUBMISSION_URL"));
  });
  it("contains an input field with name attribute `title`", () => {
    cy.get('input[name="title"]').should("exist");
  });
  it("contains an input date field with name attribute `dueDate`", () => {
    cy.get('input[name="dueDate"]').should("exist");
  });
  it("contains a submit button", () => {
    cy.get('button[type="submit"]').should("exist");
  });
  it("contains one element with the given IDs in each of sections Overdue, Due Today, Due Later and Completed to show the count of todos", () => {
    cy.get("#count-overdue").should("be.visible");
    cy.get("#count-due-today").should("be.visible");
    cy.get("#count-due-later").should("be.visible");
    cy.get("#count-completed").should("be.visible");
  });

  it("Should not create a todo item with empty title", () => {
    clearFields(cy);
    cy.get('input[name="dueDate"]').type(formatDateWithOffset(0));
    cy.get('button[type="submit"]').click();
    cy.wait(500);
    cy.get('.Todo-Item').should('not.exist');

  });
  it("Should not create a todo item with empty dueDate", () => {
    clearFields(cy);
    cy.get('input[name="title"]').type("Sample due today item");
    cy.get('button[type="submit"]').click();
    cy.wait(500);
    cy.get('.Todo-Item').should('not.exist');

  });

  it("Should create sample due today item", () => {
    clearFields(cy);
    cy.get('input[name="title"]').type("Sample due today item");
    cy.get('input[name="dueDate"]').type(formatDateWithOffset(0));
    
    cy.get('button[type="submit"]').click();
    cy.wait(500);
    cy.get('.Todo-Item').should('exist');
    cy.get("#count-due-today").contains("1");

  });

  it("Should create sample due later item", () => {
    clearFields(cy);
    cy.get('input[name="title"]').type("Sample due later item");
    cy.get('input[name="dueDate"]').type(formatDateWithOffset(3));
    
    cy.get('button[type="submit"]').click();
    cy.wait(500);
    cy.get('.Todo-Item').should('exist');
    cy.get("#count-due-later").contains("1");

  });
  it("Should create sample overdue item", () => {
    clearFields(cy);
    cy.get('input[name="title"]').type("Sample overdue item");
    cy.get('input[name="dueDate"]').type(formatDateWithOffset(-3));
    
    cy.get('button[type="submit"]').click();
    cy.wait(500);
    cy.get('.Todo-Item').should('exist');
    cy.get("#count-overdue").contains("1");

  });

  it("Should mark sample overdue item as completed", () => {
    clearFields(cy);
    cy.contains('label', 'Sample overdue item').click();
    cy.wait(500);
    cy.get("#count-completed").contains("1");
    cy.contains('label', 'Sample overdue item').invoke('attr', 'for').then((forAttribute) => {
      // Handle the 'for' attribute value
      cy.get(`#${forAttribute}`).should('be.checked');
    });

  });

  it("Should toggle a completed item to incomplete when clicked on it", () => {
    clearFields(cy);
    cy.contains('label', 'Sample overdue item').click();
    cy.wait(500);
    cy.get("#count-completed").contains("0");
    cy.get("#count-overdue").contains("1");
    cy.contains('label', 'Sample overdue item').invoke('attr', 'for').then((forAttribute) => {
      // Handle the 'for' attribute value
      cy.get(`#${forAttribute}`).should('not.be.checked');
    });

  });

  it("Should delete an item", () => {
    clearFields(cy);
    cy.contains('label', 'Sample overdue item').next('a').trigger('mouseover', { force: true }).click({ force: true })
    cy.get("#count-overdue").contains("0");

  });
});
