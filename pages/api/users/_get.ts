import type { NextApiRequest } from "next";

import { defaultResponder } from "@calcom/lib/server";

import { withMiddleware } from "@lib/helpers/withMiddleware";
import { schemaUsersReadPublic } from "@lib/validations/user";

import { Prisma } from ".prisma/client";

/**
 * @swagger
 * /users:
 *   get:
 *     operationId: listUsers
 *     summary: Find all users.
 *     tags:
 *     - users
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *        description: Authorization information is missing or invalid.
 *       404:
 *         description: No users were found
 */
async function getHandler(req: NextApiRequest) {
  const {
    userId,
    prisma,
    isAdmin,
    pagination: { take, skip },
  } = req;
  const where: Prisma.UserWhereInput = {};
  // If user is not ADMIN, return only his data.
  if (!isAdmin) where.id = userId;
  const data = await prisma.user.findMany({ where, take, skip });
  const users = schemaUsersReadPublic.parse(data);
  return { users };
}

export default withMiddleware("pagination")(defaultResponder(getHandler));
