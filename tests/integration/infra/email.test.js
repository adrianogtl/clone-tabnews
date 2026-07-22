import orchestrator from "tests/orchestrator.js";
import email from "infra/email.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "adrianogtl <adrianogtl@protonmail.com>",
      to: "contato@curso.dev",
      subject: "Email Subject",
      text: "Email body.",
    });

    await email.send({
      from: "adrianogtl <adrianogtl@protonmail.com>",
      to: "contato@curso.dev",
      subject: "Last email subject",
      text: "Last email body.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<adrianogtl@protonmail.com>");
    expect(lastEmail.recipients[0]).toBe("<contato@curso.dev>");
    expect(lastEmail.subject).toBe("Last email subject");
    expect(lastEmail.text).toBe("Last email body.\n");
  });
});
