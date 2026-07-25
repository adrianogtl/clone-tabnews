import database from "infra/database.js";
import email from "infra/email.js";
import webserver from "infra/webserver.js";
import user from "models/user.js";
import { NotFoundError } from "infra/errors.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 Minutes

async function findOneValidById(tokenId) {
  const activationTokenObject = await runSelectQuery(tokenId);

  return activationTokenObject;

  async function runSelectQuery(tokenId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          user_activation_tokens
        WHERE
          id = $1
          AND expires_at > NOW()
          AND used_at IS NULL
        LIMIT
          1
      ;`,
      values: [tokenId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "The activation token was not found or expired.",
        action: "Sign up again.",
      });
    }

    return results.rows[0];
  }
}

async function markTokenAsUsed(activationTokenId) {
  const usedActivationTokenObject = await runUpdateQuery(activationTokenId);
  return usedActivationTokenObject;

  async function runUpdateQuery(activationTokenId) {
    const results = await database.query({
      text: `
        UPDATE
          user_activation_tokens
        SET
          used_at = timezone('utc', now()),
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
      ;`,
      values: [activationTokenId],
    });

    return results.rows[0];
  }
}

async function activateUserByUserId(userId) {
  const activatedUser = await user.setFeatures(userId, ["create:session"]);
  return activatedUser;
}

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          user_activation_tokens (user_id, expires_at)
        VALUES
          ($1, $2)
        RETURNING
          *
      ;`,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "TabNews <contact@tabnews.com>",
    to: user.email,
    subject: "Activate your account in TabNews!",
    text: `${user.username}, please activate your account by clicking the link below:

${webserver.origin}/signup/activate/${activationToken.id}

If you didn't request this email, you can ignore it.

Thanks,
TabNews Team
    `,
  });
}

const activation = {
  findOneValidById,
  markTokenAsUsed,
  activateUserByUserId,
  create,
  sendEmailToUser,
};

export default activation;
